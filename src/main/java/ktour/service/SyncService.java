package ktour.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ktour.model.mapper.SyncMapper;

/**
 * [SyncServcie · 동기화 Service]
 * <p>
 * API 원본 DB 테이블 에서 본사의 정규화 DB 테이블로 정보를 동기화하는 기능을 정의
 * @author OngTK, AhnJH
 * */
@Service
@RequiredArgsConstructor
@Transactional
public class SyncService {

    private final SyncMapper syncMapper;

    /**
     * [1] 카테고리 동기화 (lclsSystmCode2 -> categoryCode)
     * <p>
     * - 원본 DTO 없이, 정규화 DTO로 즉시 매핑
     * @author OngTK
     */
    public int syncCategoryCodes() {
        return syncMapper.insertCategoryCodeFromOrigin();
    }

    /**
     * [2] 법정동 동기화 (ldongCode2 -> ldongCode)
     * <p>
     * - 원본에는 위경도가 없어, 현재는 임시로 0.0 채움
     * <p>
     * - 추후 좌표 공급 전략 확정 시 교체 필요
     * @author OngTK
     */
    public int syncLDongCodes() {
        return syncMapper.insertLDongCodeFromOrigin();
    }

    /**
     * [3] Place정보 · 관광정보 동기화 (areaBasedSyncList2 > placeInfo)
     * @author OngTK
     * */
    public int syncPlaceInfo() {
        return syncMapper.insertPlaceInfoFromOrigin();
    } // func end

    /**
     * [4] 지도마커GPS 동기화 (placeInfo + areaBasedSyncList2 + detailCommon2 > markersGPS)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncMarkersGPS(){
        return syncMapper.insertMarkersGPSFromOrigin();
    } // func end

    /**
     * [5] Place상세이미지 동기화 (placeInfo + detailImage2 > placeimagedetail)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncPlaceImageDetail(){
        return syncMapper.insertPlaceImageDetailFromOrigin();
    } // func end

    /**
     * [6] 반려동물 동반여행정보 동기화 (placeInfo + detailPetTour2 > detailpettour)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncDetailPetTour(){
        return syncMapper.insertDetailPetTourFromOrigin();
    } // func end

    /**
     * [7] 관광지 상세정보 동기화 (placeInfo + detailintro2_12 > tourintro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncTourIntro(){
        return syncMapper.insertTourIntroFromOrigin();
    } // func end

    /**
     * [8] 축제행사공연 상세정보 동기화 (placeInfo + detailintro2_15 > festivalintro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncFestivalIntro(){
        return syncMapper.insertFestivalIntroFromOrigin();
    } // func end

    /**
     * [9] 음식점 상세정보 동기화 (placeInfo + detailintro2_39 > restaurantIntro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncRestaurantIntro(){
        return syncMapper.insertRestaurantIntroFromOrigin();
    } // func end

    /**
     * [10] 음식점 상세정보 동기화 (placeInfo + detailinfo2_12 + detailinfo2_39 > placeInfoRepeat)
     * <p>
     * 추후 detailinfo2_15 추가 필요
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    public int syncPlaceInfoRepeat(){
        return syncMapper.insertPlaceInfoRepeatFromOrigin();
    } // func end

    public void syncAllTable(){
        // 1. 법정동코드 테이블 생성
        syncMapper.createLDongCodeTable();
        // 2. 카테고리 테이블 생성
        syncMapper.createCategoryTable();
        // 3. 콘텐츠타입 테이블 생성
        syncMapper.createContentTypeTable();
        // 4. 플레이스정보 테이블 생성
        syncMapper.createPlaceInfoTable();
        // 5. 마커GPS 테이블 생성
        syncMapper.createMarkersGPSTable();
        // 6. 상세이미지 테이블 생성
        syncMapper.createPlaceImageDetailTable();
        // 7. 반려동물 테이블 생성
        syncMapper.createDetailPetTourTable();
        // 8. 관광지 테이블 생성
        syncMapper.createTourIntroTable();
        // 9. 축제행사공연 테이블 생성
        syncMapper.createFestivalIntroTable();
        // 10. 음식점 테이블 생성
        syncMapper.createRestaurantIntroTable();
        // 11. 반복정보 테이블 생성
        syncMapper.createPlaceInfoRepeatTable();
        // 12. 사이트정보 테이블 생성
        syncMapper.createSiteInfoTable();
        // 13. 관리자정보 테이블 생성
        syncMapper.createManagerTable();
        // 14. 푸시팝업 테이블 생성
        syncMapper.createPushPopupTable();
    } // func end

    public void syncInsert(){
        // 1. 콘텐츠타입 추가
        syncMapper.insertContentTypeSample();
        // 2. 카테고리 추가
        syncMapper.insertCategoryCodeFromOrigin();
        // 3. 법정동코드 추가
        syncMapper.insertLDongCodeFromOrigin();
        // 4. 플레이스정보 추가
        syncMapper.insertPlaceInfoFromOrigin();
        // 5. 마커GPS 추가
        syncMapper.insertMarkersGPSFromOrigin();
        // 6. 상세이미지 추가
        syncMapper.insertPlaceImageDetailFromOrigin();
        // 7. 반려동물 추가
        syncMapper.insertDetailPetTourFromOrigin();
        // 8. 관광지 추가
        syncMapper.insertTourIntroFromOrigin();
        // 9. 축제행사공연 추가
        syncMapper.insertFestivalIntroFromOrigin();
        // 10. 음식점 추가
        syncMapper.insertRestaurantIntroFromOrigin();
        // 11. 반복정보 추가
        syncMapper.insertPlaceInfoRepeatFromOrigin();
    } // func end
} // class end