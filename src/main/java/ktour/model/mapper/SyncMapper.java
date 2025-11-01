package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SyncMapper {

    // [1] 카테고리 동기화
    int insertCategoryCodeFromOrigin();

    // [2] 법정동 동기화
    int insertLDongCodeFromOrigin();

    // [3] Place정보·관광정보 동기화
    int insertPlaceInfoFromOrigin();

    // [4] 지도마커GPS 동기화
    int insertMarkersGPSFromOrigin();

    // [5] Place상세이미지 동기화
    int insertPlaceImageDetailFromOrigin();

    // [6] 반려동물 동반여행정보 동기화
    int insertDetailPetTourFromOrigin();

    // [7] 관광지 상세정보 동기화
    int insertTourIntroFromOrigin();

    // [8] 축제행사공연 상세정보 동기화
    int insertFestivalIntroFromOrigin();

    // [9] 축제행사공연 상세정보 동기화
    int insertRestaurantIntroFromOrigin();

    // [10] Place 반복정보 상세정보 동기화
    int insertPlaceInfoRepeatFromOrigin();
} // interface end
