package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ktour.model.dto.MarkersGPSDto;
import ktour.service.MarkersGPSService;

/**
 * MarkersGPS Table과 관련된 Controller
 * @author AhnJH
 */

@RestController
@RequestMapping("/markersgps")
@RequiredArgsConstructor
public class MarkersGPSController {
    private final MarkersGPSService markersGPSService;

    /**
     * [MG-01] 렌더링 기준 마커조회
     * 렌더링된 화면 기준으로 [동서남북] 좌표를 받아, 해당 범위 내의 마커를 조회한다.
     *
     * @param south 남쪽 좌표
     * @param north 북쪽 좌표
     * @param west  서쪽 좌표
     * @param east  동쪽 좌표
     * @return 해당 범위에 있는 마커 리스트
     * @author AhnJH
     */
    @GetMapping("/getbycurrentlatlng")
    public ResponseEntity<?> getMarkersGpsByCurrentLatLng(@RequestParam double south,
                                                          @RequestParam double north,
                                                          @RequestParam double west,
                                                          @RequestParam double east,
                                                          @RequestParam(required = false) Integer ctNo){
        // 1. 동서남북 좌표를 담을 Dto 선언
        MarkersGPSDto markersGPSDto = new MarkersGPSDto();
        // 2. 선언한 Map에 좌표 담기
        markersGPSDto.setSouth(south);
        markersGPSDto.setNorth(north);
        markersGPSDto.setWest(west);
        markersGPSDto.setEast(east);
        if (ctNo != null) markersGPSDto.setCtNo(ctNo);
        // 3. 좌표를 Service에게 전달하여 값 반환하기
        return ResponseEntity.ok(markersGPSService.getMarkersGpsByCurrentLatLng(markersGPSDto));
    } // func end
} // class end