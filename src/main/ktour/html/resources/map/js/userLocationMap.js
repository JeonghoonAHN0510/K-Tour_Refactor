import { getLdongCodeData , getLclsSystmData, getLocationListData, getLdong1Data, getAreaListData } from './getAPIdata.js';
import { mapInfoList  } from './rightMapInfo.js';
import { markerInfoLayer } from './markerInfoLayer.js';
import { keywordMapSearch } from './keywordMap.js';

let map = null;       // [강사2025-09-11] 전역 지도 객체
let circle = null;    // [강사2025-09-11] 원(반경 표시)
let clusterer = null; // [강사2025-09-11] 마커 클러스터링 객체

// [강사2025-09-11] 메인 함수: 사용자 지역(lDongRegnCd) + 좌표(lat/lng) 기반 지도 생성
export const userlocationMap = async (lDongRegnCd, lat, lng) => {
    // [강사2025-09-11] 우측 정보 패널 업데이트
    await mapInfoList(lDongRegnCd , lat , lng);

    // [강사2025-09-11] 좌표가 없으면 법정동 코드(lDongRegnCd)로 위/경도 보완
    if (!lat || !lng) {
        const match = await getLdongRegnCode(lDongRegnCd);
        lat = match?.lat;
        lng = match?.lng;
    }

    // [강사2025-09-11] 카카오맵 객체 생성 (기본 줌 레벨 6)
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(lat, lng),
        level: 7
    });

    // [강사2025-09-11] 마커 클러스터링 설정 (줌 확대 시 개별 마커 표시)
    clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 1,
        disableClickZoom: true
    });

    // [강사2025-09-11] 지도 클릭 이벤트 → 좌표 기반으로 지역 코드 갱신 & 지도 업데이트
    kakao.maps.event.addListener(map, 'click', onMapClick);

    // [강사2025-09-11] 초기 지도 콘텐츠 출력
    await updateMapContent(lDongRegnCd, lat, lng);
};

// [강사2025-09-11] 지도 클릭 시 실행되는 이벤트 핸들러
const onMapClick = async (mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat();
    const lng = latlng.getLng();

    // [강사2025-09-11] 좌표 → 주소 변환 → 법정동 코드 변환
    const address = await getAddressFromCoords(lat, lng);
    const newLDongRegnCd = await getBjdCodeFromAddress(address);

    // [강사2025-09-11] 클릭 위치를 중심으로 지도 콘텐츠 갱신
    await updateMapContent(newLDongRegnCd, lat, lng);
};

// [강사2025-09-11] 지도 콘텐츠(반경, 마커, 정보레이어) 갱신 로직
const updateMapContent = async (lDongRegnCd, lat, lng) => {
    // [강사2025-09-11] 좌측 메뉴/상세 정보 갱신
    await areaClick(lDongRegnCd);
    await mapInfoList(lDongRegnCd , lat , lng);

    // [강사2025-09-11] 지도 중심 이동
    map.setCenter(new kakao.maps.LatLng(lat, lng));

    // [강사2025-09-11] 기존 원 제거 후 새 원(반경 5km) 표시 : https://apis.map.kakao.com/web/sample/drawShape/
    if (circle) circle.setMap(null);
    circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(lat, lng),
        radius: 5000, // 미터 단위의 원의 반지름
        strokeColor: '#75B8FA',
        strokeStyle: 'dashed',
        fillColor: 'rgba(9, 248, 236, .5)',
        fillOpacity: 0.4
    });
    circle.setMap(map);

    // [강사2025-09-11] 해당 지역 관광정보(areaList) 가져오기
    const areaList = await getAreaListData(lDongRegnCd, lat, lng);

    // [강사2025-09-11] 마커 이미지 설정 (파란색 핀)
    const markerImage = new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
        new kakao.maps.Size(25, 37)
         // https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_normal.png 마커 이미지 모음
    );

    // [강사2025-09-11] 지역별 마커 생성 + 정보 레이어 바인딩
    const markers = areaList.map((item) => {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(item.mapy, item.mapx),
            image: markerImage
        });
        markerInfoLayer(item, marker); // 1) 마커 클릭시, 우측 상세정보 조회 모달레이어 노출 메소드
      
        return marker;
    });

    // 마커 클러스터러에 클릭이벤트: 줌인(확대)
    kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {

        // 현재 지도 레벨에서 1레벨 확대한 레벨
        var level = map.getLevel()-1;

        // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
        map.setLevel(level, {anchor: cluster.getCenter()});
    });

    // [강사2025-09-11] 기존 마커 제거 후 새 마커 클러스터링
    clusterer.clear();
    clusterer.addMarkers(markers);
    
};
