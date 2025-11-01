package ktour.model.criteria;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import ktour.util.search.BaseCriteria;

/**
 * [ MemberCriteria - 회원정보 검색 조건 ]
 *  @author KimJS
 *  @since 2025.10.28
 */

@Data
@Getter
@EqualsAndHashCode(callSuper = false)
public class MemberCriteria extends BaseCriteria {
    private Integer mType;          // 회원유형 (0.관리자회원/ 1.일반회원/ 2.사업자회원/ 3.단체/모임회원)
    private String mName;           // 회원명
    private String mId;             // 회원ID
    private String mPhone;          // 휴대전화
    private int page;               // 조회할 페이지
    private int pageSize;           // 페이지당 개수
    private int startRow;           // 시작할 게시물
}// class end
