package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.model.dto.TourIntroDto;
import ktour.service.TourIntroService;

/**
 * [ TourIntroService ]
 * <p>
 * 관광지 상세정보 / ContentTypeID 12 / PK 1
 * @author OngTK
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/placeinfo/tourIntro")
public class TourIntroController {

    private final TourIntroService tourIntroService;


    /**
     * [ TI-01 ] 관광지 상세정보 저장
     * <p>
     * tiStatus 에 따라서 service에서 C/U를 수행
     * <p>
     * C 1 / U 2
     * @author OngTK
     */
    @PostMapping
    public ResponseEntity<?> saveTourIntro(@RequestBody TourIntroDto dto) {
        System.out.println("TourIntroController.saveTourIntro");
        System.out.println("dto = " + dto);
        if (dto == null) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        boolean result = tourIntroService.saveTourIntro(dto);
        if (!result) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(result);
    } // class end

    /**
     * [ TI-02 ] 관광지 상세정보 조회 / sample
     * @author OngTK
     */
    @GetMapping
    public ResponseEntity<?> updateTourIntro(@RequestParam Integer pNo) {
        if (pNo == null) {
            return ResponseEntity.badRequest().body("pNo가 없습니다.");
        }
        if (pNo == 0) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(tourIntroService.read(pNo));
    } // class end

} // class end
