/**
 * 사용자단(비회원) > 메인 > 관광지도검색 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.17
 * @version 0.1.0
 */

//import CenterKakaoMap from "@user/pages/map/CenterKakaoMap";    // 중앙 지도
import KakaoMap from "@/kakaomap/KakaoMapJS";                       // 카카오맵 API 연동_251024(kimJS)
import RightCategory from "@user/pages/map/RightCategory";        // 우측 플레이스 목록 
import LeftModalPlace from "@user/pages/map/LeftModalPlace";      // 좌측 모달 레이어(지도 마커 클릭시, 플레이스 상세정보)
import RightModalPlace from "@user/pages/map/RightModalPlace";    // 우측 모달 레이어(우측 플레이스 목록 클릭시, 플레이스 상세정보)
import "@assets/user/css/modal.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";


export default function MainPlace(props) {
    const { selectedLeftMarker, selectedCategory } = useSelector((state) => state.relatedMap);

    return (<>
        <div id="map"><KakaoMap selectedCategory={selectedCategory} /></div>
        <RightModalPlace />
        {selectedLeftMarker && <LeftModalPlace pNo={selectedLeftMarker} />}
        <RightCategory />
    </>)
}//MainPlace.jsx end