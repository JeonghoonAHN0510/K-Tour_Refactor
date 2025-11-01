package ktour.util.pagenation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * [ Page - 페이지 처리 결과 ]
 *
 * @author OngTK
 * @since 2025.10.08
 */

@Data
@Builder
@AllArgsConstructor
public class Page<T> {
    // [1] 멤버변수
    private List<T> content;        // 현재 페이지의 DTO 데이터 list
    private int totalElements;      // DTO 총 개수
    private int currentPage;        // 현재 페이지 번호
    private int size;               // 한 페이지 당 게시물 수
    // [3] 메소드 - 총 페이지 수, 시작 버튼, 끝 버튼
    public long getTotalPages() {
        // 전체 페이지 수 구하기 -> 자료개수 % 페이지당 자료 개수 = 나머지가 있으면, 페이지 1개 추가
        return totalElements % size == 0 ? totalElements / size : (totalElements / size) + 1;
    } // func end
    public long getStartBtn(){
        return (long) ((currentPage - 1) / 5) * 5 + 1;
    } // func end
    public long getEndBtn(){
        return (long) ((currentPage - 1) / 5) * 5 + 5;
    } // func end
} // class end