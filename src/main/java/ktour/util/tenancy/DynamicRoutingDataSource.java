package ktour.util.tenancy;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class DynamicRoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        // 1. DB에 연결하기 전에 해당 메소드를 통해 현재 테넌트ID를 반환
        return TenantContext.getCurrentTenant();        // 예상 : goseong, incheon
    } // func end
} // class end