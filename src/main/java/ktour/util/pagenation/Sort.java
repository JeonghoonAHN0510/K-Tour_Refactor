package ktour.util.pagenation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * [ Sort 정렬 정보 ]
 * <p>
 * 페이지네이션 중 sort에 관련한 class
 * <p>
 * SQL 인젝션 방지를 위해 orderBy의 검증필요
 *
 * @author OngTK
 * @since 2025.10.08
 */
@Data
@Builder
@AllArgsConstructor
public class Sort {
    // [1] 멤버변수
    private String orderBy;             // 정렬기준 // 예: "id", "created_at"
    private Direction direction;        // 정렬 방법

    public enum Direction {ASC, DESC}   // 정렬 방법을 ASC/DESC 으로 한정함.
} // class end
