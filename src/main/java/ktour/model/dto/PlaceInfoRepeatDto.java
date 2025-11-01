package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PlaceInfoRepeat Place 반복정보
 * <p>
 * CotentTypeID : 12, 14, 15, 28, 38, 39
 * <p>
 * 25,32의 경우 이 DTO를 사용하지 않음
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PlaceInfoRepeatDto {

    private int pirNo;          // place 반복 번호[PK]
    private int pNo;            // place 번호[FK]
    private int fldgubun;       // 구분일련번호(#TourAPI 연동컬럼)
    private String infoName;    // 제목(#TourAPI 연동컬럼)
    private String infoText;    // 내용(#TourAPI 연동컬럼)
    private int serialNum;      // 반복일련번호(#TourAPI 연동컬럼)
    private String createdAt;   // 등록일(최초 DB복사일)
    private String updatedAt;   // 수정일(DB업데이트일/해당 레코드 수정일)

    // [추가]
    private int pirStatus;      // front에서 전달 시, 변경없음(0) C(1) U(2) D(3) 상태 정보를 담기 위해서

} // class end
