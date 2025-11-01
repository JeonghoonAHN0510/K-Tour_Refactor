package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RestaurantIntro 음식점 소개정보
 * <p>
 * CotentTypeID : 39
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class RestaurantIntroDto {

    private int riNo;                   // 음식점 소개 번호[PK]
    private int pNo;                    // place 번호[FK]
    private String chkCreditCardFood;   // 신용카드 정보(#TourAPI 연동컬럼)
    private String discountInfoFood;    // 할인정보(#TourAPI 연동컬럼)
    private String firstMenu;           // 대표메뉴(#TourAPI 연동컬럼)
    private String infoCenterFood;      // 문의 및 안내(#TourAPI 연동컬럼)
    private int kidsFacility ;          // 어린이 놀이방 여부(#TourAPI 연동컬럼)
    private String lcnsNo;              // 인허가 번호(#TourAPI 연동컬럼)
    private String openDateFood;        // 개업일(#TourAPI 연동컬럼)
    private String openTimeFood;        // 영업시간(#TourAPI 연동컬럼)
    private String packing;             // 포장가능(#TourAPI 연동컬럼)
    private String parkingFood;         // 주차시설(#TourAPI 연동컬럼)
    private String reservationFood;     // 예약안내(#TourAPI 연동컬럼)
    private String restDateFood;        // 쉬는 날(#TourAPI 연동컬럼)
    private String scaleFood;           // 규모(#TourAPI 연동컬럼)
    private String seat;                // 좌석수(#TourAPI 연동컬럼)
    private String smoking;             // 금연/흡연여부(#TourAPI 연동컬럼)
    private String treatMenu;           // 취급메뉴(#TourAPI 연동컬럼)
    private String createdAt;           // 등록일(최초 DB복사일)
    private String updatedAt;           // 수정일(DB업데이트일/해당 레코드 수정일)

    // [추가]
    private int riStatus;               // 프론트에서 변경여부를 체크하기 위한 상태값 // 변경없음(0) C(1) U(2)

} // class end
