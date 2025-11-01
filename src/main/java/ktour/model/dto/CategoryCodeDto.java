package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 본사 DB의 CategoryCode 테이블에 대한 클래스.
 * <p> CategoryCode 테이블에 대한 접근을 지원합니다.
 * @author AhnJH
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCodeDto {
    // 기본적인 정보
    private int ccNo;               // 분류체계번호[PK]
    private int rnum;               // 일련번호(#TourAPI 연동컬럼)
    private String lclsSystm1Cd;    // 대분류코드(#TourAPI 연동컬럼) || 테이블 타입이 CHAR이기에 안전하게 String
    private String lclsSystm1Nm;    // 대분류명(#TourAPI 연동컬럼)
    private String lclsSystm2Cd;    // 중분류코드(#TourAPI 연동컬럼) || 테이블 타입이 CHAR이기에 안전하게 String
    private String lclsSystm2Nm;    // 중분류명(#TourAPI 연동컬럼)
    private String lclsSystm3Cd;    // 소분류코드(#TourAPI 연동컬럼) || 테이블 타입이 CHAR이기에 안전하게 String
    private String lclsSystm3Nm;    // 소분류명(#TourAPI 연동컬럼)
    private boolean isActivate;     // 활성화여부(FALSE:비노출, TRUE:노출) ※DB복사시 카테고리 코드를 갖는 다른 테이블/데이터 복사설정 : 본사는 모두 true 업체는 부분 true
    private String createdAt;       // 등록일(최초 DB복사일)
    private String updatedAt;       // 수정일(DB업데이트일/해당 레코드 수정일)
} // class end