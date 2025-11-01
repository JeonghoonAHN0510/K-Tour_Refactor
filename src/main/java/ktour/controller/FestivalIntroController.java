package ktour.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.model.dto.FestivalIntroDto;
import ktour.service.FestivalIntroService;

/**
 * [ FestivalIntro ]
 * <p>
 * 행사/축제/공연
 * <p>
 * ctNo 3 / contentType 15
 *
 * @author OngTK
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/placeinfo/festivalintro")
public class FestivalIntroController {

    private final FestivalIntroService festivalIntroService;


    /**
     * [ FI-01 ] 행사/축제/공연 상세정보 저장
     * <p>
     * fiStatus 에 따라서 service 에서 C/U를 수행
     * <p>
     * C 1 / U 2
     * @author OngTK
     */
    @PostMapping
    public ResponseEntity<?> saveFestivalIntro(@RequestBody FestivalIntroDto dto) {
        System.out.println("FestivalIntroController.saveFestivalIntro");
        System.out.println("dto = " + dto);
        if (dto == null) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        boolean result = festivalIntroService.saveFestivalIntro(dto);
        if (!result) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(result);
    } // class end

    /**
     * [ FI-02 ] 행사/축제/공연 상세정보 조회 / sample
     *
     * @author OngTK
     */
    @GetMapping
    public ResponseEntity<?> readFestivalIntro(@RequestParam int pNo) {
        if (pNo == 0) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(festivalIntroService.read(pNo));
    } // class end


} // class end
