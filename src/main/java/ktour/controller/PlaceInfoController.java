package ktour.controller;

import ktour.aop.annotation.PositiveParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.*;
import ktour.service.PlaceAggregateService;
import ktour.service.PlaceInfoService;
import ktour.util.pagenation.Page;
import ktour.util.pagenation.PageRequest;

import java.util.List;
import java.util.Map;

/**
 * PlaceInfo
 * <p>
 * 관공·축제 등 모든 장소 공통 정보
 *
 * @author OngTK
 */
@RestController
@RequestMapping("/placeinfo")
@RequiredArgsConstructor
public class PlaceInfoController {

    private final PlaceInfoService placeInfoService;
    private final PlaceAggregateService placeAggregateService;


    /**
     * [PI-01] 플레이스 검색
     *
     * @param page     조회하려는 현재 페이지
     * @param size     한 페이지 당 노출되는 콘텐츠 수
     * @param ctNo     콘텐츠번호 FK
     * @param showflag 노출여부
     * @param ccName   분류체계 번호 : 3단계 카테고리
     * @param ldName   법정동 명칭
     * @param address  주소
     * @param title    플레이스명
     * @param pNo      플레이스 번호
     * @author OngTK
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchPlaces(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String ccName,
            @RequestParam(required = false) String ldName,

            @RequestParam(required = false) Integer ctNo,            // int -> Integer
            @RequestParam(defaultValue = "true") boolean showflag,      // boolean -> Boolean
            @RequestParam(required = false) Integer pNo              // int -> Integer
    ) {
        // [1.1] 페이지 처리 요청을 위한 PageRequest 개체 생성
        // 참고 정렬을 위한 sort 개체 생성 과정 생략
        PageRequest pageRequest = new PageRequest(page, size);

        // [1.2] 검색조건이 모두 null이면 false / 하나라도 존재하면 true
        boolean filter =
                (ccName != null && !ccName.isEmpty()) ||
                        (ctNo != null) ||
                        (pNo != null) ||
                        (ldName != null && !ldName.isEmpty()) ||
                        (address != null && !address.isEmpty()) ||
                        (title != null && !title.isEmpty());

        // [1.3] service
        Page<PlaceInfoDto> result;

        if (filter) {
            // [1.4] 검색조건 Criteria 객체 생성
            PlaceInfoCriteria placeInfoCriteria = new PlaceInfoCriteria();

            if (ctNo != null && ctNo != 0) {
                placeInfoCriteria.setCtNo(ctNo);
            }
            if (pNo != null && pNo != 0) {
                placeInfoCriteria.setPNo(pNo);
            }
            if (ccName != null && !ccName.isEmpty()) {
                placeInfoCriteria.setCcName(ccName);
            }
            if (ldName != null && !ldName.isEmpty()) {
                placeInfoCriteria.setLdName(ldName);
            }
            if (address != null && !address.isEmpty()) {
                placeInfoCriteria.setAddress(address);
            }
            if (title != null && !title.isEmpty()) {
                placeInfoCriteria.setTitle(title);
            }
            placeInfoCriteria.setShowflag(showflag);

            result = placeInfoService.searchPage(placeInfoCriteria, pageRequest);
        } else {
            result = placeInfoService.findPage(pageRequest);
        }
        return ResponseEntity.ok(result);
    } // func end

    /**
     * [PI-02] 플레이스 개별조회
     *
     * @param pno
     * @return Map<String, Object> : [{"placeinfo" : {dto} }, {"detailInfo":{dto}},{"placeInfoRepeat":{dto}}]
     * @author OngTK
     */
    @GetMapping("/basic")
    public ResponseEntity<?> getPlace(@RequestParam int pno) {

        Map<String, Object> result = placeInfoService.getPlace(pno);
        return ResponseEntity.ok(result);
    } // func end

    /**
     * [PI-03] 플레이스 기본정보 등록
     * <p>
     * 복수 DTO(PlaceInfo, MarkersGPS, PlaceImageDetail) + 복수 파일(마커1, 대표1, 상세N)을
     * <p>
     * 단일 multipart/form-data 요청으로 받아 트랜잭션으로 처리합니다.
     *
     * @author OngTK
     */
    @PostMapping(value = "/basic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> savePlaceBasicInfo(
            // JSON 파트
            @RequestPart("placeInfo") PlaceInfoDto placeInfo,
            @RequestPart("marker") MarkersGPSDto marker,
            @RequestPart(value = "imagesMeta", required = false) List<PlaceImageDetailDto> imagesMeta,

            // 파일 파트 (JSX 필드명 기준: markerImage / mainImage / detailImage…)
            @RequestPart(value = "markerImage", required = false) MultipartFile markerImage,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages // multiple
    ) {

        Integer pNo = placeAggregateService.savePlaceBasicInfo(
                placeInfo, marker, imagesMeta, markerImage, mainImage, detailImages
        );
        boolean ok = (pNo != null && pNo != 0);
        if (!ok) return ResponseEntity.status(460).body("저장 실패");
        return ResponseEntity.ok(pNo);
    } // func end

    /**
     * [PI-04] 플레이스 기본정보 수정
     *
     * @author OngTK
     */
    @PutMapping("/basic")
    public ResponseEntity<?> updatePlaceBasicInfo(@RequestBody PlaceInfoDto placeInfoDto) {
        if (placeInfoDto.getPNo() == 0) {
            return ResponseEntity.badRequest().body("pNo가 존재하지 않습니다.");
        }
        boolean result = placeInfoService.update(placeInfoDto);

        return ResponseEntity.ok(result);
    } // func end

    /**
     * [PI-05] 플레이스 기본정보 삭제
     * <p>
     * pNo를 받아 해당 pNo의 showflag를 0으로 수정
     *
     * @author OngTK
     */
    @DeleteMapping("/basic")
    public ResponseEntity<?> deletePlaceBasicInfo(@RequestParam @PositiveParam int pNo) {
        boolean result = placeInfoService.delete(pNo);
        return ResponseEntity.ok(result);
    } // func end

    /**
     * [PI-06] 플레이스 일괄 등록(신규)
     * <p>
     * DetailSection 내 모든 컴포넌트(공통/상세/반복)의 데이터를 한 번에 받아 저장합니다.
     * <p>
     * - multipart/form-data 요청을 통해 JSON 파트 + 파일 파트를 함께 전송합니다.
     * <p>
     * - 상세 정보 DTO(Festival/Restaurant/Tour)와 반복 정보(List<PlaceInfoRepeatDto>)는 null 가능하며, null 시 해당 저장은 패스합니다.
     * <p>
     * - 신규 등록이므로 상세 DTO에는 pNo가 비어 있을 수 있으며, 서버에서 생성된 pNo를 주입하여 저장합니다.
     *
     * @author OngTK
     */
    @PostMapping(value = "/all", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveAllPlaceAndDetailInfo(
            // 공통 JSON 파트
            @RequestPart("placeInfo") PlaceInfoDto placeInfo,
            @RequestPart("marker") MarkersGPSDto marker,
            @RequestPart(value = "imagesMeta", required = false) List<PlaceImageDetailDto> imagesMeta,

            // 파일 파트
            @RequestPart(value = "markerImage", required = false) MultipartFile markerImage,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages,

            // 상세 정보(JSON) 파트 - null 가능
            @RequestPart(value = "tourIntro", required = false) TourIntroDto tourIntro,
            @RequestPart(value = "festivalIntro", required = false) FestivalIntroDto festivalIntro,
            @RequestPart(value = "restaurantIntro", required = false) RestaurantIntroDto restaurantIntro,

            // 반복 정보(JSON) 파트 - null 가능
            @RequestPart(value = "placeInfoRepeat", required = false) List<PlaceInfoRepeatDto> placeInfoRepeat
    ) {
        Integer pNo2 = placeAggregateService.saveAllPlaceAndDetailInfo(
                placeInfo, marker, imagesMeta,
                markerImage, mainImage, detailImages,
                tourIntro, festivalIntro, restaurantIntro,
                placeInfoRepeat
        );
        boolean ok = (pNo2 != null && pNo2 != 0);
        if (!ok) return ResponseEntity.status(460).body("일괄 등록에 실패했습니다.");
        if (ok) return ResponseEntity.ok(pNo2);
        return ResponseEntity.ok(true);
    } // func end

    /**
     * [PI-08] 플레이스 일괄 수정(UPDATE)
     * <p>
     * 신규와 동일한 멀티파트 구조를 사용하되, placeInfo.pNo가 반드시 존재해야 합니다.
     * <p>
     * 상세/반복 DTO는 각각의 status 값에 따라 C/U/D가 수행됩니다.
     */
    @PutMapping(value = "/all", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateAllPlaceAndDetailInfo(
            // 공통 JSON 파트
            @RequestPart("placeInfo") PlaceInfoDto placeInfo,
            @RequestPart("marker") MarkersGPSDto marker,
            @RequestPart(value = "imagesMeta", required = false) List<PlaceImageDetailDto> imagesMeta,

            // 파일 파트(선택)
            @RequestPart(value = "markerImage", required = false) MultipartFile markerImage,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages,

            // 상세 정보(JSON) 파트 - null 가능
            @RequestPart(value = "tourIntro", required = false) TourIntroDto tourIntro,
            @RequestPart(value = "festivalIntro", required = false) FestivalIntroDto festivalIntro,
            @RequestPart(value = "restaurantIntro", required = false) RestaurantIntroDto restaurantIntro,

            // 반복 정보(JSON) 파트 - null 가능
            @RequestPart(value = "placeInfoRepeat", required = false) List<PlaceInfoRepeatDto> placeInfoRepeat
    ) {

        if (placeInfo == null || placeInfo.getPNo() == 0) {
            return ResponseEntity.badRequest().body("pNo가 존재하지 않습니다.");
        }

        Integer pNo3 = placeAggregateService.saveAllPlaceAndDetailInfo(
                placeInfo, marker, imagesMeta,
                markerImage, mainImage, detailImages,
                tourIntro, festivalIntro, restaurantIntro,
                placeInfoRepeat
        );
        boolean ok = (pNo3 != null && pNo3 != 0);
        if (!ok) return ResponseEntity.status(460).body("일괄 수정에 실패했습니다.");
        return ResponseEntity.ok(true);
    } // func end

    /**
     * [PI-07] 플레이스 검색(by사용자)
     * <p>
     * [키워드, 사용자위치]를 입력받아, 해당하는 플레이스 정보들을 조회한다.
     *
     * @param keyword 검색한 키워드
     * @param lat     사용자 위치 기준 위도
     * @param lng     사용자 위치 기준 경도
     * @return 키워드에 의한 검색 결과
     * @author AhnJH
     */
    @GetMapping("/searchbyusers")
    public ResponseEntity<?> searchPlacesByUsers(@RequestParam String keyword,
                                                 @RequestParam double lat,
                                                 @RequestParam double lng) {
        return ResponseEntity.ok(placeInfoService.searchPlacesByUsers(keyword, lat, lng));
    } // func end
} // class end
