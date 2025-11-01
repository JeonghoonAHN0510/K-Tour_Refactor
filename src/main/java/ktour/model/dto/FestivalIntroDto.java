package ktour.model.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * festivalIntro 축제 소개정보
 * <p>
 * CotentTypeID : 15
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class FestivalIntroDto {

    private int fiNo;                       // 축제 행사 번호[PK]
    private int pNo;                        // place 번호[FK]
    private String eventStartDate;          // 행사시작일(#TourAPI 연동컬럼)
    private String eventEndDate;            // 행사 종료일(#TourAPI 연동컬럼)
    private String progressType;            // 진행 상태 정보(#TourAPI 연동컬럼)
    private String festivalType;            // 축제유형별(#TourAPI 연동컬럼)
    private String ageLimit;                // 관람가능연령(#TourAPI 연동컬럼)
    private String bookingPlace;            // 예매처(#TourAPI 연동컬럼)
    private String discountInfoFestival;    // 할인정보(#TourAPI 연동컬럼)
    private String eventHomepage;           // 홈페이지정보(#TourAPI 연동컬럼)
    private String eventPlace;              // 행사장소(#TourAPI 연동컬럼)
    private String festivalGrade;           // 축제 등급(#TourAPI 연동컬럼)
    private String placeInfo;               // 행사장 위치 안내(#TourAPI 연동컬럼)
    private String playTime;                // 공연시간(#TourAPI 연동컬럼)
    private String program;                 // 행사 프로그램(#TourAPI 연동컬럼)
    private String spendTimeFestival;       // 관람 소요시간(#TourAPI 연동컬럼)
    private String sponsor1;                // 주최자정보(#TourAPI 연동컬럼)
    private String sponsor1Tel;             // 주최자연락처(#TourAPI 연동컬럼)
    private String sponsor2;                // 주관사정보(#TourAPI 연동컬럼)
    private String sponsor2Tel;             // 주관사연락처(#TourAPI 연동컬럼)
    private String subEvent;                // 부대행사(#TourAPI 연동컬럼)
    private String useTimeFestival;         // 이용요금(#TourAPI 연동컬럼)
    private String createdAt;               // 등록일(최초 DB복사일)
    private String updatedAt;               // 수정일(DB업데이트일/해당 레코드 수정일)

    // [추가]
    private int fiStatus;                   // 프론트에서 변경여부를 체크하기 위한 상태값 // 변경없음(0) C(1) U(2)

} // class end
