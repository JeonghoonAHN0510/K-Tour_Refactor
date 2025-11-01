package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.dto.LDongCodeDto;
import ktour.model.mapper.LDongCodeMapper;

import java.util.List;
import java.util.Map;

/**
 * LDongCode Table과 관련된 Service
 *
 * @author AhnJH OngTK
 */

@Service
@RequiredArgsConstructor
public class LDongCodeService {
    private final LDongCodeMapper lDongCodeMapper;

    /**
     * [LC-01] 시도 전체조회
     * <p>
     * LDongCode 테이블의 모든 시도 정보를 조회한다.
     *
     * @return LDongCode 테이블의 모든 시도 정보
     * @author AhnJH
     */
    public List<Map<String, Object>> getLDongRegn(){
        return lDongCodeMapper.getLDongRegn();
    } // func end

    /**
     * [LC-02] 시군구 리스트조회
     * <p>
     * [시도코드]를 입력받아, 해당하는 시도의 시군구 정보를 조회한다.
     *
     * @param lDongRegnCd
     * @return 해당하는 시도의 시군구 정보
     * @author AhnJH
     */
    public List<Map<String, Object>> getLDongSignguByRegnCd(int lDongRegnCd){
        return lDongCodeMapper.getLDongSignguByRegnCd(lDongRegnCd);
    } // func end

    /**
     * [LC-03] 시군구 개별조회
     * <p>
     * [법정동코드No]를 입력받아, 해당하는 시군구 정보를 조회한다.
     *
     * @param ldNo 조회할 법정동코드No
     * @return 법정동코드No에 해당하는 시군구 정보
     * @author AhnJH
     */
    public LDongCodeDto getLDongCodeByldNo(int ldNo){
        return lDongCodeMapper.getLDongCodeByldNo(ldNo);
    } // func end


    /**
     * [LC-04] 시군구코드 전체 조회
     * @author OngTk
     */
    public List<LDongCodeDto> getAllLDongCode(){ return lDongCodeMapper.getAllLDongCode(); } // func end

    /**
     * 행정구역명을 통한 ldNo 찾기
     * @author OngTK
     *
     */
    public LDongCodeDto lookforLdNo(String lDongRegnNm, String lDongSignguNm){return  lDongCodeMapper.lookforLdNo(lDongRegnNm, lDongSignguNm);}

} // class end