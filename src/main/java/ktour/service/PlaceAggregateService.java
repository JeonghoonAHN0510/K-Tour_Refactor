package ktour.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ktour.model.dto.*;
import ktour.util.file.FileUtil;

import java.util.*;

/**
 * [ PlaceAggregate ]
 * <p>
 * PlaceInfo 처리에 대하여
 * <p>
 * 복합 DTO + 복합 파일 업로드에 따라서 이를 관리하기 위한 별도의 도메인
 * @author OngTK
 */
@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class PlaceAggregateService {

    private final PlaceInfoService placeInfoService;
    private final MarkersGPSService markersGPSService;
    private final PlaceImageDetailService placeImageDetailService;
    private final FileUtil fileUtil;
    private final LDongCodeService lDongCodeService;
    private final TourIntroService tourIntroService;
    private final FestivalIntroService festivalIntroService;
    private final RestaurantIntroService restaurantIntroService;
    private final PlaceInfoRepeatService placeInfoRepeatService;

    /**
     * [PI-03] 플레이스 기본정보 등록
     * <p>
     * 대표이미지 1 + 마커이미지 1 + 상세이미지(<=10) + 3 DTO를 한 번에 저장합니다.
     * <p>
     * 1) 파일 임시저장
     * <p>
     * 2) PlaceInfo upsert (pNo 확보)
     * <p>
     * 3) 대표/상세 첫 이미지 URL 반영
     * <p>
     * 4) Marker upsert
     * <p>
     * 5) 상세이미지 bulk insert (pNo별 serialnum = MAX+1 ~)
     * <p>
     * 6) (선택) 커밋 후 파일 승격
     *
     * @author OngTK
     */
    public Integer savePlaceBasicInfo(
            PlaceInfoDto placeInfo,
            MarkersGPSDto marker,
            List<PlaceImageDetailDto> imagesMeta,
            MultipartFile markerImage,
            MultipartFile mainImage,
            List<MultipartFile> detailImages
    ) {
        // ---- [0] 유효성 ----
        if (placeInfo == null) return null;
        if (detailImages != null && detailImages.size() > 10) return null;

        // pno가 0 이면 신규 등록
        if (placeInfo.getPNo() == 0) {

            // ---- [1] 파일 임시저장 (기존 FileUtil 사용) ----
            // FileUtil은 "컬럼명/분류" 기반으로 하위폴더를 나누는 스타일이므로, 의미있는 이름을 넘겨줍니다.
            String tmpMarkerFile = uploadNullable(markerImage, "marker");
            String tmpMainFile = uploadNullable(mainImage, "firstImage");
            List<String> tmpDetailFiles = uploadAllNullable(detailImages, "originImgUrl");

            // ---- [2] 파일명을 placeInfo에 삽입
            if (!tmpDetailFiles.isEmpty()) {
                placeInfo.setFirstimage(tmpMainFile);
                placeInfo.setFirstimage2(tmpDetailFiles.get(0));
            }
            // ---- [2.1] ldNo 처리
            StringTokenizer st = new StringTokenizer(placeInfo.getAddr1(), " ");
            String lDongRegnNm = st.nextToken();
            String lDongSignguNm = st.nextToken();
            LDongCodeDto lDongCodeDto = lDongCodeService.lookforLdNo(lDongRegnNm, lDongSignguNm);
            placeInfo.setLdNo(lDongCodeDto.getLdNo());

            // ---- [3] PlaceInfo upsert → pNo 확보 ----
            Integer pNo = upsertPlaceInfoAndGetPno(placeInfo);

            // ---- [4] Marker upsert ----
            if (tmpMarkerFile != null) marker.setMkURL(tmpMarkerFile);
            marker.setPNo(pNo);
            markersGPSServiceUpsert(marker);

            // ---- [5] 상세이미지 Bulk Insert ----
            // imagesMeta가 null이면 파일명만 저장
            List<PlaceImageDetailDto> rows = buildImageRows(pNo, imagesMeta, tmpDetailFiles);
            if (!rows.isEmpty()) placeImageDetailServiceBulkInsert(rows);

            return pNo;
        } else {
            // pno가 0이 아니면 업데이트
            int searchPno = placeInfo.getPNo();

            // [1] 기존 placeInfo를 가져오고 이미지를 제외한 정보를 삽입 > update
            Optional<PlaceInfoDto> getPlaceDto = placeInfoService.read(searchPno);
            PlaceInfoDto newPlaceDto = getPlaceDto.get();

            // [1.1] ldNo 확인
            StringTokenizer st = new StringTokenizer(placeInfo.getAddr1(), " ");
            String lDongRegnNm = st.nextToken();
            String lDongSignguNm = st.nextToken();
            LDongCodeDto lDongCodeDto = lDongCodeService.lookforLdNo(lDongRegnNm, lDongSignguNm);

            // [1.2] 조회한 placeDto에 신규 데이터 삽입
            newPlaceDto.setLdNo(lDongCodeDto.getLdNo());
            newPlaceDto.setCtNo(placeInfo.getCtNo());
            newPlaceDto.setCcNo(placeInfo.getCcNo());
            newPlaceDto.setEditable(placeInfo.isEditable());
            newPlaceDto.setTitle(placeInfo.getTitle());
            newPlaceDto.setShowflag(placeInfo.getShowflag());
            newPlaceDto.setAddr1(placeInfo.getAddr1());
            newPlaceDto.setAddr2(placeInfo.getAddr2());
            newPlaceDto.setZipcode(placeInfo.getZipcode());
            newPlaceDto.setHomepage(placeInfo.getHomepage());
            newPlaceDto.setTel(placeInfo.getTel());
            newPlaceDto.setTelname(placeInfo.getTelname());
            newPlaceDto.setOverview(placeInfo.getOverview());
            newPlaceDto.setCreatedAt(placeInfo.getCreatedAt());

            // [1.3] 이미지 업데이트 정책 적용 (새 업로드가 있으면 교체, 없으면 유지)
            boolean hasNewMarker = (markerImage != null && !markerImage.isEmpty());
            boolean hasNewMain = (mainImage != null && !mainImage.isEmpty());
            boolean hasNewDetails = (detailImages != null && !detailImages.isEmpty());

            String tmpMarkerFile = uploadNullable(markerImage, "marker");
            String tmpMainFile = uploadNullable(mainImage, "firstImage");
            List<String> tmpDetailFiles = uploadAllNullable(detailImages, "originImgUrl");

            // 대표 이미지 교체
            if (hasNewMain) {
                try {
                    if (newPlaceDto.getFirstimage() != null) {
                        fileUtil.deleteFile(newPlaceDto.getFirstimage(), "firstImage", String.valueOf(1));
                    }
                } catch (Exception ignore) {}
                if (tmpMainFile != null) newPlaceDto.setFirstimage(tmpMainFile);
            }

            // 상세 이미지 전체 교체 + firstimage2 반영
            if (hasNewDetails) {
                try {
                    List<PlaceImageDetailDto> olds = placeImageDetailService.readAllToPno(searchPno);
                    for (PlaceImageDetailDto d : olds) {
                        if (d.getOriginimgurl() != null) fileUtil.deleteFile(d.getOriginimgurl(), "originImgUrl", String.valueOf(1));
                        if (d.getSmallimageurl() != null) fileUtil.deleteFile(d.getSmallimageurl(), "originImgUrl", String.valueOf(1));
                    }
                } catch (Exception ignore) {}
                placeImageDetailService.deleteAllByPno(searchPno);
                List<PlaceImageDetailDto> rows = buildImageRows(searchPno, imagesMeta, tmpDetailFiles);
                if (!rows.isEmpty()) {
                    newPlaceDto.setFirstimage2(tmpDetailFiles.get(0));
                    placeImageDetailServiceBulkInsert(rows);
                }
            }

            // 마커 이미지 교체 (좌표 업데이트는 아래 기본 흐름 유지)
            if (hasNewMarker) {
                try {
                    Optional<MarkersGPSDto> origin = markersGPSService.read(searchPno);
                    if (origin.isPresent() && origin.get().getMkURL() != null) {
                        fileUtil.deleteFile(origin.get().getMkURL(), "marker", String.valueOf(1));
                    }
                } catch (Exception ignore) {}
                if (tmpMarkerFile != null) {
                    Optional<MarkersGPSDto> origin2 = markersGPSService.read(searchPno);
                    MarkersGPSDto upd = origin2.orElse(new MarkersGPSDto());
                    upd.setPNo(searchPno);
                    upd.setMkURL(tmpMarkerFile);
                    if (upd.getMkNo() == 0) {
                        markersGPSService.create(upd);
                    } else {
                        markersGPSService.update(upd);
                    }
                }
            }

            boolean result1 = placeInfoService.update(newPlaceDto);

            // [2] 기본 markerGPS 정보를 가져오고 이미지를 제외한 정보를 삽입 > update
            Optional<MarkersGPSDto> getMarkerDto = markersGPSService.read(searchPno);
            MarkersGPSDto newMarkerDto = getMarkerDto.get();
            newMarkerDto.setMapy(marker.getMapy());
            newMarkerDto.setMapx(marker.getMapx());
            boolean result2 = markersGPSService.update(newMarkerDto);

            if (result1 && result2) {
                return searchPno;
            }
            return null;
        }
    } // func end

    /**
     * [PI-06] 플레이스 + 상세 + 반복 일괄 등록(신규)
     * <p>
     * 1) 기본정보 + 파일 저장(savePlaceBasicInfo)
     * <p>
     * 2) 생성된 pNo를 상세/반복 DTO에 주입 후 각 서비스 저장
     * <p>
     * 3) null 입력은 저장 생략
     * @author OngTK
     */
    public Integer saveAllPlaceAndDetailInfo(
            PlaceInfoDto placeInfo,
            MarkersGPSDto marker,
            List<PlaceImageDetailDto> imagesMeta,
            MultipartFile markerImage,
            MultipartFile mainImage,
            List<MultipartFile> detailImages,
            TourIntroDto tourIntro,
            FestivalIntroDto festivalIntro,
            RestaurantIntroDto restaurantIntro,
            List<PlaceInfoRepeatDto> placeInfoRepeat
    ) {
        // [1] 기본정보 + 파일 저장
        Integer basicPno = savePlaceBasicInfo(placeInfo, marker, imagesMeta, markerImage, mainImage, detailImages);
        if (basicPno == null || basicPno == 0) return null;

        // 생성된 pNo 확보(MyBatis useGeneratedKeys true)
        int pNo = placeInfo.getPNo();
        if (pNo == 0) return null;

        // [2] 상세 정보 저장 - null 시 생략, pNo 주입
        if (tourIntro != null) {
            tourIntro.setPNo(pNo);
            boolean ok = tourIntroService.saveTourIntro(tourIntro);
            if (!ok) return null;
        }
        if (festivalIntro != null) {
            festivalIntro.setPNo(pNo);
            boolean ok = festivalIntroService.saveFestivalIntro(festivalIntro);
            if (!ok) return null;
        }
        if (restaurantIntro != null) {
            restaurantIntro.setPNo(pNo);
            boolean ok = restaurantIntroService.saveRestaurantIntro(restaurantIntro);
            if (!ok) return null;
        }

        // [3] 반복 정보 저장 - null 시 생략, 각 항목에 pNo 주입
        if (placeInfoRepeat != null && !placeInfoRepeat.isEmpty()) {
            for (PlaceInfoRepeatDto dto : placeInfoRepeat) {
                dto.setPNo(pNo);
            }
            boolean ok = placeInfoRepeatService.savePlaceRepeatInfo(placeInfoRepeat);
            if (!ok) return null;
        }

        return pNo;
    }



    // ===== 내부 헬퍼 =====

    /**
     * 단일 파일 저장 처리
     */
    private String uploadNullable(MultipartFile file, String columnName) {
        try {
            if (file == null || file.isEmpty()) return null;
            return fileUtil.uploadFile(file, columnName, String.valueOf(1)); // siNo 처리 로직 구상 필요
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 복수 파일 저장 처리 > 상기의 단일 파일 저장 처리를 활용
     */
    private List<String> uploadAllNullable(List<MultipartFile> files, String columnName) {
        List<String> out = new ArrayList<>();
        if (files == null) return out;
        for (MultipartFile f : files) {
            String name = uploadNullable(f, columnName);
            if (name != null) out.add(name);
        }
        return out;
    }

    /**
     * PlaceInfo 저장 처리
     */
    private Integer upsertPlaceInfoAndGetPno(PlaceInfoDto placeInfo) {
        // 기존 파일에 upsert가 없다면: pNo==0이면 insert, 아니면 update
        if (placeInfo.getPNo() == 0) {
            // insert → @Options(useGeneratedKeys=true)로 pNo 세팅되도록 구성되어 있어야 합니다.
            placeInfoService.create(placeInfo);
            return placeInfo.getPNo();
        } else {
            placeInfoService.update(placeInfo);
            return placeInfo.getPNo();
        }
    }

    /**
     * 마커정보 저장
     */
    private void markersGPSServiceUpsert(MarkersGPSDto marker) {
        if (marker.getMkNo() == 0) {
            markersGPSService.create(marker);
        } else {
            markersGPSService.update(marker);
        }
    }

    /**
     * 상세 이미지 DTO - LIST 생성
     */
    private List<PlaceImageDetailDto> buildImageRows(Integer pNo, List<PlaceImageDetailDto> metas, List<String> files) {
        List<PlaceImageDetailDto> rows = new ArrayList<>();
        if (files == null || files.isEmpty()) return rows;

        for (int i = 0; i < files.size(); i++) {
            PlaceImageDetailDto d = new PlaceImageDetailDto();
            d.setPNo(pNo);
            d.setEditable(true);
            d.setOriginimgurl(files.get(i));
            d.setSmallimageurl(files.get(i)); // 썸네일 별도면 여기 교체
            d.setImgname(metas.get(0).getImgname());
            if (metas != null && i < metas.size()) {
                PlaceImageDetailDto m = metas.get(i);
                d.setImgname(Objects.requireNonNullElse(m.getImgname(), null));
            }
            rows.add(d);
        }
        return rows;
    }

    /**
     * 상세이미지 DB 저장
     */
    private void placeImageDetailServiceBulkInsert(List<PlaceImageDetailDto> rows) {
        placeImageDetailService.bulkInsertWithSerial(rows);
    }

} // class end
