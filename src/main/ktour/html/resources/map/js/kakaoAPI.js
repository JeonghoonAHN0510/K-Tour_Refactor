/** [01] 카카오키 호출 */
const loadKakaoMap = async() => {
  console.log("kakaoKey 호출");
  try{
    const response = await fetch("/map/kakao");
    const data = await response.json();
    const kakaoKey = data.kakaoKey;

    /* script 생성하여 키 넣어주기 
    const script = document.createElement('script'); 
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    document.head.appendChild(script);
    */
  }catch(error){ console.log( error );  }

    script.onload = () => { // 스크립트 로딩이 완료되면 실행될 콜백 함수
        kakao.maps.load( userlocationMap ); // kakao.maps.load 통해 지도 초기화// 공공데이터api 못가져옴.
    };
};
// loadKakaoMap();