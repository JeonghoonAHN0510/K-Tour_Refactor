package ktour.model.criteria;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import ktour.util.search.BaseCriteria;

/**
 * [ PlaceInfoCriteria - 플레이스 검색 조건 ]
 *  @author OngTK
 *  @since 2025.10.17
 */

@Data
@Getter
@EqualsAndHashCode(callSuper = false)
public class PlaceInfoCriteria extends BaseCriteria {

    private Boolean showflag;       // 노출여부
    private Integer ctNo;           // 콘텐츠 타입번호
    private String ccName ;         // 분류체계번호
    private String ldName ;         // 법정동 코드번호
    private String address;         // 주소
    private String title;           // 콘텐츠명(제목)
    private Integer pNo;            // Place번호

} // func end
