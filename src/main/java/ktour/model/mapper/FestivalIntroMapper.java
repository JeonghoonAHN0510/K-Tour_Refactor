package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.FestivalIntroDto;
import ktour.model.repository.CommonRepository;

import java.util.Optional;

/**
 * [ FestivalIntroService ]
 * <p>
 * 축제 상세정보 / ContentTypeID 15 / PK 3
 * @author OngTK
 */
@Mapper
public interface FestivalIntroMapper extends CommonRepository<FestivalIntroDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] pno별 개별 축제 정보 조회
     * @author OngTK
     */
    @Select("""
            select * from festivalintro where pno = #{pno};
            """)
    Optional<FestivalIntroDto> read(Integer pno);

    /**
     * [2] 축제 정보 생성
     * @author OngTK
     */
    @Override
    @Insert("""
             INSERT INTO festivalIntro (
                    pNo,
                    eventStartDate,
                    eventEndDate,
                    progressType,
                    festivalType,
                    ageLimit,
                    bookingPlace,
                    discountInfoFestival,
                    eventHomepage,
                    eventPlace,
                    festivalGrade,
                    placeInfo,
                    playTime,
                    program,
                    spendTimeFestival,
                    sponsor1,
                    sponsor1Tel,
                    sponsor2,
                    sponsor2Tel,
                    subEvent,
                    useTimeFestival
                ) VALUES (
                    #{pNo},
                    #{eventStartDate},
                    #{eventEndDate},
                    #{progressType},
                    #{festivalType},
                    #{ageLimit},
                    #{bookingPlace},
                    #{discountInfoFestival},
                    #{eventHomepage},
                    #{eventPlace},
                    #{festivalGrade},
                    #{placeInfo},
                    #{playTime},
                    #{program},
                    #{spendTimeFestival},
                    #{sponsor1},
                    #{sponsor1Tel},
                    #{sponsor2},
                    #{sponsor2Tel},
                    #{subEvent},
                    #{useTimeFestival} )
            """)
    @Options(useGeneratedKeys = true,  keyProperty = "fiNo")
    int create(FestivalIntroDto festivalIntroDto);

    /**
     * [3] 축제 정보 수정
     * @author OngTK
     */
    @Override
    @Update("""
            UPDATE festivalIntro
                   SET eventStartDate        = #{eventStartDate},
                       eventEndDate          = #{eventEndDate},
                       progressType          = #{progressType},
                       festivalType          = #{festivalType},
                       ageLimit              = #{ageLimit},
                       bookingPlace          = #{bookingPlace},
                       discountInfoFestival  = #{discountInfoFestival},
                       eventHomepage         = #{eventHomepage},
                       eventPlace            = #{eventPlace},
                       festivalGrade         = #{festivalGrade},
                       placeInfo             = #{placeInfo},
                       playTime              = #{playTime},
                       program               = #{program},
                       spendTimeFestival     = #{spendTimeFestival},
                       sponsor1              = #{sponsor1},
                       sponsor1Tel           = #{sponsor1Tel},
                       sponsor2              = #{sponsor2},
                       sponsor2Tel           = #{sponsor2Tel},
                       subEvent              = #{subEvent},
                       useTimeFestival       = #{useTimeFestival}
                 WHERE fiNo = #{fiNo}
            """)
    boolean update(FestivalIntroDto festivalIntroDto);
} // Interface end
