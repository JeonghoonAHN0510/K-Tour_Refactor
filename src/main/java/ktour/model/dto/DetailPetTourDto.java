package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 본사 DB의 DetailPetTour 테이블에 대한 클래스.
 * <p> DetailPetTour 테이블에 대한 접근을 지원합니다.
 * @author AhnJH
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailPetTourDto {
    // 기본적인 정보
    private int dptNo;                  // 반려동물 동반여행번호[PK]
    private int pNo;                    // Place번호[FK]
    private String relaAcdntRiskMtr;    // 관련사고 대비사항(#TourAPI 연동컬럼)
    private String acmpyTypeCd;         // 동반유형코드(동반구분)(#TourAPI 연동컬럼)
    private String relaPosesFclty;      // 관련 구비시설(#TourAPI 연동컬럼)
    private String relaFrnshPrdlst;     // 관련 비치품목(#TourAPI 연동컬럼)
    private String etcAcmpyInfo;        // 기타 동반정보(#TourAPI 연동컬럼)
    private String relaPurcPrdlst;      // 관련 구매품목(#TourAPI 연동컬럼)
    private String acmpyPsblCpam;       // 동반가능 동물(#TourAPI 연동컬럼)
    private String relaRntlPrdlst;      // 관련 렌탈품목(#TourAPI 연동컬럼)
    private String acmpyNeedMtr;        // 동반시 필요사항(#TourAPI 연동컬럼)
    private String petTursmInfo;        // 반려동물 관광정보(#TourAPI 연동컬럼)
    private String createdAt;           // 등록일(최초 DB복사일)
    private String updatedAt;           // 수정일(DB업데이트일/해당 레코드 수정일)
} // class end