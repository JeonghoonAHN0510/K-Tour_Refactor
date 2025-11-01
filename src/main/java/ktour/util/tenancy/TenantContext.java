package ktour.util.tenancy;

public class TenantContext {
    // ThreadLocal 변수 생성 -> 각 요청은 각각의 스레드를 가지고, 각 스레드는 독립적인 저장공간을 가짐
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    /**
     * 현재 스레드의 테넌트ID를 저장(설정)하는 메소드
     * @param tenant 요청 URL의 서브도메인명
     * @author AhnJH
     */
    public static void setCurrentTenant(String tenant){
        System.out.println("TenantContext.setCurrentTenant");
        System.out.println("tenant = " + tenant);
        CURRENT_TENANT.set(tenant);
    } // func end

    /**
     * 현재 스레드의 테넌트ID를 반환하는 메소드
     * @return 테넌트ID
     * @author AhnJH
     */
    public static String getCurrentTenant(){
        System.out.println("TenantContext.getCurrentTenant");
        return CURRENT_TENANT.get();
    } // func end

    /**
     * 요청이 모두 완료된 후, 스레드를 비우는 메소드
     * <p>
     * 메모리 누수를 방지한다.
     * @author AhnJH
     */
    public static void clear(){
        System.out.println("TenantContext.clear");
        CURRENT_TENANT.remove();
    } // func end
} // class end