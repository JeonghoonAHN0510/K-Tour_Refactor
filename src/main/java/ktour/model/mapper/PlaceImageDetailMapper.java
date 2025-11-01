package ktour.model.mapper;


import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.PlaceImageDetailDto;
import ktour.model.repository.CommonRepository;

import java.util.List;

/**
 * [ PlaceImageDetail ]
 * <p>
 * 플레이스 상세 이미지
 *
 * @author OngTK
 */
@Mapper
public interface PlaceImageDetailMapper extends CommonRepository<PlaceImageDetailDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] pno 별 전체 조회
     */
    @Select("""
            select * from placeimagedetail where pNo = #{pNo};
            """)
    List<PlaceImageDetailDto> readAllToPno(int pno);

    @Select("""
                SELECT IFNULL(MAX(CAST(serialnum AS UNSIGNED)), -1)
                FROM placeImageDetail
                WHERE pNo = #{pNo}
            """)
    int findMaxSerial(@Param("pNo") Integer pNo);

    @Insert(
            """
                <script>
                    INSERT INTO placeImageDetail
                    (pNo, isEditable, serialnum, originimgurl, smallimageurl, imgname) VALUES
                    <foreach collection='list' item='it' separator=','>
                        (#{it.pNo}, #{it.isEditable}, #{it.serialnum}, #{it.originimgurl}, #{it.smallimageurl}, #{it.imgname} )
                    </foreach>
                </script>
            """
    )
    int bulkInsert(@Param("list") List<PlaceImageDetailDto> list);

    @Delete("""
            DELETE FROM placeImageDetail WHERE pNo = #{pNo}
            """)
    int deleteAllByPno(@Param("pNo") Integer pNo);
} // interface end
