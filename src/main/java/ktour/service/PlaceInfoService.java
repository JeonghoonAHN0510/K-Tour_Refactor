package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.*;
import ktour.model.mapper.*;
import ktour.model.repository.CommonRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * PlaceInfo Table과 관련된 Service
 * @author AhnJH OngTK
 */

@Service
@RequiredArgsConstructor
public class PlaceInfoService extends AbstractService<PlaceInfoDto, Integer, PlaceInfoCriteria> {

    private final PlaceInfoMapper placeInfoMapper;
    private final TourIntroMapper tourIntroMapper;
    private final FestivalIntroMapper festivalIntroMapper;
    private final RestaurantIntroMapper restaurantIntroMapper;
    private final PlaceInfoRepeatMapper placeInfoRepeatMapper;
    private final PlaceImageDetailMapper placeImageDetailMapper;
    private final MarkersGPSMapper markersGPSMapper;

    /**
     * [0] AbstreactServie 추상메소드 구현
     * @return Mapper : 특별한 Service 로직이 없는 경우, 바로 Mapper 경로를 수행함
     */
    @Override
    protected CommonRepository<PlaceInfoDto, Integer, PlaceInfoCriteria> repo() {
        return placeInfoMapper;
    }

    /**
     * [PI-02] 플레이스 개별조회
     * @param pno
     * @return Map<String, Object> :
     * <p>{"placeinfo" : {dto} },
     * <p>{"detailInfo":{dto} - 컨탠츠별로 서로 다른 DTO를 반환},
     * <p>{"placeInfoRepeat":{dto} },
     * <p>{"markerGPS":{dto} },
     * <p>{"placeImg":{dto} }
     * @author OngTK
     */
    public Map<String,Object> getPlace(int pno){

        // return할 Map 구성
        Map<String, Object> result = new HashMap<>();

        // 기본정보 조회
        Optional<PlaceInfoDto> placeInfoDto = placeInfoMapper.read(pno);
        result.put("placeInfo",placeInfoDto);

        // 기본정보에서 컨텐츠 타입 조회
        int ctNo = placeInfoDto.get().getPNo();

        // 컨턴츠타입에 맞는 디테일정보 조회
        if(ctNo == 1){
            // 관광지 ctNo 1 / contentTypeID 12  // testPno 6881
            Optional<TourIntroDto> tourIntroDto = tourIntroMapper.read(pno);
            result.put("TourIntro",tourIntroDto);
        } else if (ctNo == 3){
            // 행사/공연/축제 ctNo 3 / contentTypeID 15 // testPno 23405
            Optional<FestivalIntroDto> festivalIntroDto = festivalIntroMapper.read(pno);
            result.put("FestivalIntro",festivalIntroDto);
        } else if (ctNo == 8 ){
            //음식점 ctNo 8 / contentTypeID 39 // testPno 51385
            Optional<RestaurantIntroDto> restaurantIntroDto = restaurantIntroMapper.read(pno);
            result.put("RestaurantIntro",restaurantIntroDto);
        } // if end

        // 반복정보 조회
        List<PlaceInfoRepeatDto> placeInfoDtoList = placeInfoRepeatMapper.readAllToPno(pno);
        result.put("PlaceInfoDtoList",placeInfoDtoList);

        // 상세 이미지 정보 조회
        List<PlaceImageDetailDto> placeImageDetailDtoList = placeImageDetailMapper.readAllToPno(pno);
        result.put("PlaceImageDetail",placeImageDetailDtoList);

        // 마커 정보 조회
        Optional<MarkersGPSDto> markersGPSDto = markersGPSMapper.read(pno);
        result.put("MarkersGPSDto",markersGPSDto);

        // 반환
        return result;
        
    } // func end

    /**
     * [PI-07] 플레이스 검색(by사용자)
     * <p>
     * [키워드, 사용자위치]를 입력받아, 해당하는 플레이스 정보들을 조회한다.
     *
     * @param keyword 검색한 키워드
     * @param lat 사용자 위치 기준 위도
     * @param lng 사용자 위치 기준 경도
     * @return 키워드에 의한 검색 결과
     * @author AhnJH
     */
    public List<Map<String, Object>> searchPlacesByUsers(String keyword, double lat, double lng){
        System.out.println("keyword = " + keyword);
        System.out.println("lat = " + lat);
        System.out.println("lng = " + lng);
        return placeInfoMapper.searchPlacesByUsers(keyword, lat, lng);
    } // func end
} // class end
