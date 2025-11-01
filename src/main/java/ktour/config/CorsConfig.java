package ktour.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS를 관리하기 위한 클래스
 * <p>
 * 리액트 서버를 5174까지 허용
 * * @author AhnJH
 */

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                .allowedMethods("*")
                .allowCredentials(true)
                .allowedHeaders("*");
    } // func end
} // class end