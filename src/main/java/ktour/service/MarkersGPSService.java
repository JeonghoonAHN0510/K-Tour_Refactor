package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.MarkersGPSDto;
import ktour.model.mapper.MarkersGPSMapper;
import ktour.model.repository.CommonRepository;

import java.util.List;
import java.util.Map;

/**
 * MarkersGPS Table과 관련된 Service
 * @author AhnJH
 */

@Service
@RequiredArgsConstructor
public class MarkersGPSService extends AbstractService<MarkersGPSDto, Integer, PlaceInfoCriteria>{

    private final MarkersGPSMapper markersGPSMapper;

    @Override
    protected CommonRepository<MarkersGPSDto, Integer, PlaceInfoCriteria> repo() {
        return markersGPSMapper;
    }

    /**
     * [MG-01] 렌더링 기준 마커조회
     * 렌더링된 화면 기준으로 [동서남북] 좌표를 받아, 해당 범위 내의 마커를 조회한다.
     *
     * @param markersGPSDto 동서남북 좌표가 들어있는 Dto
     * @return 해당 범위에 있는 마커 리스트
     * @author AhnJH
     */
    public List<Map<String, Object>> getMarkersGpsByCurrentLatLng(MarkersGPSDto markersGPSDto){
        // 1. 축제를 제외한 List
        List<Map<String, Object>> markersGps = markersGPSMapper.getMarkersGpsByCurrentLatLng(markersGPSDto);
        // 2. 축제가 진행중인 List
        markersGps.addAll(markersGPSMapper.getMarkersGpsOnFestival(markersGPSDto));
        return markersGps;
    } // func end
} // class end