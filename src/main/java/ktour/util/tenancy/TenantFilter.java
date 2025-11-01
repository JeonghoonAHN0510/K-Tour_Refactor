package ktour.util.tenancy;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 주소에서 서브도메인명을 추출하여 테넌트에 저장한다.
 *
 * @author AhnJH
 */

@Component
@RequiredArgsConstructor
public class TenantFilter implements Filter {
    private final TenantResolver tenantResolver;

    /**
     * 요청이 Controller에 전달되기 전에 테넌트ID를 추출받아
     * <p>
     * 동적으로 DB를 사용하기 위한 필터
     *
     * @param request  The request to process
     * @param response The response associated with the request
     * @param chain    Provides access to the next filter in the chain for this filter to pass the request and response
     *                     to for further processing
     *
     * @throws IOException
     * @throws ServletException
     * @author AhnJH
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        System.out.println("TenantFilter.doFilter");
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        System.out.println("httpServletRequest = " + httpServletRequest);
        // 1. TenantResolver를 통해 요청 URL에서 서브도메인명 추출
        String tenant = tenantResolver.resolve(httpServletRequest);             // 예상 : k_tour_headquarter, goseong, incheon
        System.out.println("현재 tenantID = " + tenant);
        // 2. 추출한 서브도메인명을 현재 테넌트에 저장
        TenantContext.setCurrentTenant(tenant);
        try {
            // 3. 실제 요청처리를 위한 요청 전달
            chain.doFilter(request, response);
        } finally {
            // 4. 요청이 모두 완료된 후, 테넌트 비우기
            TenantContext.clear();
        } // try-finally end
    } // func end
} // class end