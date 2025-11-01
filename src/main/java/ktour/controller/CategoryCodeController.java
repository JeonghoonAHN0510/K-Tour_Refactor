package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ktour.model.dto.CategoryCodeDto;
import ktour.service.CategoryCodeService;

import java.util.List;

/**
 * [ 카테고리 코드 ]
 * 3단계로 구분한 카테고리
 * @author OngTK
 */

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryCodeController {

    private final CategoryCodeService categoryCodeService;

    /**
     * [CC-01] 카테고리 전체 조회
     * @author OngTK
     */
    @GetMapping
    public ResponseEntity<?> getAllCategoryCode(){
        List<CategoryCodeDto> list = categoryCodeService.readAll();
        return ResponseEntity.ok(list);
    } // func end

} // class end
