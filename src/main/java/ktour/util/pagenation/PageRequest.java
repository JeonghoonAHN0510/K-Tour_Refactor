package ktour.util.pagenation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * [ PageRequest - 페이지 처리 요청 ]
 * <p>
 * 페이지네이션을 위한 요청 class
 *
 * @author OngTK
 * @since 2025.10.08
 */

@Data
@Builder
@AllArgsConstructor
public class PageRequest {

    // [1] 멤버변수
    private int page;       // page : 1부터 시작
    private int size;       // size : 페이지 크기
    private Sort sort;      // sort : 정렬 (nullable)

    // [2] 생성자
    // sort 가 null 일 경우
    public PageRequest(int page, int size) {
        this(page, size, null);
    }

    // [3.1] 메소드 - SQL OFFSET 계산
    // 앞에서부터 몇 개의 행을 건너뛸지
    // MyBatis는 필드가 없어도 getter 메소드가 있으면 이를 'property'로 인식
    // method getOffset() -> property offset
    public int getOffset() {
        return (page - 1) * size;
    } // func end

    // [3.2] 메소드 - SQL LIMIT 값
    // 한 번에 가져올 행(Row)의 수
    public int getLimit() {
        return size;
    } // func end

} // class end
