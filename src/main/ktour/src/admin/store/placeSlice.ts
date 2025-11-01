// 장소(Place) 관련 상태/비동기 로직을 관리하는 Redux Toolkit 슬라이스
// - 목록 조회, 상세 조회, 저장 관련 thunk와 리듀서를 포함합니다.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './axios';

/**
 * 상세 조회
 * @param pno 상세를 조회할 장소 고유번호
 * @returns 서버에서 내려준 상세 데이터
 */
export const fetchPlaceDetail = createAsyncThunk(
  'place/fetchDetail',
  async (pno: number) => {
    const { data } = await api.get('/placeinfo/basic', { params: { pno } });
    return data;
  }
);

/**
 * 목록 조회
 * - 전달된 `params`가 없으면 현재 상태의 `filters`, `page`, `size`를 사용합니다.
 * - 서버 응답을 테이블/페이지네이션에 필요한 형태로 가공합니다.
 */
export const fetchPlaceList = createAsyncThunk(
  'place/fetchList',
  async (params: any | undefined, thunkAPI) => {
    const state: any = (thunkAPI.getState() as any)?.place || {};
    const query = params ?? { ...(state.filters || {}), page: state.page ?? 1, size: state.size ?? 10 };
    const { data } = await api.get('/placeinfo/search', { params: query });
    return {
      rows: data?.content ?? [],
      total: data?.totalElements ?? 0,
      raw: data,
      page: data?.currentPage ?? query.page,
      size: data?.size ?? query.size,
      filters: query,
    };
  }
);

/**
 * 기본 정보 저장
 * - 멀티파트(FormData) 업로드를 수행합니다.
 * - 저장 성공 후, 상태에 보관된 `selectedPno`가 있으면 상세 재조회 합니다.
 */
export const saveBasic = createAsyncThunk(
  'place/saveBasic',
  async (fd: FormData, thunkAPI) => {
    const { data } = await api.post('/placeinfo/basic', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    try {
      const pno = Number(data ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    return data;
  }
);

/**
 * 관광지 소개 저장
 * - DTO를 그대로 POST 전송합니다.
 * - `pNo/pno`를 추출해 성공 시 상세를 재조회합니다.
 */
export const saveTourIntro = createAsyncThunk(
  'place/saveTourIntro',
  async (dto: any, thunkAPI) => {
    await api.post('/placeinfo/tourIntro', dto);
    try {
      const pno = Number(dto?.pNo ?? dto?.pno ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    return true;
  }
);

/**
 * 축제 소개 저장
 */
export const saveFestivalIntro = createAsyncThunk(
  'place/saveFestivalIntro',
  async (dto: any, thunkAPI) => {
    console.log(dto)
    await api.post('/placeinfo/festivalintro', dto);
    try {
      const pno = Number(dto?.pNo ?? dto?.pno ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    return true;
  }
);

/**
 * 음식점 소개 저장
 */
export const saveRestaurantIntro = createAsyncThunk(
  'place/saveRestaurantIntro',
  async (dto: any, thunkAPI) => {
    await api.post('/placeinfo/restaurant', dto);
    try {
      const pno = Number(dto?.pNo ?? dto?.pno ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    return true;
  }
);

/**
 * 반복 정보 저장
 * @param payload { pNo, rows } 형태로 전달되며 rows 배열을 서버에 저장합니다.
 * - 저장 성공 시 해당 pNo로 상세를 재조회합니다.
 */
export const saveRepeatInfo = createAsyncThunk(
  'place/saveRepeatInfo',
  async (payload: { pNo: number, rows: any[] }, thunkAPI) => {
    await api.post('/placeinfo/repeatinfo', payload.rows);
    try {
      const pno = Number(payload?.pNo ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    return true;
  }
);

/**
 * 일괄 저장(신규) - POST /placeinfo/all
 * - FormData: placeInfo/marker/imagesMeta/(files)/tourIntro/festivalIntro/restaurantIntro/placeInfoRepeat
 */
export const saveAllNew = createAsyncThunk(
  'place/saveAllNew',
  async (fd: FormData, thunkAPI) => {
    const { data } = await api.post('/placeinfo/all', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    try {
      const pno = Number(data ?? 0);
      if (pno) thunkAPI.dispatch(fetchPlaceDetail(pno));
    } catch {}
    // 신규는 서버 응답에 pNo가 없어 상세 갱신 생략(필요시 목록 재조회 권장)
    return true;
  }
);

/**
 * 일괄 저장(수정) - PUT /placeinfo/all
 * - FormData 동일, placeInfo.pNo 필수
 */
export const saveAllUpdate = createAsyncThunk(
  'place/saveAllUpdate',
  async (payload: { fd: FormData, pNo: number }, thunkAPI) => {
    await api.put('/placeinfo/all', payload.fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    try {
      if (payload?.pNo) thunkAPI.dispatch(fetchPlaceDetail(Number(payload.pNo)));
    } catch {}
    return true;
  }
);

// 슬라이스 상태 구조
type PlaceState = {
  rows: any[];           // 목록 데이터 (표에 표시되는 행들)
  total: number;         // 목록 총 개수 (페이지네이션)
  listRaw: any | null;   // 목록 API의 원본 응답(필요 시 디버깅/추가 정보)
  filters: any | null;   // 목록 검색/필터 조건
  page: number;          // 현재 페이지
  size: number;          // 페이지 당 행 수

  detail: any | null;    // 선택된 장소 상세 데이터
  loading: boolean;      // 비동기 처리 중 여부
  error: string | null;  // 에러 메시지(있을 경우)

  contentType: string | null; // 현재 상세 콘텐츠 유형(예: TOUR/FESTIVAL/RESTAURANT 등)
  selectedPno: number | null; // 현재 선택된 장소 번호

  mainImgTempUrl: string | null;    // 미리보기에 출력될 메인 이미지
  detailImgTempUrl: any | [];  // 미리보기에 출력될 상세 이미지
};

// 상태 초기값
const initialState: PlaceState = {
  rows: [],
  total: 0,
  listRaw: null,
  filters: null,
  page: 1,
  size: 10,

  detail: null,
  loading: false,
  error: null,

  contentType: null,
  selectedPno: null,

  mainImgTempUrl: null,
  detailImgTempUrl: [],
};

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    setContentType: (s, a) => { s.contentType = (a.payload ?? null) && String(a.payload); }, // 상세 표시 콘텐츠 유형 설정
    clearDetail: (s) => { s.detail = null; s.contentType = null; s.error = null; }, // 상세 및 오류 초기화
    setListFilters: (s, a) => { s.filters = a.payload || null; }, // 목록 검색/필터 조건 설정
    setPage: (s, a) => { s.page = Number(a.payload) || 1; }, // 현재 페이지 설정
    setSize: (s, a) => { s.size = Number(a.payload) || 10; }, // 페이지 사이즈 설정
    setMainTemp: (state, action) => { state.mainImgTempUrl = action.payload; },
    setDetailTemp: (state, action) => { state.detailImgTempUrl = action.payload; },
  },
  extraReducers: (b) => {
    // 목록 조회
    b.addCase(fetchPlaceList.pending,  (s)=>{ s.loading = true; s.error = null; })
     .addCase(fetchPlaceList.fulfilled,(s,a)=>{ s.loading=false; s.rows=a.payload.rows; s.total=a.payload.total; s.listRaw=a.payload.raw; s.page = a.payload.page; s.size = a.payload.size; s.filters = a.payload.filters; })
     .addCase(fetchPlaceList.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'list error'); });

    // 상세 조회
    b.addCase(fetchPlaceDetail.pending,  (s,a)=>{ s.loading = true; s.error = null; s.selectedPno = Number((a as any).meta?.arg ?? 0) || null; })
     .addCase(fetchPlaceDetail.fulfilled,(s,a)=>{ s.loading=false; s.detail=a.payload; })
     .addCase(fetchPlaceDetail.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'detail error'); });

    // 저장 액션들 (성공 시 별도 상태 변경은 없고, 관련 thunk에서 상세 재조회 처리)
    b.addCase(saveBasic.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveBasic.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveBasic.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save basic error'); });

    b.addCase(saveTourIntro.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveTourIntro.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveTourIntro.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save tour error'); });

    b.addCase(saveFestivalIntro.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveFestivalIntro.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveFestivalIntro.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save festival error'); });

    b.addCase(saveRestaurantIntro.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveRestaurantIntro.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveRestaurantIntro.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save restaurant error'); });

    b.addCase(saveRepeatInfo.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveRepeatInfo.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveRepeatInfo.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save repeat error'); });

    // 일괄 저장(신규/수정)
    b.addCase(saveAllNew.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveAllNew.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveAllNew.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save all (new) error'); });

    b.addCase(saveAllUpdate.pending, (s)=>{ s.loading=true; s.error=null; })
     .addCase(saveAllUpdate.fulfilled,(s)=>{ s.loading=false; })
     .addCase(saveAllUpdate.rejected, (s,a)=>{ s.loading=false; s.error=String(a.error.message||'save all (update) error'); });
  }
});

export const { setContentType, clearDetail, setListFilters, setPage, setSize, setMainTemp, setDetailTemp } = placeSlice.actions;
export default placeSlice.reducer;

