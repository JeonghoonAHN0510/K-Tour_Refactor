/** API 개별건 상세정보 호출(한국관광공사_국문 관광정보 서비스_GW) */
// 국문관광정보 TourAPI4.0 매뉴얼 참고 :  https://rootlab.kr/manual_TourAPI_v4.3.pdf

const serviceKey = `DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D`; // 서비스키

// [01] 공통정보조회(공통_/detailCommon2)
// https://apis.data.go.kr/B551011/KorService2/detailCommon2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=126128&numOfRows=1
export const detailCommon2Data = async( value ) => { 
    const URL = `https://apis.data.go.kr/B551011/KorService2/detailCommon2?contentId=${value.contentid}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    return data.response.body.items.item[0];
}//func end

// [02] 소개정보조회(**관광타입별_contentTypeId_/detailIntro2**)
// https://apis.data.go.kr/B551011/KorService2/detailIntro2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=126128&contentTypeId=12&numOfRows=1
export const detailIntro2Data = async( value ) => { // 상세관광정보
    const URL = `https://apis.data.go.kr/B551011/KorService2/detailIntro2?contentId=${value.contentid}&contentTypeId=${value.contenttypeid}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    return data.response.body.items.item[0];
}//func end

// [03] 이미지정보조회(**/detailImage2) // imageYN : Y=콘텐츠이미지조회 N=”음식점”타입의 음식메뉴 이미지
// https://apis.data.go.kr/B551011/KorService2/detailImage2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=126128&imageYN=Y&numOfRows=1
export const detailImage2Data = async( value ) => { // 상세관광정보
    const URL = `https://apis.data.go.kr/B551011/KorService2/detailImage2?contentId=${value.contentid}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    return data.response.body.items.item[0];
}//func end

// [04] 반려동물 동반여행 여행정보(공통_/detailPetTour2)
// https://apis.data.go.kr/B551011/KorService2/detailPetTour2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&numOfRows=1&MobileOS=ETC&MobileApp=AppTest&contentId=125534&_type=json
export const detailPetTour2Data = async( value ) => { 
    const URL = `https://apis.data.go.kr/B551011/KorService2/detailPetTour2?MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    return data.response.body.items.item[0];
}//func end

// [05] 상세 반복정보(관광타입별_/detailInfo2)
// https://apis.data.go.kr/B551011/KorService2/detailInfo2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=126128&contentTypeId=12&numOfRows=1
export const detailInfo2Data = async( value ) => { // 상세관광 반복정보
    const URL = `https://apis.data.go.kr/B551011/KorService2/detailInfo2?contentId=${value.contentid}&contentTypeId=${value.contenttypeid}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    return data.response.body.items.item[0];
}//func end
