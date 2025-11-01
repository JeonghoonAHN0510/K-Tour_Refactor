/**
 * 관리자단 > 공통컴포넌트(레이어, 테이블 등) > 샘플사용 예시 Sample.jsx
 *
 * @author kimJS
 * @since 2025.10.26
 * @version 0.1.0
 */
import SplitPaneResponsive from "@admin/components/common/SplitPaneResponsive"; // 반응형 스플리터
import ListSection from "@admin/components/common/sample/ListSection";          // 좌측: 목록
import DetailSection from "@admin/components/common/sample/DetailSection";      // 우측: 상세(CRUD)

export default function Sample() {

/** ========================= 관리자단 > 공통컴포넌트(레이어, 테이블 등) > 샘플사용 예시(Sample) .jsx영역 ================================== */
  return (
    <>
    <SplitPaneResponsive
      initLeftPct={50}              // 초기 좌측 폭(%)
      minLeftPx={240}               // 좌측 최소(px)
      minRightPx={320}              // 우측 최소(px)
      left={<ListSection />}        // 좌측 콘텐츠
      right={<DetailSection />}     // 우측 콘텐츠
    />
    </>
  );
}//PlaceInfo.jsx end