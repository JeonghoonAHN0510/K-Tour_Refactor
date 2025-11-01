/**
 * 관리자 > 관광정보 > PlaceInfo 우측 상세 패널(기본/Intro/반복)
 *
 * 구성
 * - DetailCommon1: 기본 정보(장소 기본, 좌표, 이미지, 콘텐츠 유형 등)
 * - Intro 섹션: 콘텐츠 유형(ctNo)에 따라 세부 Intro 폼(Tour/Festival/Restaurant) 노출
 * - DetailRepeat3: 자유 형식 반복 정보(제목/내용) 목록 편집
 *
 * 전역 스토어 연동(placeSlice)
 * - detail: fetchPlaceDetail 성공 시 저장되는 상세 데이터(본 컴포넌트는 기본적으로 이를 사용)
 * - contentType: 현재 선택된 콘텐츠 유형. DetailCommon1에서 변경하면 스토어에 반영(setContentType)
 * - clearDetail: 새 등록(onNew) 등 초기화 시 detail과 contentType을 정리
 *
 * 로컬 상태
 * - localDetail: 렌더링 편의를 위한 상세 데이터 스냅샷. props/detail 변경에 맞춰 동기화
 * - EMPTY_DETAIL: 초기 렌더/신규 작성 시 사용할 빈 구조
 * - pNo: 플레이스 장소 식별자. Intro/Repeat 저장 시 참조
 *
 * 노출 규칙
 * - effectiveCt: 스토어(contentType) 우선, 없으면 상세 데이터(placeInfo.ctNo), 모두 없으면 기본값 1(관광지)
 * - effectiveCt === 1: TourIntro2 노출
 * - effectiveCt === 3: FestivalIntro2 노출
 * - effectiveCt === 8: RestaurantIntro2 노출
 */
import DetailCommon1 from "@admin/pages/map/place/DetailCommon1";
import TourIntro2 from "@admin/pages/map/place/TourIntro2";
import FestivalIntro2 from "@admin/pages/map/place/FestivalIntro2";
import DetailRepeat3 from "@admin/pages/map/place/DetailRepeat3";
import RestaurantIntro2 from "./RestaurantIntro2";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setContentType as setContentTypeAction, clearDetail, saveAllNew, saveAllUpdate } from '@admin/store/placeSlice';
import api from '@admin/store/axios';

export default function DetailSection({ detail, ...rest }) {
  const dispatch = useDispatch();
  // 스토어 상세가 주어지면 우선 사용(호환을 위해 prop.detail도 허용)
  const storeDetail = useSelector((s) => s.place?.detail ?? null);
  if (detail == null && storeDetail != null) detail = storeDetail;

  // 빈 상세 구조(초기 렌더/신규 등록 때 사용)
  const EMPTY_DETAIL = {
    placeInfo: {},
    MarkersGPSDto: null,
    PlaceImageDetail: [],
    PlaceInfoDtoList: [],
    TourIntro: null,
    RestaurantIntro: null,
    FestivalIntro: null,
  };

  // 상세 로컬 스냅샷과 동기화
  const [localDetail, setLocalDetail] = useState(detail ?? EMPTY_DETAIL);
  useEffect(() => { setLocalDetail(detail ?? EMPTY_DETAIL); }, [detail]);

  // 하위 섹션들이 사용하도록 필드 분해
  const placeInfo = localDetail?.placeInfo ?? {};
  const markers = localDetail?.MarkersGPSDto ?? null;
  const images = localDetail?.PlaceImageDetail ?? [];
  const placeInfoDtoList = localDetail?.PlaceInfoDtoList ?? [];

  // 콘텐츠유형(contentType) 계산/동기화
  const contentType = useSelector((s) => s.place?.contentType || "");
  // placeInfo.ctNo가 바뀌면 스토어 contentType도 재설정(초기 진입/상세 교체 시 동기화)
  useEffect(() => { dispatch(setContentTypeAction(String(placeInfo?.ctNo ?? ""))); }, [placeInfo?.ctNo]);

  // 화면에서 사용할 유효한 contentType 결정(스토어 우선)
  const effectiveCt = useMemo(() => {
    const fromUser = String(contentType || "");
    const fromData = String(placeInfo?.ctNo ?? "");
    return fromUser || fromData || "1"; // 기본 1=관광지
  }, [contentType, placeInfo?.ctNo]);

  /**
   * 새 등록(폼 초기화)
   * - 로컬 상세를 EMPTY_DETAIL로 바꾸고, 전역 detail/contentType도 초기화
   */
  const handleNew = () => {
    setLocalDetail(EMPTY_DETAIL);
    dispatch(clearDetail());
    dispatch(setContentTypeAction("1"));
  };

  /**
   * 삭제 처리
   * - 현재 선택된 장소 번호(pNo/pno)를 확인하여 서버에 삭제 요청(DELETE /placeinfo/basic?pno=...)
   * - 성공 시 상세/로컬 상태 초기화
   */
  const handleDelete = async () => {
    const resolvedPno = pNo ?? placeInfo?.pNo ?? placeInfo?.pno ?? null;
    if (!resolvedPno) { alert('장소가 선택되지 않았습니다.'); return; }
    const ok = window.confirm('정말 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다.');
    if (!ok) return;
    try {
      await api.delete('/placeinfo/basic', { params: { pNo: Number(resolvedPno) } });
      alert('삭제되었습니다.');
      setLocalDetail(EMPTY_DETAIL);
      dispatch(clearDetail());
      dispatch(setContentTypeAction('1'));
    } catch (e) {
      console.error(e);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 현재 상세의 장소 식별자(pNo/pno 혼재에 대비)
  const pNo = placeInfo?.pNo ?? placeInfo?.pno ?? null;

  // 하위 컴포넌트 제어를 위한 ref
  const commonRef = useRef(null);
  const tourRef = useRef(null);
  const festivalRef = useRef(null);
  const restaurantRef = useRef(null);
  const repeatRef = useRef(null);

  const handleSaveAll = async () => {
    try {
      // 1) 기본정보 + 파일 FormData 생성
      const baseBuilt = commonRef.current?.buildFormDataForAll?.();
      if (!baseBuilt) { alert('기본정보를 먼저 입력해 주세요.'); return; }
      const { fd, placeInfoDto } = baseBuilt;

      // 2) 상세 Intro DTO 수집 (콘텐츠 유형에 따라 하나 선택)
      const resolvedPno = Number(placeInfoDto?.pno ?? placeInfoDto?.pNo ?? pNo ?? 0);
      const mode = resolvedPno > 0 ? 'update' : 'new';
      let detailDto = null;
      const ct = Number(effectiveCt);
      if (ct === 1 && tourRef.current?.collectForAll) detailDto = tourRef.current.collectForAll(mode);
      if (ct === 3 && festivalRef.current?.collectForAll) detailDto = festivalRef.current.collectForAll(mode);
      if (ct === 8 && restaurantRef.current?.collectForAll) detailDto = restaurantRef.current.collectForAll(mode);
      if (detailDto) {
        // 서버 로그에서도 pNo가 0이 아니도록 명시 주입
        detailDto = { ...detailDto, pNo: resolvedPno };
        const partName = ct === 1 ? 'tourIntro' : (ct === 3 ? 'festivalIntro' : 'restaurantIntro');
        fd.append(partName, new Blob([JSON.stringify(detailDto)], { type: 'application/json' }));
      }

      // 3) 반복 정보 수집
      const repeatPayload = repeatRef.current?.collectPayloadForAll?.(mode) || [];
      if (repeatPayload.length > 0) {
        fd.append('placeInfoRepeat', new Blob([JSON.stringify(repeatPayload)], { type: 'application/json' }));
      }

      // 4) 서버 전송 (신규/수정 구분)
      if (mode === 'new') {
        await dispatch(saveAllNew(fd)).unwrap();
      } else {
        await dispatch(saveAllUpdate({ fd, pNo: resolvedPno })).unwrap();
      }
      alert('저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="registWrap" {...rest}>
      {/* 상단 탭/버튼 라인: 탭은 현재 단일 탭 UI, 버튼은 저장/삭제/신규등록 */}
      <div className="titleBox">
        <ul className="tabtitle">
          <li className="active">기본정보</li>
          <li>세부정보</li>
          <li>반복정보</li>
        </ul>
        <span className="btnBox">
          <button type="button" className="btn line" onClick={handleNew}>신규등록</button>
          <button type="button" className="btn line" onClick={handleDelete}>삭제</button>
          <button type="button" className="btn full" onClick={handleSaveAll}>저장</button>
        </span>
      </div>

      <div className="formWrap place">
        {/* 1) 기본 정보(공통) */}
        <DetailCommon1
          ref={commonRef}
          key={`dc1-${pNo ?? 'new'}`}
          placeInfo={placeInfo}
          markers={markers}
          images={images}
          contentType={effectiveCt}
          onChangeContentType={(v) => dispatch(setContentTypeAction(v))}
        />

        <hr />

        {/* 2) Intro 섹션: 콘텐츠유형별로 분기 렌더링 */}
        {Number(effectiveCt) === 1 && (
          <TourIntro2 ref={tourRef} key={`tour-${pNo ?? 'new'}`} data={localDetail?.TourIntro ?? null} pNo={pNo} />
        )}
        {Number(effectiveCt) === 3 && (
          <FestivalIntro2 ref={festivalRef} key={`fest-${pNo ?? 'new'}`} data={localDetail?.FestivalIntro ?? null} pNo={pNo} />
        )}
        {Number(effectiveCt) === 8 && (
          <RestaurantIntro2 ref={restaurantRef} key={`rest-${pNo ?? 'new'}`} data={localDetail?.RestaurantIntro ?? null} pNo={pNo} />
        )}

        <hr />
        {/* 3) 반복 정보(자유 형식 제목/내용) */}
        <DetailRepeat3 ref={repeatRef} key={`rep-${pNo ?? 'new'}`} items={placeInfoDtoList} pNo={pNo} />
      </div>
    </section>
  );
}
