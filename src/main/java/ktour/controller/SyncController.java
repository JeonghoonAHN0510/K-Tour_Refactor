package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ktour.service.SyncService;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    /**
     * [1] 카테고리 동기화 (lclsSystmCode2 -> categoryCode)
     * <p>
     * - 원본 DTO 없이, 정규화 DTO로 즉시 매핑
     * @author OngTK
     */
    @PostMapping("/category")
    public ResponseEntity<Integer> syncCategory() {
        System.out.println("SyncController.syncCategory");
        int inserted = syncService.syncCategoryCodes();
        return ResponseEntity.ok(inserted);
    }

    /**
     * [2] 법정동 동기화 (ldongCode2 -> ldongCode)
     * <p>
     * - 원본에는 위경도가 없어, 현재는 임시로 0.0 채움
     * <p>
     * - 추후 좌표 공급 전략 확정 시 교체 필요
     * @author OngTK
     */
    @PostMapping("/ldong")
    public ResponseEntity<Integer> syncLDong() {
        int inserted = syncService.syncLDongCodes();
        return ResponseEntity.ok(inserted);
    }

    /**
     * [3] Place정보 · 관광정보 동기화 ( areaBasedSyncList2 > placeInfo)
     * @author OngTK
     * */
    @PostMapping("/place")
    public ResponseEntity<Integer> syncPlace() {
        int inserted = syncService.syncPlaceInfo();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [4] 지도마커GPS 동기화 (placeInfo + areaBasedSyncList2 + detailCommon2 > markersGPS)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/markersgps")
    public ResponseEntity<Integer> syncMarkersGPS(){
        int inserted = syncService.syncMarkersGPS();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [5] Place상세이미지 동기화 (placeInfo + detailImage2 > placeimagedetail)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/placeimagedetail")
    public ResponseEntity<Integer> syncPlaceImageDetail(){
        int inserted = syncService.syncPlaceImageDetail();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [6] 반려동물 동반여행정보 동기화 (placeInfo + detailPetTour2 > detailpettour)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/detailpettour")
    public ResponseEntity<Integer> syncDetailPetTour(){
        int inserted = syncService.syncDetailPetTour();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [7] 관광지 상세정보 동기화 (placeInfo + detailintro2_12 > tourintro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/tourintro")
    public ResponseEntity<Integer> syncTourIntro(){
        int inserted = syncService.syncTourIntro();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [8] 축제행사공연 상세정보 동기화 (placeInfo + detailintro2_15 > festivalintro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/festivalintro")
    public ResponseEntity<Integer> syncFestivalIntro(){
        int inserted = syncService.syncFestivalIntro();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [9] 음식점 상세정보 동기화 (placeInfo + detailintro2_39 > restaurantIntro)
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/restaurantintro")
    public ResponseEntity<Integer> syncRestaurantIntro(){
        int inserted = syncService.syncRestaurantIntro();
        return ResponseEntity.ok(inserted);
    } // func end

    /**
     * [10] 음식점 상세정보 동기화 (placeInfo + detailinfo2_12 + detailinfo2_39 > placeInfoRepeat)
     * <p>
     * 추후 detailinfo2_15 추가 필요
     * @return 삽입된 레코드 수
     * @author AhnJH
     */
    @PostMapping("/placeinforepeat")
    public ResponseEntity<Integer> syncPlaceInfoRepeat(){
        int inserted = syncService.syncPlaceInfoRepeat();
        return ResponseEntity.ok(inserted);
    } // func end
} // class end