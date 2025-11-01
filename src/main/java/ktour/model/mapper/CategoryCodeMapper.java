package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.CategoryCodeDto;
import ktour.model.repository.CommonRepository;

import java.util.List;

@Mapper
public interface CategoryCodeMapper extends CommonRepository<CategoryCodeDto, Integer, PlaceInfoCriteria> {

    @Select("""
            select * from categorycode;
            """)
    @Override
    List<CategoryCodeDto> readAll();

} // interface end
