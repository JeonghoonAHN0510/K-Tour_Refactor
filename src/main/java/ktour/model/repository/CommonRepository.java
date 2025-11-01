package ktour.model.repository;

import ktour.util.pagenation.Page;
import ktour.util.pagenation.PageRequest;
import ktour.util.search.BaseCriteria;

import java.util.List;
import java.util.Optional;

/**
 * CommonRepository
 * <p>
 * 반복 CRUD 메소드의 코드를 단축시키기 위한 공통 인터페이스
 * <p>
 *
 * @param <T>  Dto
 * @param <ID> PK
 * @param <C>  검색 관련 매개변수
 * @author OngTK
 * @since 2025.10.08
 */
public interface CommonRepository<T, ID, C extends BaseCriteria> {

    // CRUD ================================================================

    /**
     * [1] 생성
     *
     * @author OngTK
     */
    int create(T entity);

    /**
     * [2.1] 전체 조회 - 검색X, pageX
     *
     * @author OngTK
     */
    List<T> readAll();

    /**
     * [2.2] 개별 조회
     * <p>
     * Optional
     * <p>
     * null이 올 수 있는 값을 감싸는 Wrapper 클래스로,
     * 참조하더라도 NPE(NullPointerException)가 발생하지 않도록 도와줌
     *
     * @author OngTK
     */
    Optional<T> read(ID id);

    /**
     * [3] 수정
     *
     * @author OngTK
     */
    boolean update(T entity);

    /**
     * [4] 삭제
     *
     * @author OngTK
     */
    boolean delete(ID id);

    // Page · Search ================================================================

    /**
     * [5] 전체 조회 + 페이지 처리 (검색X)
     *
     * @param pageRequest 페이지 처리 요청 객체
     * @author OngTK
     */
    default Page<T> findPage(PageRequest pageRequest) {
        // [5.1] 조회 시, 전체 레코드 수를 반환하는 method
        int total = countAll();
        System.out.println("total : " +total);
        // [5.2] 페이지 처리 요청 객체를 매개변수로 해당 레코드를 가져오는 method
        List<T> content = findAllPaged(pageRequest);
        System.out.println("pageRequest = " + pageRequest);
        // Page<> 생성자를 이용한 페이지 결과 객체 반환
        return new Page<>(content, total, pageRequest.getPage(), pageRequest.getSize());
    } // func end

    /**
     * [5.1] 전체조회 레코드 수
     *
     * @author OngTK
     */
    int countAll();

    /**
     * [5.2] 페이지 처리 요청 후 해당 레코드만 List로 반환
     *
     * @author OngTK
     */
    List<T> findAllPaged(PageRequest pageRequest);

    /**
     * [6] 검색 + 페이지 처리
     *
     * @param criteria    검색 조건 객체
     * @param pageRequest 페이지 처리 요청 객체
     * @author OngTK
     */
    default Page<T> searchPage(C criteria, PageRequest pageRequest) {

        // [6.1] 검색 결과 총 레코드 수를 반환하는 method
        int total = countForSearch(criteria);

        int size = pageRequest.getLimit();         // == pageRequest.getSize()
        int totalPages = (total + size - 1) / size;

        if (total == 0) {
            return new Page<>(List.of(), 0, pageRequest.getPage(), size);
        }

        // 현재 page가 총 페이지 수를 초과하면 마지막 페이지로 보정
        int currPage = pageRequest.getPage();
        if (currPage > totalPages) {
            currPage = totalPages;
            pageRequest = new PageRequest(currPage, size); // offset/limit 재계산
        }


        // [6.2] 검색 + 페이지 처리 결과 레코드만 List로 반환하는 method
        List<T> content = searchPaged(criteria, pageRequest);
        // Page<> 생성자를 이용한 페이지 결과 객체 반환
        return new Page<>(content, total, currPage, size);
    } // func end

    /**
     * [6.1] 검색 결과 수
     *
     * @param criteria 검색 조건 객체
     * @author OngTK
     */
    int countForSearch(C criteria);

    /**
     * [6.2] 페이지 정보 검색
     *
     * @param pageRequest 페이지처리 요청 객체
     * @param criteria    검색 조건 객체
     * @author OngTK
     */
    List<T> searchPaged(C criteria, PageRequest pageRequest);

    /**
     * [7] 검색 O + 페이지 처리 X
     *
     * @param criteria 검색 조건 객체
     * @author OngTK
     */
    List<T> search(C criteria);

} // interFace end
