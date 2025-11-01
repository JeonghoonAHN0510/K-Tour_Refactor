package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.CategoryCodeDto;
import ktour.model.mapper.CategoryCodeMapper;
import ktour.model.repository.CommonRepository;

/**
 * [ 카테고리 코드 ]
 * 3단계로 구분한 카테고리
 * @author OngTK
 */

@Service
@RequiredArgsConstructor
public class CategoryCodeService extends AbstractService<CategoryCodeDto, Integer, PlaceInfoCriteria> {

    private final CategoryCodeMapper categoryCodeMapper;

    @Override
    protected CommonRepository<CategoryCodeDto, Integer, PlaceInfoCriteria> repo() {
        return categoryCodeMapper;
    }

} // class end
