package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.model.dto.PlaceInfoRepeatDto;
import ktour.service.PlaceInfoRepeatService;

import java.util.List;

/**
 * PlaceInfoRepeat Place 반복정보
 * <p>
 * CotentTypeID : 12, 14, 15, 28, 38, 39
 * <p>
 * 25(여행코스),32(숙박)의 경우 반복정보를 사용하지 않음
 *
 * @author OngTK
 */

@RestController
@RequestMapping("/placeinfo/repeatinfo")
@RequiredArgsConstructor
public class PlaceInfoRepeatController {

    private final PlaceInfoRepeatService placeInfoRepeatService;

    /**
     * [ PR-01 ] 플레이스 반복정보 일괄 저장
     * @param list List<PlaceInfoRepeatDto> / PlaceInfoRepeatDto 내의 pirStatus에 따라서 service에서 CRUD를 분산
     * @author OngTK
     */
    @PostMapping
    public ResponseEntity<?> savePlaceRepeatInfo(@RequestBody List<PlaceInfoRepeatDto> list) {
        System.out.println("PlaceInfoRepeatController.savePlaceRepeatInfo");
        System.out.println("list = " + list);
        // 들어온 정보가 없다면
        if (list == null) {
            return ResponseEntity.status(460).body("정보 없음");
        }
        // service에 CUD 요청
        boolean result = placeInfoRepeatService.savePlaceRepeatInfo(list);
        // 결과 반환
        return ResponseEntity.ok(result);
    } // func end

    /**
     * [ PR-02 ] 플레이스 반복정보 삭제
     * @param pirNo 반복정보 번호 PK
     * @author OngTK
     */
    @DeleteMapping
    public ResponseEntity<?> deletePlaceRepeatInfo(@RequestParam int pirNo) {
        boolean result = placeInfoRepeatService.delete(pirNo);
        return ResponseEntity.ok(result);
    } // func end

    /***
     * [ PI-16 ] 플레이스 반복 정보 조회
     * @param pno 플레이스 번호
     * @author OngTK
     */
    @GetMapping
    public ResponseEntity<?> readPlaceRepeatInfo(@RequestParam int pno){
        if(pno == 0){
            return ResponseEntity.status(460).body("플레이스 번호가 올바르지 않습니다.");
        }
        List<PlaceInfoRepeatDto> result = placeInfoRepeatService.readAllToPno(pno);
        return ResponseEntity.ok(result);
    } // func end

} // class end
