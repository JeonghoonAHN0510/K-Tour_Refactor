import React, { useEffect, useState, useRef, useCallback } from 'react';
import UseKakaoLoader from './UseKakaoLoader'; // 이 로더는 kakao 스크립트를 로드합니다.
import axios from "axios";
import festival from '../assets/contentTypeMarker/festival.png'
import cultural_facilities from '../assets/contentTypeMarker/cultural_facilities.png'
import food from '../assets/contentTypeMarker/food.png'
import leports from '../assets/contentTypeMarker/leports.png'
import shopping from '../assets/contentTypeMarker/shopping.png'
import stay from '../assets/contentTypeMarker/stay.png'
import tourSpot from '../assets/contentTypeMarker/tourSpot.png'
import travelCourse from '../assets/contentTypeMarker/travelCourse.png'
import { useDispatch, useSelector } from 'react-redux';
import { selectLeftMarker, selectRightMarker, renderedMarker, firstLDongRegn, centerLDong, setCurrentPosition } from '../user/store/mapSlice';
import '../assets/user/css/InfoWindow.css';

const markerImages = {      // 마커 이미지를 미리 정의
    'food.png': food,
    'culturalFacilities.png': cultural_facilities,
    'festival.png': festival,
    'leports.png': leports,
    'shopping.png': shopping,
    'stay.png': stay,
    'tourSpot.png': tourSpot,
    'travelCourse.png': travelCourse,
};

export default function KakaoMap(props) {
    const isScriptLoaded = UseKakaoLoader();        // 카카오지도 JS 로드가 완료되면, true 반환
    // =================== useSelector ===================
    const { selectedLdNo, axiosOption, markers, searchLatLng, recommendLatLng } = useSelector((state) => state.relatedMap);
    // =================== useDispatch ===================
    const dispatch = useDispatch();
    // =================== useState 선언부 ===================
    const [bounds, SetBounds] = useState({          // 현재 지도의 동서남북 좌표
        south: "0.0",
        west: "0.0",
        north: "0.0",
        east: "0.0"
    }); // useState end
    const [currentLocation, SetCurrentLocation] = useState({    // 현재 위치 정보
        center: { lat: 37.489457, lng: 126.724494 },            // 초기 임의값
        errMsg: null,
        isLoading: true
    }); // useState end
    const [selectedGps, SetSelectedGps] = useState("");         // 사용자가 선택한 GPS 정보

    // =================== useRef 선언부 ===================
    const mapContainerRef = useRef(null);   // 렌더링할 지도 div
    const mapRef = useRef(null);            // 생성된 카카오지도 객체
    const clustererRef = useRef(null);      // 생성된 클러스터러 객체
    const infoWindowRef = useRef(null);     // 생성된 인포윈도우 객체
    const timeoutRef = useRef(null);        // idle 이벤트가 과도하게 발생하는 것을 방지

    const getCurrentPositionFunc = () => {
        // =================== geolocation으로 현재 위치 가져오기 ===================
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {    // 현재 위치를 가져오는데 성공했을 때
                SetCurrentLocation((prev) => ({
                    ...prev,
                    center: {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    },
                    isLoading: false
                }));
                dispatch(setCurrentPosition({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                }))
            }, (error) => {     // 현재 위치를 가져오는데 실패했을 때
                SetCurrentLocation((prev) => ({
                    ...prev,
                    errMsg: error.message,
                    isLoading: false
                }));
            });
        } else {                // Geolocation을 사용할 수 없을 때
            SetCurrentLocation((prev) => ({
                ...prev,
                errMsg: "geolocation을 사용할 수 없는 상태입니다.",
                isLoading: false
            })); // SetCurrentLocation end
        } // if end
    } // func end

    // =================== useEffect - [] : 마운트될 때 1번만 실행 ===================
    useEffect(() => {
        getCurrentPositionFunc();
    }, []); // useEffect end

    // =================== useEffect - [selectedGps] : 중심 좌표 이동 ===================
    useEffect(() => {
        // 선택된 좌표(selectedGps)가 없거나 kakao 객체, map 인스턴스가 없으면 종료
        if (!selectedGps || !window.kakao || !mapRef.current) return;
        // 카카오 지도용 좌표 객체를 생성
        const newCoords = new window.kakao.maps.LatLng(
            selectedGps.mapy, // selectedGps의 mapy
            selectedGps.mapx  // selectedGps의 mapx
        );
        // mapRef에 저장해 둔 지도의 panTo() 함수를 호출하여 지도를 부드럽게 이동
        mapRef.current.panTo(newCoords);
    }, [selectedGps]); // selectedGps 변경될 때마다 이 효과를 실행

    // =================== useEffect - [recommendLatLng] :  ===================
    useEffect(() => {
        // 선택된 좌표(selectedGps)가 없거나 kakao 객체, map 인스턴스가 없으면 종료
        if (!recommendLatLng || !window.kakao || !mapRef.current) return;
        // 카카오 지도용 좌표 객체를 생성
        const newCoords = new window.kakao.maps.LatLng(
            recommendLatLng.lat, // selectedGps의 mapy
            recommendLatLng.lng  // selectedGps의 mapx
        );
        // mapRef에 저장해 둔 지도의 panTo() 함수를 호출하여 지도를 부드럽게 이동
        mapRef.current.setLevel(9);
        mapRef.current.panTo(newCoords);
    }, [recommendLatLng]); // selectedGps 변경될 때마다 이 효과를 실행

    // =================== useEffect - [searchLatLng] :  ===================
    useEffect(() => {
        // 선택된 좌표(selectedGps)가 없거나 kakao 객체, map 인스턴스가 없으면 종료
        if (!searchLatLng || !window.kakao || !mapRef.current) return;
        // 카카오 지도용 좌표 객체를 생성
        const newCoords = new window.kakao.maps.LatLng(
            searchLatLng.lat, // selectedGps의 mapy
            searchLatLng.lng  // selectedGps의 mapx
        );
        // mapRef에 저장해 둔 지도의 panTo() 함수를 호출하여 지도를 부드럽게 이동
        mapRef.current.panTo(newCoords);
    }, [searchLatLng]); // selectedGps 변경될 때마다 이 효과를 실행

    // =================== LDongCode Axios GET ===================
    const getLDongCodeByAxios = async () => {
        if (selectedLdNo == null) return;
        try {
            const response = await axios.get(`http://localhost:8080/ldongcode/getbyldno?ldNo=${selectedLdNo}`, axiosOption);
            SetSelectedGps(response.data);
        } catch (error) {
            console.log('getLDongCodeByAxios 오류 발생');
            console.log(error);
        } // try-catch end
    } // func end
    // =================== useEffect - [selectedCity] : 시군구 좌표 가져오기 ===================
    useEffect(() => {
        getLDongCodeByAxios();
    }, [selectedLdNo]);

    // =================== bounds Axios GET ===================
    const getBoundsByAxios = async () => {
        if (bounds.south === "0.0") return;
        try {
            let response = null;
            if (props.selectedCategory == 'all') {
                response = await axios.get(`http://localhost:8080/markersgps/getbycurrentlatlng?south=${bounds.south}&north=${bounds.north}&west=${bounds.west}&east=${bounds.east}`, axiosOption);
            } else {
                response = await axios.get(`http://localhost:8080/markersgps/getbycurrentlatlng?south=${bounds.south}&north=${bounds.north}&west=${bounds.west}&east=${bounds.east}&ctNo=${props.selectedCategory}`, axiosOption);
            } // if end
            dispatch(renderedMarker(response.data));
        } catch (error) {
            console.log(error);
        } // try-catch end
    }; // func end

    useEffect(() => {
        getBoundsByAxios();
    }, [props.selectedCategory])

    // =================== useEffect - [bounds] : 데이터 가져오기 ===================
    useEffect(() => {
        getBoundsByAxios();
        getLDongName();
    }, [bounds]);

    const getLDongName = async () => {
        if (!window.kakao) return;
        const { kakao } = window;
        const map = mapRef.current;
        const geoCoder = new kakao.maps.services.Geocoder();
        const coords = map.getCenter();
        const callback = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                dispatch(centerLDong(result[0].address_name));
            } // if end
        } // func end
        geoCoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    } // func end

    // =================== useEffect - [currentLocation] : 지도 초기화 ===================
    useEffect(() => {
        // 현재 위치 로딩이 끝났고, mapContainerRef가 준비되었고, kakao 스크립트가 로드되었는지 확인
        if (currentLocation.isLoading || !mapContainerRef.current || !isScriptLoaded || !window.kakao) return;

        const { kakao } = window;   // window에서 kakao 객체 가져오기
        const mapContainer = mapContainerRef.current;   // 지도를 표시할 DOM
        const mapOption = {
            center: new kakao.maps.LatLng(currentLocation.center.lat, currentLocation.center.lng),
            level: 5
        };

        // 지도 인스턴스 생성
        const map = new kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;   // 나중에 map 객체를 다른 곳에서 사용하기 위해서 저장
        map.setMaxLevel(13);

        const geoCoder = new kakao.maps.services.Geocoder();
        const coords = map.getCenter();
        const callback = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                dispatch(centerLDong(result[0].address_name));
                dispatch(firstLDongRegn(result[0].address_name));
            } // if end
        } // func end
        geoCoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)

        // 클러스터러 인스턴스 생성
        const clusterer = new kakao.maps.MarkerClusterer({
            map: map,               // 클러스터러를 찍을 지도
            averageCenter: true,    // 평균 위치 적용 여부
            minLevel: 4             // 적용할 최소 지도 레벨
        }); // clusterer end
        clustererRef.current = clusterer;

        // 인포윈도우 생성
        if (!infoWindowRef.current) {
            infoWindowRef.current = new kakao.maps.InfoWindow({
                removable: true,
                zIndex: 10
            });
        };
        // 지도 클릭 시, 인포윈도우 + 좌측 모달 종료
        kakao.maps.event.addListener(map, 'click', () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
                dispatch(selectLeftMarker(null));
                dispatch(selectRightMarker(null));
            } // if end
        }) // addListener end
        // 지도 드래그 시, 인포윈도우 + 좌측 모달 종료
        kakao.maps.event.addListener(map, 'dragstart', () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
                dispatch(selectLeftMarker(null));
                dispatch(selectRightMarker(null));
            } // if end
        }) // addListener end


        // 지도에 원 표시 로직
        let circle1 = new kakao.maps.Circle({
            center: new kakao.maps.LatLng(currentLocation.center.lat, currentLocation.center.lng),
            radius: 1000,              // 반경 1KM 표시
            strokeWeight: 3,           // 선의 두께
            strokeColor: '#75B8FA',  // 선의 색깔 -> 추후 원하는 색으로 변경
            strokeOpacity: 0.9,        // 선의 불투명도 -> 0에 가까울수록 투명(범위 : 0 ~ 1)
            strokeStyle: 'dashed',     // 선의 스타일
            fillColor: 'rgba(9, 248, 236, .5)',    // 채우기 색깔 -> 추후 원하는 색으로 변경
            fillOpacity: 0.4           // 채우기 불투명도 -> 0에 가까울수록 투명(범위 : 0 ~ 1)
        }); // circle end
        circle1.setMap(map);

        const userPosition = new kakao.maps.LatLng(currentLocation.center.lat, currentLocation.center.lng);

        // 커스텀 오버레이에 표시할 HTML (CSS 클래스 적용)
        const content = '<div class="user-location-dot"></div>';

        // 커스텀 오버레이 생성
        const userLocationOverlay = new kakao.maps.CustomOverlay({
            position: userPosition,
            content: content,
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 3 // 원(circle1)보다 위에 보이도록
        });

        // 커스텀 오버레이를 지도에 표시
        userLocationOverlay.setMap(map);

        // 'idle' 이벤트 리스너 등록
        kakao.maps.event.addListener(map, 'tilesloaded', () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            } // if end

            timeoutRef.current = setTimeout(() => {
                const mapBounds = map.getBounds();
                const sw = mapBounds.getSouthWest();
                const ne = mapBounds.getNorthEast();

                SetBounds({
                    south: sw.getLat(),
                    west: sw.getLng(),
                    north: ne.getLat(),
                    east: ne.getLng()
                }); // SetBounds end
            }, 300);
        }); // addListener end

        // 지도 생성 직후 bounds를 직접 설정
        const initialBounds = map.getBounds();
        const sw = initialBounds.getSouthWest();
        const ne = initialBounds.getNorthEast();
        SetBounds({
            south: sw.getLat(),
            west: sw.getLng(),
            north: ne.getLat(),
            east: ne.getLng()
        });
    }, [currentLocation.isLoading, currentLocation.center, isScriptLoaded]); // Geolocation 완료 시 1회 실행

    // =================== useEffect - [markers] : 마커 업데이트 ===================
    useEffect(() => {
        const map = mapRef.current;
        // 클러스터러 인스턴스나 kakao 객체, map 객체가 없으면 실행 중지
        if (!clustererRef.current || !window.kakao || !map) return;

        const { kakao } = window;
        const clusterer = clustererRef.current;
        clusterer.clear();          // 기존 마커 모두 제거

        // 새 마커 데이터가 없으면 여기서 종료
        if (!markers || markers.length === 0) return;

        const infowindow = infoWindowRef.current;
        if (!infowindow) return;

        const customMarkers = markers.filter((marker) => {
            return marker.mkURL;
        });
        customMarkers.map((marker) => {
            const position = new kakao.maps.LatLng(marker.mapy, marker.mapx);
            const src = '../public/uploads/1/marker/' + marker.mkURL;
            const imageSize = new kakao.maps.Size(150, 90);

            const markerImage = new kakao.maps.MarkerImage(src, imageSize);
            const kakaoMarker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
                zIndex: 4
            });
            kakaoMarker.setMap(map);
            // 마커 클릭 이벤트 생성
            kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                SetSelectedGps(marker);
                dispatch(selectLeftMarker(marker.pNo));
                // 인포윈도우 내용 설정
                const html = `<div class="iw-container">
                                <p class="iw-header">
                                    <span class="iw-title">${marker.title || '장소 정보'}</span>
                                    <span class="iw-category">${marker.contenttypename || '카테고리'}</span>
                                </p>
                                <span class="iw-address">${marker.addr1 || '주소 정보 없음'}</span>
                              </div>`
                const iwContent = html;
                infowindow.setContent(iwContent);
                infowindow.open(map, kakaoMarker);
            }) // addListener end
        });

        const firstFilteredMarkers = markers.filter((marker) => {
            let category = props.selectedCategory;
            if (props.selectedCategory == 'all') category = 3;
            return marker.ctNo == category && !marker.mkURL;
        });

        // 마커 객체 배열 생성
        const kakaoMarkers = firstFilteredMarkers.map(marker => {
            const position = new kakao.maps.LatLng(marker.mapy, marker.mapx);
            const src = markerImages[marker.defaultMarker] || "/user/img/no_img.jpg";
            const imageSize = new kakao.maps.Size(33, 50);

            const markerImage = new kakao.maps.MarkerImage(src, imageSize);
            // 마커 생성하기
            const kakaoMarker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
                zIndex: 4
            });
            // 마커 클릭 이벤트 생성
            kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                SetSelectedGps(marker);
                dispatch(selectLeftMarker(marker.pNo));
                // 인포윈도우 내용 설정
                const html = `<div class="iw-container">
                                <p class="iw-header">
                                    <span class="iw-title">${marker.title || '장소 정보'}</span>
                                    <span class="iw-category">${marker.contenttypename || '카테고리'}</span>
                                </p>
                                <span class="iw-address">${marker.addr1 || '주소 정보 없음'}</span>
                              </div>`
                const iwContent = html;
                infowindow.setContent(iwContent);
                infowindow.open(map, kakaoMarker);
            }) // addListener end
            return kakaoMarker;
        }); // map end

        // 클러스터러에 새 마커 추가
        clusterer.addMarkers(kakaoMarkers);

    }, [markers, props.selectedCategory, selectRightMarker]); // 'markers' state가 변경될 때마다 실행

    // =================== return ===================
    if (currentLocation.isLoading) {
        return <div></div>; //현재 위치를 불러오는 중입니다...
    } // if end

    return (
        <>
            <div
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100vh'
                }}
            />
        </>
    ); // return end
} // func end