package ktour.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * <p>API를 자동으로 List<Map<String, Object>>로 매핑하기 위한 클래스
 * <p>
 * 차후 해당 값을 통해, table을 만들고, Insert도 진행할 예정
 *
 * @author AhnJH
 */

@Component  // 스프링 컨테이너에 빈 등록
@Log4j2     // 로그 처리를 위한 어노테이션 추가
public class ApiLoader {
    /**
     * 읽어올 Api의 URL을 받아서, 자동으로 Map으로 매핑하여 List로 반환합니다.
     *
     * @author AhnJH
     * @param Api_URL 읽어올 Api의 URL을 의미합니다.
     * @return 최종적으로 Map으로 매핑된 데이터의 List를 반환합니다.
     */
    public List<Map<String, Object>> LoadDataList(String Api_URL){
        try{
            // 1. 매개변수로 받은 URL을 담을 URL 객체 생성
            URL url = new URL(Api_URL);
            // 2. URL 객체를 통해 HTTP 연결을 열고, HttpURLConnection 객체 생성
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            // 3. HTTP 요청 방식 설정 - GET
            conn.setRequestMethod("GET");
            // 4. 요청 header 속성 설정 : json
            conn.setRequestProperty("Content-type", "application/json");
            // 5. 서버로부터 받고자 하는 데이터 형식 명시
            conn.setRequestProperty("Accept","application/json");
            System.out.println("Response code: " + conn.getResponseCode());
            // 6. 응답 데이터를 효율적으로 받기 위해서, BufferedReader 사용
            BufferedReader rd;
            // 7. HTTP 응답 코드가 200번대라면, 일반적으로 요청 성공을 의미
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                // 8-1. 통신에 성공했다면, 서버로부터 받은 응답스트림을 읽어오기 : InputStream
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                // 8-2. 실패했다면, 서버로부터 받은 에러스트림을 읽어오기 : ErrorStream
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            } // if end
            // 9. 응답 데이터를 만들 StringBuilder 객체 생성 : String보다 성능에 유리
            StringBuilder data = new StringBuilder();
            String line;
            // 10-1. BufferedReader로부터 한 줄씩 데이터를 읽어오기 : null이 아닐때까지
            while ((line = rd.readLine()) != null) {
                // 10-2. 한 줄씩 data에 추가
                data.append(line);
            } // while end
            // 11. 사용이 끝난 자원을 해제
            rd.close();             // 버퍼리더 종료
            conn.disconnect();      // URL 연결 종료
            // =======================List<Map<String, Object>>로 변경시작=======================
            // 12. Jackson 라이브러리를 이용하여 객체 만들기
            ObjectMapper objectMapper = new ObjectMapper();
            // 13. TypeReference를 사용하여 타입 명시
            Map<String, Object> resultMap = objectMapper.readValue(data.toString(), new TypeReference<Map<String, Object>>() {});
            // 14. Map을 탐색하여 원하는 데이터에 접근
            Map<String, Object> response = (Map<String, Object>) resultMap.get("response");
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            Map<String, Object> items = (Map<String, Object>) body.get("items");
            // 15. 최종 데이터를 리스트로 받기
            List<Map<String, Object>> itemList = (List<Map<String, Object>>) items.get("item");
            // 16. 최종적으로 반환하기
            return itemList;
        } catch (Exception e) {
            System.out.println("Api 로드 중 에러 발생 : " + e.getMessage());
            log.error(e);       // 예외가 발생했으므로, Log 출력
        } // try-catch end
        // 17. 로직 진행 중 오류가 발생하여 itemList를 반환하지 못했다면, null 반환
        return null;
    } // func end
} // class end