package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * PUSH 와 배너 정보
 * <p>
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PushPopupDto {

    private int ppNo;           // 푸시팝업 NO[PK]
    private Integer pNo;            // place 번호[FK]
    private String mgNo;        // 작성자-관리자no[FK]
    private String ppTitle;     // 제목
    private String ppContent;   // 내용
    private String ppImg;       // 이미지
    private String ppUse;       // 사용구분(1.푸시알림+팝업 / 2.푸시알림 / 3.팝업)
    private String ppType;      // 카테고리(1.공지 / 2.이벤트)
    private String createdAt;   // 작성일
    private String updateAt;    // 수정일
    private String ppStart;     // 노출 시작일
    private String ppEnd;       // 노출 종료일
    private String ppIterated;  // 푸시알림 시간(*09~20시 사이 분단위)
    private MultipartFile file; // 첨부파일

} // class end
