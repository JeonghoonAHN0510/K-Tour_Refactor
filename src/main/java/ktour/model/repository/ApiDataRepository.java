package ktour.model.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * API 데이터와 관련된 Repository
 *
 * @author AhnJH
 */

@Log4j2
@Repository
@RequiredArgsConstructor
public class ApiDataRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Api로부터 받은 데이터를 기반으로 생성된 DDL을 받아 테이블을 생성한다.
     * @author AhnJH
     * @param ddl 생성된 DDL
     */
    public void executeDdl(String ddl){
        try{
            // 1. 매개변수로 받은 DDL을 실행한다.
            jdbcTemplate.execute(ddl);
            // 2. 실행에 성공했으면 로그처리를 한다.
            log.info("테이블이 성공적으로 생성되었습니다.");
        } catch(Exception e){
            // 3. 예외가 발생했다면, 로그처리를 한다.
            log.error("테이블 생성 중 오류가 발생하였습니다. {}", e.getMessage());
        } // try-catch end
    } // func end
} // class end