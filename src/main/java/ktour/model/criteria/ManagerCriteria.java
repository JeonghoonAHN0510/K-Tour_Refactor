package ktour.model.criteria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Manager Table에 대한 검색을 위한 검색 조건
 *
 * @author AhnJH
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ManagerCriteria {
    private Integer mgAuth;         // 관리자유형 (0.시스템관리자/ 1.업체(지자체)관리자)
    private String mName;           // 회원명
    private String mId;             // 관리자ID == 회원ID
    private String mPhone;          // 휴대전화
    private int page;               // 조회할 페이지
    private int pageSize;           // 페이지당 개수
    private int startRow;           // 시작할 게시물
} // class end