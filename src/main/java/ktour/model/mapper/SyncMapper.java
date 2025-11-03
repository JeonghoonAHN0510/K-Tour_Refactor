package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SyncMapper {

    // [1-1] 카테고리 테이블 생성
    int createCategoryTable();

    // [1-2] 카테고리 동기화
    int insertCategoryCodeFromOrigin();

    // [2-1] 법정동 테이블 생성
    int createLDongCodeTable();

    // [2-2] 법정동 동기화
    int insertLDongCodeFromOrigin();

    // [3-1] Place정보·관광정보 테이블 생성
    int createPlaceInfoTable();

    // [3-2] Place정보·관광정보 동기화
    int insertPlaceInfoFromOrigin();

    // [4-1] 지도마커GPS 테이블 생성
    int createMarkersGPSTable();

    // [4-2] 지도마커GPS 동기화
    int insertMarkersGPSFromOrigin();

    // [5-1] Place상세이미지 테이블 생성
    int createPlaceImageDetailTable();

    // [5-2] Place상세이미지 동기화
    int insertPlaceImageDetailFromOrigin();

    // [6-1] 반려동물 동반여행정보 테이블 생성
    int createDetailPetTourTable();

    // [6-2] 반려동물 동반여행정보 동기화
    int insertDetailPetTourFromOrigin();

    // [7-1] 관광지 상세정보 테이블 생성
    int createTourIntroTable();

    // [7-2] 관광지 상세정보 동기화
    int insertTourIntroFromOrigin();

    // [8-1] 축제행사공연 상세정보 테이블 생성
    int createFestivalIntroTable();

    // [8-2] 축제행사공연 상세정보 동기화
    int insertFestivalIntroFromOrigin();

    // [9-1] 축제행사공연 상세정보 테이블 생성
    int createRestaurantIntroTable();

    // [9-2] 축제행사공연 상세정보 동기화
    int insertRestaurantIntroFromOrigin();

    // [10-1] Place 반복정보 상세정보 테이블 생성
    int createPlaceInfoRepeatTable();

    // [10-2] Place 반복정보 상세정보 동기화
    int insertPlaceInfoRepeatFromOrigin();

    // [11-1] 콘텐츠타입 테이블 생성
    int createContentTypeTable();

    // [11-2] 콘텐츠타입 샘플 추가
    int insertContentTypeSample();

    // [12-1] 사이트정보 테이블 생성
    int createSiteInfoTable();

    // [13-1] 관리자정보 테이블 생성
    int createManagerTable();

    // [14-1] 푸시/팝업 테이블 생성
    int createPushPopupTable();
} // interface end