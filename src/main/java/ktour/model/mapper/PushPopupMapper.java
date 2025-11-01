package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.dto.PushPopupDto;

import java.util.List;

@Mapper
public interface PushPopupMapper {

    /**
     * 1. 검색
     * @author juju9595
     */
    List<PushPopupDto> searchPush(
            @Param("ppUse") String ppUse,
            @Param("ppType") String ppType,
            @Param("ppTitle") String ppTitle,
            @Param("status") String status // 진행전, 진행중, 진행완료
    );

    /**
     * 2. 등록
     * @author juju95
     */
    @Insert("""
    INSERT INTO pushPopup
    (pNo, mgNo, ppTitle, ppContent, ppUse, ppType, ppStart, ppEnd, ppIterated)
    VALUES
    (#{pNo}, #{mgNo}, #{ppTitle}, #{ppContent},
    #{ppUse}, #{ppType}, #{ppStart}, #{ppEnd}, #{ppIterated})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "ppNo") // AUTO_INCREMENT ppNo 주입
    int addPush(PushPopupDto pushPopupDto);


    /**
     * 3. 삭제
     * @author juju9595
     */
    int deletePush (@Param("ppNo") int ppNo);

    /**
     * 4. 수정
     * @author juju9595
     */
    int updatePush(PushPopupDto dto);

    /**
     * 5. 첨부파일명 등록/수정
     * @author juju95
     */
    @Update("""
    UPDATE pushPopup
    SET ppImg = #{ppImg}
    WHERE ppNo = #{ppNo}
    """)
    int updatePushImg(PushPopupDto pushPopupDto);

    /**
     * 6.
     * @author juju95
     */
    @Select("""
    SELECT title FROM placeinfo
    WHERE pNo = #{pNo}
    """)
    String findByPlaceNo(String pNo);

    /**
     * 7. 배너 출력
     * @author juju95
     */
    List<PushPopupDto> bannerPush();

    /**
     * 8. 배너 출력
     * @author juju95
     */
    @Update("""
            UPDATE pushPopup SET ppImg = #{ppImg}
            WHERE ppNo = #{ppNo}
            """)
    int updatePpImg(int ppNo, String ppImg);

}
