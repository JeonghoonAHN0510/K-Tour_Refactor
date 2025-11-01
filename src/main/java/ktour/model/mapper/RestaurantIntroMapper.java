package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.RestaurantIntroDto;
import ktour.model.repository.CommonRepository;

import java.util.Optional;

/**
 * [ RestaurantIntroMapper ]
 * <p>
 * 음식점 상세정보 / ContentTypeID 39 / ctNo 8
 *
 * @author OngTK
 */
@Mapper
public interface RestaurantIntroMapper extends CommonRepository<RestaurantIntroDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] pno별 음식점 정보 조회
     *
     * @author OngTK
     */
    @Override
    @Select("""
            select * from RestaurantIntro where pno = #{pno};
            """)
    Optional<RestaurantIntroDto> read(Integer pno);

    /**
     * [2] 음식점 정보 생성
     * @author OngTK
     */
    @Insert("""
             INSERT INTO restaurantIntro (
                    pNo,
                    chkCreditCardFood,
                    discountInfoFood,
                    firstMenu,
                    infoCenterFood,
                    kidsFacility,
                    lcnsNo,
                    openDateFood,
                    openTimeFood,
                    packing,
                    parkingFood,
                    reservationFood,
                    restDateFood,
                    scaleFood,
                    seat,
                    smoking,
                    treatMenu
                ) VALUES (
                    #{pNo},
                    #{chkCreditCardFood},
                    #{discountInfoFood},
                    #{firstMenu},
                    #{infoCenterFood},
                    #{kidsFacility},
                    #{lcnsNo},
                    #{openDateFood},
                    #{openTimeFood},
                    #{packing},
                    #{parkingFood},
                    #{reservationFood},
                    #{restDateFood},
                    #{scaleFood},
                    #{seat},
                    #{smoking},
                    #{treatMenu}
                )
            """)
    @Override
    @Options(useGeneratedKeys = true,  keyProperty = "riNo")
    int create(RestaurantIntroDto restaurantIntroDto);

    /**
     * [3] 음식점 정보 업데이트
     * @author OngTK
     */
    @Update("""
                UPDATE restaurantIntro
                            SET chkCreditCardFood = #{chkCreditCardFood},
                                discountInfoFood  = #{discountInfoFood},
                                firstMenu         = #{firstMenu},
                                infoCenterFood    = #{infoCenterFood},
                                kidsFacility      = #{kidsFacility},
                                lcnsNo            = #{lcnsNo},
                                openDateFood      = #{openDateFood},
                                openTimeFood      = #{openTimeFood},
                                packing           = #{packing},
                                parkingFood       = #{parkingFood},
                                reservationFood   = #{reservationFood},
                                restDateFood      = #{restDateFood},
                                scaleFood         = #{scaleFood},
                                seat              = #{seat},
                                smoking           = #{smoking},
                                treatMenu         = #{treatMenu}
                          WHERE riNo = #{riNo}
            """)
    @Override
    boolean update(RestaurantIntroDto restaurantIntroDto);

} // func end
