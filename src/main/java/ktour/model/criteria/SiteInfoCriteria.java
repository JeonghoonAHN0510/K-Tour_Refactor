package ktour.model.criteria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SiteInfo Table에 대한 검색을 위한 검색 조건
 *
 * @author AhnJH
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SiteInfoCriteria {
    private Integer siIsPublic;     // 사이트 공개여부, null 여부 판단을 위해 int가 아닌 Integer
    private String siDomain;        // 도메인 URL
    private String siName;          // 사이트명
    private int page;               // 조회할 페이지
    private int pageSize;           // 페이지당 개수
    private int startRow;           // 시작할 게시물
} // class end