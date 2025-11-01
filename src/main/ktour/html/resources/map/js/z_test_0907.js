const schoolMap = async() => {
    console.log("한국관광공사_국문 관광정보 서비스_GW(//apis.data.go.kr/B551011/KorService2/locationBasedList2)");
     // 1. 지도 위치 및 기본옵션 설정
       var map = new kakao.maps.Map(document.getElementById('map'), {
           center : new kakao.maps.LatLng(37.4563, 126.7052), // 지도의 중심좌표 -> 인천시청 기준
           level : 8 // 지도의 확대 레벨
       });
       var clusterer = new kakao.maps.MarkerClusterer({
           map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
           averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
           minLevel: 5, // 클러스터 할 최소 지도 레벨
           disableClickZoom: true // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
       });
       const serviceKey = "DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D";
       const URL = "https://apis.data.go.kr/B551011/KorService2/locationBasedList2?lDongRegnCd=28&arrange=S&mapX=126.7052062&mapY=37.4562557&radius=20000&numOfRows=100&MobileOS=WEB&MobileApp=AppTest&_type=json&serviceKey=";
       const response = await fetch( URL+serviceKey, {method : "GET"} );
       const data = await response.json();
       //console.log(data); //확인용
       // 마커 이미지의 이미지 주소
       var imageSrc = "/img/kakao_map/logo.jpg"; // https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png
       var imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기
       var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성
       // map 반복문
       let markers = data.response.body.items.item.map( (value) => {
         // 마커 객체 생성 후 마커스로 배열 추가 대입
         let marker = new kakao.maps.Marker({
               position : new kakao.maps.LatLng(value.mapy, value.mapx), //  공공데이터 속성명으로 변경
               image : markerImage // 마커 이미지
           });
           // 개별 마커 클릭 했을 경우, 해당 정보 노출하게 하는 이벤트
           let html = "";
           kakao.maps.event.addListener( marker, 'click', () => {
               const sidebar = document.querySelector('#mapInfoBody');
               html += `<button onclick='schoolList()' type="button">전체보기</button>
                   <ul class="summary_card">
                       <li class="subject">
                           <b>${value.title}</b>
                           <span class="category"><b class="depth_1">${value.cat1}</b><b class="depth_2">${value.cat2}</b></span>
                       </li>
                       <li class="thumb"><img src="${value.firstimage ? value.firstimage : value.firstimage2}" alt="${value.title}"></li>
                       <li class="addr">${value.addr1}</li>
                       <li class="work_time">${value.contentTypeId}</li>
                       <li class="parking">주차시설 : 있음,유료</li>
                       <li class="tel">${value.tel ? value.tel : '전화번호 정보 없음'}</li>
                   </ul> `
               sidebar.innerHTML = html;
           });
           return marker;
       });
           clusterer.addMarkers(markers); // 클러스터러에 마커들을 추가합니다
       kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
           var level = map.getLevel()-1; // 현재 지도 레벨에서 1레벨 확대한 레벨
           map.setLevel(level, {anchor: cluster.getCenter()});  // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
       });

   }//func end

schoolMap(); // map 실행
