package ktour.config;

import ktour.util.tenancy.DynamicRoutingDataSource;
import ktour.util.tenancy.TenantContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class DataSourceConfig {
    @Value("${spring.datasource.driver-class-name}")
    private String defaultDatasourceDriver;
    @Value("${spring.datasource.username}")
    private String defaultUsername;
    @Value("${spring.datasource.password}")
    private String defaultPassword;
    @Value("${spring.datasource.url}")
    private String defaultUrl;

    // DataSource 객체를 재사용하기위한 캐시 선언
    private final Map<String, DataSource> cache = new ConcurrentHashMap<>();

    @Bean
    public DataSource DataSource(){
        System.out.println("DataSourceConfig.DataSource");
        //
        DynamicRoutingDataSource dynamicRoutingDataSource = new DynamicRoutingDataSource(){
            @Override
            protected DataSource determineTargetDataSource() {
                System.out.println("DataSourceConfig.determineTargetDataSource");
                // 1. ThreadLocal에 저장된 현재 테넌트ID 가져오기
                String tenantID = TenantContext.getCurrentTenant();
                System.out.println("tenantID = " + tenantID);
                if (tenantID == null || tenantID.equals("k_tour_headquarter") || tenantID.equals("localhost")){
                    // 2. 테넌트ID가 null이거나 "k_tour_headquarter"면, 본사 DB 사용
                    return connectDataSource(defaultUrl);
                } // if end
                // 3. 캐시에 현재 테넌트ID를 담당하는 DataSource가 있는지 확인하고, 있으면 즉시 반환
                // 없다면(computeIfAbsent), 두번째 매개변수로 전달된 createTenantDataSource를 통해 새로운 DataSource 생성
                return cache.computeIfAbsent(tenantID, this::createTenantDataSource);
            } // func end

            protected DataSource createTenantDataSource(String tenantID){
                System.out.println("DataSourceConfig.createTenantDataSource");
                // 4. 현재 테넌트ID를 이용해 동적으로 DB 연결 URL 생성
                String URL = "jdbc:mysql://localhost:3306/" + tenantID + "?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true";
                System.out.println("URL = " + URL);
                // 5. 최종 DataSource 객체를 생성하여 반환
                return connectDataSource(URL);
            } // func end
        }; // 생성자 end
        // 6. dynamicRoutingDataSource 초기화 진행
        dynamicRoutingDataSource.setTargetDataSources(new HashMap<>());
        // 7. 본사 DB 설정
        dynamicRoutingDataSource.setDefaultTargetDataSource(connectDataSource(defaultUrl));
        // 8. 설정이 완료된 DataSource 반환
        return dynamicRoutingDataSource;
    } // func end

    /**
     * 매개변수로 받은 URL로 DB를 연결한다.
     * @param URL 연결할 URL
     * @return DataSource
     * @author AhnJH
     */
    private DataSource connectDataSource(String URL){
        System.out.println("DataSourceConfig.connectDataSource");
        System.out.println(URL + "에 연결");
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(defaultDatasourceDriver);
        dataSource.setUrl(URL);
        dataSource.setUsername(defaultUsername);
        dataSource.setPassword(defaultPassword);
        return dataSource;
    } // func end
} // class end