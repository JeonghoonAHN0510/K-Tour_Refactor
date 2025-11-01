/**
 * 관리자 > 관광정보 > 장소정보(PlaceInfo) 페이지 컴포넌트
 *
 * 역할 개요
 * - 좌측: 장소 목록(ListSection)
 * - 우측: 선택된 장소의 상세 편집(DetailSection)
 *
 * 상태/데이터 흐름
 * - 전역 스토어(placeSlice)에서 선택된 장소의 식별자(pno)와 상세데이터(detail)를 관리합니다.
 * - 좌측 목록 행 클릭 시, 해당 pno로 상세를 조회하는 thunk(fetchPlaceDetail)를 디스패치합니다.
 * - 우측 상세 영역은 스토어의 detail을 읽어 렌더링합니다.
 *
 * 우측 패널 초기화 전략
 * - 다른 항목을 선택할 때 우측 폼의 로컬 상태를 깨끗하게 리셋하기 위해 key(detailKey)를 증가시켜 강제 재마운트를 유도합니다.
 * - 또한 로컬 detail 상태를 null로 설정해, 자식 컴포넌트가 초기값을 재수립하도록 돕습니다.
 */

// 반응형 좌우 분할 레이아웃 컴포넌트
import SplitPaneResponsive from "@admin/components/common/SplitPaneResponsive";
// 좌측 목록 영역: 검색/페이징/행선택을 담당
import ListSection from "@admin/pages/map/place/ListSection.jsx";
// 우측 상세 영역: 기본/Intro/반복정보 탭 편집을 담당
import DetailSection from "@admin/pages/map/place/DetailSection.jsx";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceDetail } from '@admin/store/placeSlice';

export default function PlaceInfo() {
  const dispatch = useDispatch();

  // 우측 패널(DetailSection) 리셋을 위한 로컬 상태
  // - detail: 과거 호환을 위한 자리(현재 상세는 스토어에서 읽음). null로 유지해 초기화 용도로만 사용
  // - detailKey: key를 증가시켜 DetailSection을 강제 재마운트하여 폼 내부 로컬 상태를 초기화
  const [detail, setDetail] = useState(null);
  const [detailKey, setDetailKey] = useState(0);

  // 전역 스토어에 기록된 현재 선택된 pno(행 선택 시 fetchPlaceDetail.pending에서 세팅됨)
  const selectedPno = useSelector((s) => s.place?.selectedPno ?? null);

  // 선택 pno가 바뀌면 우측 패널을 초기화하여 이전 폼 상태 잔존을 방지
  useEffect(() => {
    if (selectedPno != null) {
      setDetail(null);
      setDetailKey((k) => k + 1);
    }
  }, [selectedPno]);

  /**
   * 좌측 목록에서 행을 클릭했을 때 호출됩니다.
   * - 다양한 키 조합(pno/pNo/PNO)을 받아 숫자로 변환하여 상세 조회를 디스패치합니다.
   * @param {object} row - 목록의 한 행(서버 검색 결과)
   */
  const handlePick = (row) => {
    const pno = row?.pno ?? row?.pNo ?? row?.PNO;
    if (pno) dispatch(fetchPlaceDetail(Number(pno)));
  };

  return (
    <>
      <SplitPaneResponsive
        // 최초 로드 시 좌측 50% 비율. 창 크기에 따라 반응형으로 조정됨
        initLeftPct={50}
        // 좌/우 최소 픽셀(너무 좁아져 UI가 깨지는 것 방지)
        minLeftPx={240}
        minRightPx={320}
        // 좌측: 목록. 행 클릭 시 handlePick 호출
        left={<ListSection onPick={handlePick} />}
        // 우측: 상세 편집. key 변경으로 강제 재마운트하여 폼 초기화 보장
        right={
          <DetailSection
            key={detailKey}
            // 과거 호환을 위해 남겨둔 prop. 현재 상세 데이터는 스토어에서 직접 구독
            detail={detail}
            // 새로운 항목 작성 등으로 초기화가 필요할 때 호출
            onNew={() => { setDetail(null); setDetailKey((k) => k + 1); }}
          />
        }
      />
    </>
  );
}