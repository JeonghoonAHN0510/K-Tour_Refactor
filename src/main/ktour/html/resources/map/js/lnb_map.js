import { getLdong1Data  } from './getAPIdata.js';
import { userlocationMap  } from './userLocationMap.js';

//[01] 활성화된(.active) 좌측 대메뉴명 > 상단 title에 넣기-----------------------------
let activeLinkText = $(".membership li.active a").text();
// $("title").text(activeLinkText);
$(".membership li.active a").clone().prependTo(".lnb h2");
// [02] 법정동코드(1차 대분류 지역) 연동 >  좌측메뉴 지역명 매칭 출력 -------------------
const getAreaLnb = async( bjdCode ) =>{

    const ldong1Data = await getLdong1Data();
    //console.log(ldongData);
    // 2) 법정동코드 데이터 html 출력
    const lnbMap = document.querySelector("#lnbMap");
    const defaultActiveAreaCode = bjdCode ;
    let html = "";
    ldong1Data.forEach( ( lDongRegnCd ) =>{
        const isActive = lDongRegnCd.code === defaultActiveAreaCode ? 'active' : '';
        html += `
        <li data-code="${lDongRegnCd.code}">
            <a href="#" class ="${isActive}" onclick="handleAreaClick('${lDongRegnCd.code}')">
            <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
                <span>${lDongRegnCd.name}</span>
            </a>
        </li>`
    });
    lnbMap.innerHTML=html;
}//func end

// [03] 페이지 최초 로딩 시, 기본 인천 지역 지도 출력--------------------------------
window.addEventListener('load', async() => {

    const pos = await myPosition();
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const address = await getAddressFromCoords(lat, lng);
    const bjdCode = await getBjdCodeFromAddress(address);


    await getAreaLnb( bjdCode ); // 좌측 메뉴가 먼저 로드
    await $(".sub_menu_list li a.active").clone().prependTo(".right_contents h1");
    //userlocationMap('28'); // 디폴트 : 인천 지도
    userlocationMap( bjdCode , lat , lng ); // 디폴트 : 인천 지도
    handleAreaClick( bjdCode ); // 최초 렌더링시 우측 타이틀명 변경
});

// [04] 좌측 지역메뉴 클릭시마다 > 우측 관광정보 타이틀명 변경------------------------
window.handleAreaClick = ( lDongRegnCd ) => {
    const activeLink = document.querySelector("#lnbMap .active");
    const currentPageTitle = document.querySelector('.right_contents.area > .page_title > h1 > a');
    const logotitle = document.querySelector('header h1.logo a'); // 로고명
    let activeLnbText = $(".sub_menu_list li a.active span").text(); // 좌측 활성화(선택된) 지역명
    // 1) 기존 'active' 클래스 제거
    if (activeLink) {
        activeLink.classList.remove('active');
        currentPageTitle.remove('a');
    }
    // 2) 클릭된 링크에 'active' 클래스 추가
    const clickedLink = document.querySelector(`#lnbMap [data-code="${lDongRegnCd}"] a`);
    if (clickedLink) {
        clickedLink.classList.add('active');
        $(".sub_menu_list li a.active").clone().prependTo(".right_contents h1");
        logotitle.textContent = clickedLink.textContent; 

    }
    // 3) 좌측 지역명 선택에 따른 지도 마커 업데이트
    userlocationMap( lDongRegnCd );
};