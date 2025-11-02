package ktour.util.tenancy;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class TenantResolver {
    /**
     * 요청 URL에서 서브도메인명을 추출해주는 메소드
     * @param request
     * @return 서브도메인명
     * @author AhnJH
     */
    public String resolve(HttpServletRequest request){
        System.out.println("TenantResolver.resolve");
        // 1. request로부터 요청 URL 받아오기
        String origin = request.getHeader("Origin");          // 예상 : http://localhost:5173, http://goseong.localhost:5173
        System.out.println("origin = " + origin);
        String host = request.getHeader("Host").split(":")[0];
        if (origin != null){
            host = origin.split(":")[1].split("/")[2];
        } // if end
        System.out.println("host = " + host);
        // 2. 요청 URL이 없다면,
        if (host == null) return "k_tour_headquarter";  // 본사 DB명 반환
        // 3. 요청 URL에서 서브도메인명 추출하기
        String subDomain = host.split("\\.")[0];        // 예상 : localhost, goseong, incheon
        // 4. 추출한 서브도메인명 반환하기
        return subDomain.toLowerCase().equals("localhost") ? "k_tour_headquarter" : subDomain.toLowerCase();
    } // func end
} // class end