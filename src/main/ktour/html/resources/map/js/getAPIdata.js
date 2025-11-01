/* 자바(java/user/service/TourApiService) > 공공데이터 API데이터 호출(한국관광공사_국문 관광정보 서비스_GW)*/
const fetchData = async(apiPath) => {
    try {
        const response = await fetch(`/api_tour/${apiPath}`);
        const data = await response.json(); //console.log(data);
        return data; // data.response.body.items.item;
    }catch (error) {
        console.error('[오류]자바 공공데이터 API :', error);
        return null;
    }
};
export const getLdongCodeData = async() => fetchData('ldongCd');           // [01] 법정동코드(ldongCode2) 
export const getLclsSystmData = async() => fetchData('lcls');       // [02] 분류체계코드(lclsSystmCode2) 
export const getLocationListData = async( lDongRegnCd , lat , lng ) => fetchData(`location?lDongRegnCd=${lDongRegnCd}&centerLat=${lat}&centerLng=${lng}`);// [03] 위치기반 관광정보(locationBasedList2)
export const getLdong1Data = async() => fetchData('ldong');         // [04] 법정동코드 > 대분류(17개)
export const getAreaListData = async( lDongRegnCd , lat , lng ) => fetchData(`area?lDongRegnCd=${lDongRegnCd}&centerLat=${lat}&centerLng=${lng}`);// [05] 지역기반(17개) 관광정보(areaBasedList2)
//getAreaListData().then( data => {console.log(data);} ); // !확인용