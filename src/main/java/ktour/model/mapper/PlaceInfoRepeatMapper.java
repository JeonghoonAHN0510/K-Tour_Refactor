package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.PlaceInfoRepeatDto;
import ktour.model.repository.CommonRepository;

import java.util.List;

/**
 * PlaceInfoRepeat Place 반복정보
 * <p>
 * CotentTypeID : 12, 14, 15, 28, 38, 39
 * <p>
 * 25(여행코스),32(숙박)의 경우 반복정보를 사용하지 않음
 * <p>
 * CRUD를 위해 CommonRepository 를 extends
 * <p>
 * PlaceInfoRepeatDto : 반복정보 DTO
 * <p>
 * Integer : pirNo[PK]
 * <p>
 * RoleCriteria : 본 도메인에서는 검색 기능을 지원하지 않음으로 임의의 검색 객체를 삽입
 *
 * @author OngTK
 */
@Mapper
public interface PlaceInfoRepeatMapper extends CommonRepository<PlaceInfoRepeatDto, Integer, PlaceInfoCriteria> {

    // [1] 개별 등록
    @Insert("""
            INSERT INTO placeInfoRepeat (pNo, infoName, infoText, serialnum, fldgubun)
            SELECT #{pNo}, #{infoName}, #{infoText}, IFNULL(MAX(serialnum) + 1, 0), 0
            FROM (
                SELECT serialnum FROM placeInfoRepeat WHERE pNo = #{pNo}
            ) AS t;
            """)
    @Override
    @Options(useGeneratedKeys = true, keyProperty = "pirNo")
    int create(PlaceInfoRepeatDto placeInfoRepeatDto);

    // [2] pno 별 전체 조회
    @Select("""
            SELECT *
            FROM placeInfoRepeat
            WHERE pNo = #{pNo}
              AND NOT (infoName IS NULL AND infoText IS NULL);
            """)
    List<PlaceInfoRepeatDto> readAllToPno(int pno);

    // [3] 개별 수정
    @Update("""
            UPDATE placeInfoRepeat
               SET infoName = #{infoName},
                   infoText = #{infoText}
             WHERE pirNo = #{pirNo}
            """)
    @Override
    boolean update(PlaceInfoRepeatDto placeInfoRepeatDto);

    // [4] 개별 삭제
    // 레코드를 삭제할 경우
    @Override
    @Update("""
            UPDATE placeInfoRepeat
               SET infoName = NULL,
                   infoText = NULL
             WHERE pirNo = #{pirNo}
            """)
    boolean delete(Integer pirNo);

} // class end

