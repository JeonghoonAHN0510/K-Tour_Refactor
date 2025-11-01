package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 본사 DB의 IdongCode 테이블에 대한 클래스.
 * <p> IdongCode 테이블에 대한 접근을 지원합니다.
 * @author AhnJH
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LDongCodeDto {
    // 기본적인 정보
    private int ldNo;               // 법정동 코드번호[PK]
    private int rnum;               // 일련번호(#TourAPI 연동컬럼)
    private String lDongRegnCd;     // 시도코드(#TourAPI 연동컬럼) *36110 : 세종특별자치시 || 테이블 타입이 CHAR이기에 안전하게 String
    private String lDongRegnNm;     // 시도명(#TourAPI 연동컬럼)
    private String lDongSignguCd;   // 시군구코드(#TourAPI 연동컬럼) || 테이블 타입이 CHAR이기에 안전하게 String
    private String lDongSignguNm;   // 시군구명(#TourAPI 연동컬럼)
    private boolean isActivate;     // 활성화여부(false:비노출, true:노출) ※DB복사시 법정동 코드를 갖는 다른 테이블/데이터 복사설정 : 본사는 모두 true 업체는 부분 true
    private double mapy;            // 중심지역위도(시/군/구청 기준 지역중심 좌표)
    private double mapx;            // 중심지역경도(시/군/구청 기준 지역중심 좌표)
    private String createdAt;       // 등록일(최초 DB복사일)
    private String updatedAt;       // 수정일(DB업데이트일/해당 레코드 수정일)
} // class end