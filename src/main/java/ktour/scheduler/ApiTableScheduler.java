package ktour.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import ktour.api.ApiLoader;
import ktour.model.repository.ApiDataRepository;
import ktour.model.mapper.ApiMapper;
import ktour.util.sql.SqlCreator;

import java.util.List;
import java.util.Map;

/**
 * API TABLE을 자동으로 생성 및 INSERT 하는 클래스
 * <p>
 * API 복구가 된다면, 추후 자동화 예정
 * @author AhnJH
 */

@Component  // 스프링 컨테이너에 빈 등록
@Log4j2     // 로그 처리를 위한 어노테이션 추가
@RequiredArgsConstructor    // final에 대한 생성자 자동 생성(DI)
public class ApiTableScheduler {
    private final ApiLoader apiLoader;
    private final SqlCreator sqlCreator;
    private final ApiDataRepository apiDataRepository;
    private final ApiMapper apiMapper;

    // 테스트용 임시 URL
    // String Api_URL = "https://api.kcisa.kr/openapi/API_TOU_053/request?serviceKey=b9fed429-846a-415e-92b4-573a5fed9b99&numOfRows=10&pageNo=1";
    // https://openapi.gg.go.kr/TBGGPHSTRNFACLTM?KEY=340560330e6f4b248da835feb7dceea9&type=json


    /**
     * 스케줄링을 통해 자동으로 테이블을 생성하고,
     * <p>
     * 그에 해당하는 데이터를 Insert해주는 메소드
     * @author AhnJH
     */
    // @Scheduled(cron = "* * 4 * * *")
    public void createTableAndData(){
        try{
            // 1. Api URL로부터 데이터를 Map 형식으로 받아오기
            List<Map<String, Object>> dataList = apiLoader.LoadDataList("https://api.kcisa.kr/openapi/API_TOU_053/request?serviceKey=b9fed429-846a-415e-92b4-573a5fed9b99&numOfRows=10&pageNo=1");
            // todo AhnJH 데이터로부터 자동으로 테이블명을 얻을 방법 생각
            String tableName = "API_TOU_053";
            // 2. 데이터를 통해 DDL 만들기
            String DDL = sqlCreator.createDynamicDdl(tableName, dataList.get(0));
            // 3. DDL 실행하기
            apiDataRepository.executeDdl(DDL);
            // 4. 해당 데이터를 생성된 테이블에 삽입하기
            // todo AhnJH insertAll로 변경 요망
            dataList.forEach( (data) -> {
                if (apiMapper.dynamicInsert(tableName, data) == 1){
                    log.info("데이터 삽입이 성공적으로 진행중입니다.");
                } else {
                    log.error("데이터 삽입 중 오류가 발생하였습니다.");
                } // if end
            });
            log.info("데이터 삽입이 성공적으로 완료되었습니다.");
        } catch (Exception e){
            log.error("Api 스케줄링 중 오류가 발생하였습니다.");
        } // try-catch end
    } // func end
} // class end