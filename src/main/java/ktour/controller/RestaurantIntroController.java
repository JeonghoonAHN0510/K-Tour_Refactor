package ktour.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.model.dto.RestaurantIntroDto;
import ktour.service.RestaurantIntroService;

/**
 * [ RestaurantIntro ]
 * <p>
 * 음식점 상세 정보
 * <p>
 * ctNo 8 / contentType 39
 *
 * @author OngTK
 */
@RestController
@RequestMapping("/placeinfo/restaurant")
@RequiredArgsConstructor
public class RestaurantIntroController {

    private final RestaurantIntroService restaurantIntroService;

    /**
     * [ PR-01 ] 음식정 상세정보 저장
     * <p>
     * riStatus 에 따라서 service에서 C/U를 수행
     * <p>
     * C 1 / U 2
     * @author OngTK
     */
    @PostMapping
    public ResponseEntity<?> saveRestaurantIntro(@RequestBody RestaurantIntroDto dto) {
        System.out.println("RestaurantIntroController.saveRestaurantIntro");
        System.out.println("dto = " + dto);
        if (dto == null) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        boolean result = restaurantIntroService.saveRestaurantIntro(dto);
        if (!result) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(result);
    } // class end

    /**
     * [ PR-02 ] 음식정 상세정보 조회 / sample 51385
     *
     * @author OngTK
     */
    @GetMapping
    public ResponseEntity<?> readRestaurantIntro(@RequestParam int pNo) {
        if (pNo == 0) {
            return ResponseEntity.status(460).body("입력된 정보가 올바르지 못함");
        }
        return ResponseEntity.ok(restaurantIntroService.read(pNo));
    } // class end

} // class end
