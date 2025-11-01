import { createSlice } from "@reduxjs/toolkit";

// 1. 초기값 설정
const initialState = {
    selectedLdNo: null,                 // 선택한 법정동코드
    selectedLeftMarker: null,           // 클릭한 마커 pNo + 검색결과에서 클릭한 마커 pNo
    selectedRightMarker: null,          // 우측 리스트에서 클릭한 플레이스 pNo
    markers: [],                        // 렌더링된 마커 배열
    selectedCategory: "all",            // 선택한 카테고리
    centeredLDong: null,                // 중심좌표 기준 법정동
    firstLDong: null,                   // 최초 렌더링된 법정동
    axiosOption: { withCredentials: true }, // Axios를 위한 공통 Cors Option
    LdongName: [],                      // 법정 시구 배열
    activeLnbMenu: 'mySurroundings',    // 활성화된 Lnb 메뉴
    regionSignguList: [],               // '지역 선택'의 시군구 목록
    activeSearchBox: null,              // 검색결과 활성화 여부
    currentPosition: {                  // 사용자 위치
        lat: null,
        lng: null
    },
    searchResult: [],                   // 검색결과
    searchLatLng: {                     // 검색결과에서 선택한 장소 좌표
        lat: null,
        lng: null
    },
    recommendLatLng: {                  // 추천플레이스 장소 좌표
        lat: null,
        lng: null
    },
};

// 2. Slice 함수 정의
const mapSlice = createSlice({
    name: "relatedMap",
    initialState,
    reducers: {
        selectedSigngu: (state, action) => {
            state.selectedLdNo = action.payload;
        }, // selectedCity end
        selectLeftMarker: (state, action) => {
            state.selectedLeftMarker = action.payload;
        }, // selectLeftMarker end
        selectRightMarker: (state, action) => {
            state.selectedRightMarker = action.payload;
        }, // selectRightMarker end
        renderedMarker: (state, action) => {
            state.markers = action.payload;
        }, // renderedMarker end
        selectCategory: (state, action) => {
            state.selectedCategory = action.payload;
        }, // selectCategory end
        centerLDong: (state, action) => {
            state.centeredLDong = action.payload;
        }, // centerLDong end
        ByLdongCode: (state, action) => {
            state.LdongName = action.payload;
        }, // ByLdongCode end
        firstLDongRegn: (state, action) => {
            state.firstLDong = action.payload;
        }, // firstLDongRegn end
        setActiveLnbMenu: (state, action) => {
            state.activeLnbMenu = action.payload;
        }, // setActiveLnbMenu end
        setRegionSignguList: (state, action) => {
            state.regionSignguList = action.payload;
        }, // setRegionSignguList end
        setActiveSearchBox: (state, action) => {
            state.activeSearchBox = action.payload;
        }, // setActiveSearchBox end
        setCurrentPosition: (state, action) => {
            state.currentPosition = action.payload;
        }, // setCurrentPosition end
        setSearchResult: (state, action) => {
            state.searchResult = action.payload;
        }, // setSearchResult end
        setSearchLatLng: (state, action) => {
            state.searchLatLng = action.payload;
        }, // setSearchLatLng end
        setRecommendLatLng: (state, action) => {
            state.recommendLatLng = action.payload;
        }, // setRecommendLatLng end
    } // reducers end
}); // createSlice end

// 3. export
export default mapSlice.reducer;
export const { setRecommendLatLng, setSearchLatLng, setSearchResult, setCurrentPosition, setActiveSearchBox, setRegionSignguList, setActiveLnbMenu, firstLDongRegn, ByLdongCode, selectedSigngu, selectLeftMarker, selectRightMarker, renderedMarker, selectCategory, centerLDong } = mapSlice.actions;