import { detailCommon2Data, detailIntro2Data, detailImage2Data, detailPetTour2Data, detailInfo2Data } from './detailTourInfo.js';
// [01] 지도마커 클릭시, 상세업체정보 출력하기-----------------------------------------------------------------------------------
export const markerInfoLayer = async( value, marker ) => { //console.log("지도마커 클릭시, 상세업체정보 출력하기");

    // 4-2. 개별 마커 클릭 했을 경우, 해당 정보 노출--> 상세관광정보 작업중!
    let html = "";
    kakao.maps.event.addListener( marker, 'click', async( ) => {
        try {
            const detailCommon = await detailCommon2Data( value ); // 1. 상세관광정보(공통) 호출
            const detailIntro = await detailIntro2Data( value );   // 2. 상세관광정보(관광타입별) 

            console.log( detailCommon );
            // 2) 마커 클릭했을 경우, 모달 레이어창 나오기
            const modalLayer = document.querySelector('#modalMarkerInfoLayer');
                if( modalLayer ) modalLayer.style.display = "block";  
            html += `
            <div class="modal_box">
                <button class="modal_close fa fa-close" onclick="this.closest('.modal_marker_info_layer').style.display='none'"></button>
                <div class="modal_img_box">
                    <div class="modal_img_bg"><img src="${value.firstimage ? value.firstimage : '/map/img/no_img.jpg'}" alt="${value.title}"/></div>
                    <div class="modal_content_outline">
                        <h3>${value.title}</h3>
                        <span>${value.contenttypeid}</span>
                        <div class="category">${value.cat1} > ${value.cat2} > ${value.cat3}</div>
                    </div>
                </div>
                <div class="modal_content">
                    <p class="description">${detailCommon.overview || '상세 정보가 없습니다.'}</p>
                    <h4>상세정보</h4>
                    <ul>
                        <li><b>주소</b><span>${detailCommon.addr1} ${detailCommon.addr2}</span></li>
                        <li><b>홈페이지</b><span> ${detailCommon.homepage ? `<a href='${detailCommon.homepage}' target='_blank'>${detailCommon.homepage}</a>` : '정보 없음'}</span></li>
                        <li><b>Tel.</b><span>${value.tel ? `<a href="tel:${value.tel}">${value.tel}</a>` : '-'}</span></li>
                    </ul>
                    <h4>사진이미지</h4>
                    <ul class="addition_img_wrap">
                        <li><img src="${value.firstimage ? value.firstimage : '/map/img/no_img.jpg'}" alt="${value.title}"/></li>
                        <li><img src="${value.firstimage ? value.firstimage : '/map/img/no_img.jpg'}" alt="${value.title}"/></li>
                    </ul>
                    <h4>부가정보</h4>
                    <ul>
                      <li><b>휴무일</b><span>연중무휴</span></li>
                    </ul>
                </div>
            </div>  
            `
            modalLayer.innerHTML = html;
   } catch (error) {
            console.error("마커 정보 로드 중 오류 발생:", error);
            alert("상세 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    });
}//func end
