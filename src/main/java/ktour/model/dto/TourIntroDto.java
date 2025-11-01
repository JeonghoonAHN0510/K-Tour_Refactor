package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TourIntro 관광지 소개정보
 * <p>
 * CotentTypeID : 12
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TourIntroDto {

    private int tiNo;               // 관광지 소개번호[PK]
    private int pNo;                // place 번호[FK]
    private String accomcount;      // 수용인원(#TourAPI 연동컬럼)
    private String chkBabyCarriage; // 유모차 대여 정보(#TourAPI 연동컬럼)
    private String chkCreditCard;   // 신용카드 가능정보(#TourAPI 연동컬럼)
    private String chkPet;          // 애완동물 동반 가능 정보(#TourAPI 연동컬럼)
    private String expAgeRange;     // 체험가능연령(#TourAPI 연동컬럼)
    private String expGuide;        // 체험안내(#TourAPI 연동컬럼)
    private String heritage1;       // 세계문화유산 유무1(#TourAPI 연동컬럼)
    private String heritage2;       // 세계문화유산 유무2(#TourAPI 연동컬럼)
    private String heritage3;       // 세계문화유산 유무3(#TourAPI 연동컬럼)
    private String infoCenter;      // 문의 및 안내(#TourAPI 연동컬럼)
    private String openDate;        // 개장일(#TourAPI 연동컬럼)
    private String parking;         // 주차시설(#TourAPI 연동컬럼)
    private String restDate;        // 쉬는날(#TourAPI 연동컬럼)
    private String useSeason;       // 이용시기(#TourAPI 연동컬럼)
    private String useTime;         // 이용시간(#TourAPI 연동컬럼)
    private String createdAt;       // 등록일(최초 DB복사일)
    private String updatedAt;       // 수정일(DB업데이트일/해당 레코드 수정일)

    // [추가]
    private int tiStatus;            // 프론트에서 변경여부를 체크하기 위한 상태값 // 변경없음(0) C(1) U(2)

} // class end
