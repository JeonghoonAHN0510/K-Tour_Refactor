package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.PlaceInfoDto;
import ktour.model.repository.CommonRepository;
import ktour.util.pagenation.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * PlaceInfo Table을 관리하는 Mapper
 * @author AhnJH OngTK
 */

@Mapper
public interface PlaceInfoMapper extends CommonRepository<PlaceInfoDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] 생성
     * @author OngTK
     */
    @Override
    @Insert("""
            insert into placeinfo( ctNo, ldNo , ccNo , contentid ,
            title , showflag ,firstimage,firstimage2,addr1 , addr2,
            zipcode,homepage,tel,telname,overview)
            values
            ( #{ctNo}, #{ldNo}, #{ccNo}, #{contentid}, #{title},
            #{showflag}, #{firstimage}, #{firstimage2}, #{addr1}, #{addr2},
            #{zipcode}, #{homepage}, #{tel}, #{telname}, #{overview})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "pNo")
    int create(PlaceInfoDto placeInfoDto);

    /**
     * [2.1] 전체 조회 - 검색X, pageX
     * @author OngTK
     */
    @Override
    @Select("""
            select * from placeinfo where showflag = 1;
            """)
    List<PlaceInfoDto> readAll();

    /**
     * [2.2] 개별 조회
     * @author OngTK
     */
    @Override
    @Select("""
            SELECT kpi.*, kcc.lclsSystm1Nm, kcc.lclsSystm2Nm, kcc.lclsSystm3Nm
                FROM placeinfo kpi
                JOIN categorycode kcc
                USING (ccNo)
               WHERE kpi.pno = #{pno}
                 AND kpi.showflag = 1;
            """)
    Optional<PlaceInfoDto> read(Integer pno);

    @Update("""
            update placeinfo set showflag = 0 where pno= #{pno};
            """)
    @Override
    boolean delete(Integer pno);

    /**
     * [4] 수정
     */
    @Update("""
        UPDATE placeInfo
           SET ctNo=#{ctNo}, ldNo=#{ldNo}, ccNo=#{ccNo}, isEditable=#{isEditable},
               contentid=#{contentid}, title=#{title}, showflag=#{showflag},
               addr1=#{addr1}, addr2=#{addr2}, zipcode=#{zipcode}, homepage=#{homepage},
               tel=#{tel}, telname=#{telname}, overview=#{overview}
         WHERE pNo=#{pNo}
    """)
    boolean update(PlaceInfoDto dto);

    // Page · Search ================================================================

    /**
     * [3.1] 전체조회 레코드 수
     * @author OngTK
     */
    @Override
    @Select("""
            select count(*) from placeinfo where showflag = 1;
            """)
    int countAll();

    /**
     * [3.2] 페이지 처리 요청
     */
    @Override
    List<PlaceInfoDto> findAllPaged(@Param("pageRequest") PageRequest pageRequest);

    /**
     * [3.3] 검색결과 레코드를 반환
     */
    @Override
    int countForSearch(@Param("criteria") PlaceInfoCriteria criteria);

    /**
     * [3.4] 페이지에 해당하는 레코드를 List로 반환
     */
    @Override
    List<PlaceInfoDto> searchPaged(@Param("criteria") PlaceInfoCriteria criteria,
                                   @Param("pageRequest") PageRequest pageRequest);

    /**
     * [PI-07] 플레이스 검색(by사용자)
     * <p>
     * [키워드, 사용자위치]를 입력받아, 해당하는 플레이스 정보들을 조회한다.
     *
     * @param keyword 검색한 키워드
     * @param lat 사용자 위치 기준 위도
     * @param lng 사용자 위치 기준 경도
     * @return 키워드에 의한 검색 결과
     * @author AhnJH
     */
    List<Map<String, Object>> searchPlacesByUsers(String keyword, double lat, double lng);
} // class end
