package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.TourIntroDto;
import ktour.model.repository.CommonRepository;

import java.util.Optional;

/**
 * [ TourIntroService ]
 * <p>
 * 관광지 상세정보 / ContentTypeID 12 / PK 1
 *
 * @author OngTK
 */
@Mapper
public interface TourIntroMapper extends CommonRepository<TourIntroDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] pno별 개별 관광지 상세조회
     *
     * @author OngTK
     */
    @Select("""
            select * from tourIntro where pno = #{pno};
            """)
    Optional<TourIntroDto> read(Integer pno);


    /**
     * [2] 관광지 정보 생성
     *
     * @author OngTK
     */

    @Insert("""
            INSERT INTO tourIntro (
                    pNo,
                    accomcount,
                    chkBabyCarriage,
                    chkCreditCard,
                    chkPet,
                    expAgeRange,
                    expGuide,
                    heritage1,
                    heritage2,
                    heritage3,
                    infoCenter,
                    openDate,
                    parking,
                    restDate,
                    useSeason,
                    useTime
                ) VALUES (
                    #{pNo},
                    #{accomcount},
                    #{chkBabyCarriage},
                    #{chkCreditCard},
                    #{chkPet},
                    #{expAgeRange},
                    #{expGuide},
                    #{heritage1},
                    #{heritage2},
                    #{heritage3},
                    #{infoCenter},
                    #{openDate},
                    #{parking},
                    #{restDate},
                    #{useSeason},
                    #{useTime}
                )
            """)
    @Override
    @Options(useGeneratedKeys = true, keyProperty = "tiNo")
    int create(TourIntroDto tourIntroDto);

    /**
     * [3] 관광지 정보 수정
     *
     * @author OngTK
     */
    @Update("""
            UPDATE tourIntro
               SET accomcount        = #{accomcount},
                   chkBabyCarriage   = #{chkBabyCarriage},
                   chkCreditCard     = #{chkCreditCard},
                   chkPet            = #{chkPet},
                   expAgeRange       = #{expAgeRange},
                   expGuide          = #{expGuide},
                   heritage1         = #{heritage1},
                   heritage2         = #{heritage2},
                   heritage3         = #{heritage3},
                   infoCenter        = #{infoCenter},
                   openDate          = #{openDate},
                   parking           = #{parking},
                   restDate          = #{restDate},
                   useSeason         = #{useSeason},
                   useTime           = #{useTime}
             WHERE tiNo = #{tiNo}
            """)
    @Override
    boolean update(TourIntroDto tourIntroDto);

} // Interface end
