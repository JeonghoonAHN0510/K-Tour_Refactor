package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import ktour.model.dto.LDongCodeDto;

import java.util.List;
import java.util.Map;

/**
 * LDongCode Table을 관리하는 Mapper
 * @author AhnJH OngTK
 */

@Mapper
public interface LDongCodeMapper {

    /**
     * [LC-01] 시도 전체조회
     * <p>
     * LDongCode 테이블의 모든 시도 정보를 조회한다.
     *
     * @return LDongCode 테이블의 모든 시도 정보
     * @author AhnJH
     */
    @Select("SELECT DISTINCT ldongregncd, ldongregnnm FROM ldongcode")
    List<Map<String, Object>> getLDongRegn();

    /**
     * [LC-02] 시군구 리스트조회
     * <p>
     * [시도코드]를 입력받아, 해당하는 시도의 시군구 정보를 조회한다.
     *
     * @param lDongRegnCd
     * @return 해당하는 시도의 시군구 정보
     * @author AhnJH
     */
    @Select("SELECT ldNo, ldongsigngucd, ldongsigngunm " +
            "FROM ldongcode " +
            "WHERE lDongRegnCd = #{lDongRegnCd}")
    List<Map<String, Object>> getLDongSignguByRegnCd(int lDongRegnCd);

    /**
     * [LC-03] 시군구 개별조회
     * <p>
     * [법정동코드No]를 입력받아, 해당하는 시군구 정보를 조회한다.
     *
     * @param ldNo 조회할 법정동코드No
     * @return 법정동코드No에 해당하는 시군구 정보
     * @author AhnJH
     */
    @Select("SELECT * FROM ldongcode WHERE ldNo = #{ldNo}")
    LDongCodeDto getLDongCodeByldNo(int ldNo);

    /**
     * [LC-04] 시군구코드 전체 조회
     * @author OngTk
     */
    @Select("""
            select * from ldongcode;
            """)
    List<LDongCodeDto> getAllLDongCode();

    @Select("""
            select * from ldongcode 
            where ldongregnnm like CONCAT('%', #{lDongRegnNm}, '%') 
            and ldongsigngunm like CONCAT('%', #{lDongSignguNm}, '%') 
            limit 1;
            """)
    LDongCodeDto lookforLdNo(String lDongRegnNm, String lDongSignguNm);


} // interface end