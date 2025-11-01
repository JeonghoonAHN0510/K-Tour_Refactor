// [1] 컴퓨터 IP 기반 위치 조회 , GPS 기반이 아니기 때문에 오차가 있을수 있다. 
const myPosition = async () => {
    const position = await new Promise( ( resolve , reject )=>{ 
        // new Promise : 비동기 객체 
        // resolve : 성공했을때 , reject : 실패했을때
        // navigator.geolocation.getCurrentPosition( 성공객체 , 실패객체 , {옵션} ) : 현재 브라우저가 ip기반으로 위도/경도 조회 
        navigator.geolocation.getCurrentPosition( resolve , reject , {  
            enableHighAccuracy : true , // 가능한 정확안 위치( 속도느리고, 전기소모 크다.)
            timeout : 5000 , // 밀리초단위 , 5초 안에 못가져오면 실패(reject) 반환 
            maximumAge : 0  // 캐시(임시) 정보는 사용안함( 항상 새로고침 )
        }); // navigator.geolocation end 
    }); // 동기함수 end 

    //console.log( position );
    console.log( `위도 : ${ position.coords.latitude }`)
    console.log( `경도 : ${ position.coords.longitude }`)
    return position; // 
} // func end 


// [2] 주소 변환 함수 (동기식처럼 사용 가능하도록 Promise로 감쌈)
const getAddressFromCoords = async (lat, lng) => {
    return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(lat, lng);

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const roadAddr = result[0].road_address?.address_name;
                const jibunAddr = result[0].address?.address_name;

                const finalAddr = roadAddr || jibunAddr;
                console.log("📍주소:", finalAddr);
                resolve(finalAddr);  // ✅ 주소 결과를 resolve로 반환
            } else {
                console.error("주소 변환 실패:", status);
                reject(status);  // ❌ 실패 시 reject
            }
        });
    });
};



// [3] 시도명 → 법정동 코드 앞 2자리 매핑 리스트
const sidoList = [
  { name: '서울', code: '11', lat: 37.5665, lng: 126.9780 }, // 서울시청
  { name: '부산', code: '26', lat: 35.1796, lng: 129.0756 }, // 부산시청
  { name: '대구', code: '27', lat: 35.8714, lng: 128.6014 },
  { name: '인천', code: '28', lat: 37.4563, lng: 126.7052 },
  { name: '광주', code: '29', lat: 35.1595, lng: 126.8526 },
  { name: '대전', code: '30', lat: 36.3504, lng: 127.3845 },
  { name: '울산', code: '31', lat: 35.5384, lng: 129.3114 },
  { name: '세종특별자치시', code: '36110', lat: 36.480037, lng: 127.289004 }, // 36.480037, 127.289004
  { name: '경기', code: '41', lat: 37.289374, lng: 127.053537 }, // 경기도청 37.289374, 127.053537
  { name: '강원', code: '51', lat: 37.885399, lng: 127.729780 }, // 37.885399, 127.729780
  { name: '충북', code: '43', lat: 36.6358, lng: 127.4917 },
  { name: '충남', code: '44', lat: 36.6590, lng: 126.6731 },
  { name: '전남', code: '46', lat: 34.816263, lng: 126.462978 }, // 34.816263, 126.462978
  { name: '경북', code: '47', lat: 36.5760, lng: 128.5056 },
  { name: '경남', code: '48', lat: 35.237871, lng: 128.691943 },
  { name: '제주특별자치도', code: '50', lat: 33.4996, lng: 126.5312 },
  { name: '전북특별자치도', code: '52', lat: 35.820432, lng: 127.108759 } // 
];

// [4] 주소에서 법정동 코드 앞 2자리 반환
const getBjdCodeFromAddress = async (address) => {
  if (!address) return null;

  // 예: "인천광역시 계양구 계산동" 에서 '인천광역시' 추출
  const matched = sidoList.find(item => address.startsWith(item.name));
  return matched ? matched.code : null;
};

// [5]  (3) code 와 일치한 lat/lng 반환
const getLdongRegnCode = async( prefix ) => {
    return sidoList.find(item => item.code === prefix);
}



// [6] 지도에서 마커 클릭시 css변경 
const areaClick = async ( lDongRegnCd ) => {
    const activeLink = document.querySelector("#lnbMap .active");
    const currentPageTitle = document.querySelector('.right_contents.area > .page_title > h1 > a');
    // 1) 기존 'active' 클래스 제거
    if (activeLink) {
        activeLink.classList.remove('active');
        //console.log("복사 삭제");
        currentPageTitle.remove('a');
    }
    // 2) 클릭된 링크에 'active' 클래스 추가
    const clickedLink = document.querySelector(`#lnbMap [data-code="${lDongRegnCd}"] a`);
    if (clickedLink) {
        clickedLink.classList.add('active');
        $(".sub_menu_list li a.active").clone().prependTo(".right_contents h1");
    }
};



