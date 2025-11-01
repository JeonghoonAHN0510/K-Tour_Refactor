/**
 * 사용자단(비회원) > 메인 > 팝업배너 컴포넌트
 *
 * @author 
 * @since 2025.10.24
 * @version 0.1.0
 * @note 내부 로직: 부트스트랩 → Embla Carousel로 교체 (전역 CSS 영향 없음)
 */

import "@assets/user/css/popupBanner.css";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

// Embla (헤드리스 캐러셀)
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";


export default function PopupBanner(props) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

   // Embla 세팅: 자동재생(4초), 마우스오버 시 일시정지
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [autoplayRef.current]
  );

  // 서버에 저장된 파일명(ppImg) → 이미지 URL 조립
  const imgUrl = (ppImg) =>
    ppImg
      ? `http://localhost:5173/uploads/1/ppImg/${encodeURIComponent(ppImg)}`
      : "/user/img/popup_sample3.jpg"; // 기본 샘플

  const typeLabel = (t) => (String(t) === "1" ? "공지" : String(t) === "2" ? "이벤트" : "알림");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("http://localhost:8080/push/banner", {
          withCredentials: true,
        });
        const rows = Array.isArray(res.data) ? res.data : [];
        if (mounted) setItems(rows);
      } catch (e) {
        console.error("[PopupBanner] load error:", e?.response?.data ?? e.message);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return null;

 // 데이터 없을 때의 “표시용” 배열 (렌더 중 setState 금지 → 파생값으로 해결)
  const displayItems = items.length
    ? items
    :[
    {
      ppNo: 0,
      ppTitle: "기본 배너",
      ppContent: "현재 등록된 배너가 없습니다.",
      ppImg: "/user/img/popup_sample3.jpg", // 기본 이미지 경로
      ppType: "3",
    },
  ];
    
console.log("팝업");

  /** ====== Embla 레이아웃용 최소 inline 스타일 (전역 CSS 불변) ====== */
  const emblaWrapStyle = { overflow: "hidden" }; // 뷰포트
  const emblaContainerStyle = {
    display: "flex",
    userSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
  }; // 트랙
  const emblaSlideStyle = {
    position: "relative",
    flex: "0 0 100%", // 한 번에 한 장
    minWidth: 0,
  };

/** =========================== PopupBanner.jsx ===================================== */
  return (
    <>
      <div className="popupBannerWrap">
        {/* Embla Viewport */}
        <div ref={emblaRef} style={emblaWrapStyle} aria-roledescription="carousel">
          {/* Embla Container */}
          <div style={emblaContainerStyle}>
            {displayItems.map((it, i) => (
              <div style={emblaSlideStyle} key={it.ppNo ?? i} role="group" aria-label={`${i + 1} / ${displayItems.length}`}>
                {/* 기존 dl 구조 유지 */}
                <dl className="popupBanne position-relative m-0">
                  <dt>
                    <img
                      src={imgUrl(it.ppImg)}
                      className="d-block w-100"
                      onError={(e) => (e.currentTarget.src = "/user/img/popup_sample3.jpg")}
                      alt={it.ppTitle ?? "배너"}
                    />
                    {/* 타입 뱃지 (좌상단) */}
                    <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                      {typeLabel(it.ppType)}
                    </span>
                  </dt>
                  {/* 캡션 */}

                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}//MainPlace.jsx end