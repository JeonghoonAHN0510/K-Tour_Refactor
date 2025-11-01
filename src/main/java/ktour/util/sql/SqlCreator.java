package ktour.util.sql;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Map;

/**
 * 각종 SQL을 자동으로 매핑하여 생성해주는 클래스
 * <p>
 * 추후 자동화를 하기위해 존재
 * @author AhnJH
 */

@Component
public class SqlCreator {
    @Value("${spring.datasource.driver-class-name}")
    private String DatasourceDriver;
    @Value("${spring.datasource.username}")
    private String Username;
    @Value("${spring.datasource.password}")
    private String Password;

    /**
     * 테넌트ID를 받아서 해당 ID의 DB가 없다면 생성한다.
     * <p>
     * 동적으로 생성까지 진행한다.
     * @param tenantID
     * @return DB 성공여부
     * @author AhnJH
     */
    public boolean createDataBase(String tenantID){
        System.out.println("SqlCreator.createDataBase");
        // 1. 기본으로 접속할 DB URL 선언
        String URL = "jdbc:mysql://localhost:3306/?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true";
        // 2. 동적으로 DB를 생성할 DDL 생성 - 안정성을 위해 utf8
        String createDynamicTable = "CREATE DATABASE IF NOT EXISTS " + tenantID;
        System.out.println("createDynamicTable = " + createDynamicTable);
        try {
            // 3. 기본 DB에 접속하기
            Connection conn = DriverManager.getConnection(URL, Username, Password);
            Statement st = conn.createStatement();
            Class.forName(DatasourceDriver);
            // 4. 동적으로 생성한 DDL 실행
            int executeCount = st.executeUpdate(createDynamicTable);
            if (executeCount == 1) {
                System.out.println(tenantID + "(이)라는 데이터베이스를 생성하였습니다.");
            } else if (executeCount == 0){
                System.out.println(tenantID + "(이)라는 데이터베이스가 이미 존재합니다.");
            } // if end
            // 5. 실행에 성공했으면, true 반환
            return true;
        } catch (Exception e) {
            System.err.println("데이터베이스 생성에 실패하였습니다.\n-> " + e.getMessage());
            return false;
        } // try-catch end
    } // func end

    /**
     * 테이블명과 컬럼명을 바탕으로, 자동으로 DDL을 생성하는 메소드
     * <p>
     * 모든 타입은 varchar(255)로 설정될 예정
     * @author AhnJH
     * @param tableName 생성할 테이블명
     * @param data Api로부터 받은 데이터 : 생성할 테이블의 컬럼명이 들어있음
     * @return 완성된 DDL SQL
     */
    public String createDynamicDdl(String tableName, Map<String, Object> data){
        // 0. data가 비어있으면, 메소드 종료
        if (data == null || data.isEmpty()) return null;
        // 1. DDL이 생성될 StringBuilder 객체 생성 : String보다 성능에 유리
        StringBuilder DDL = new StringBuilder();
        // 2. 같은 이름으로 table이 존재한다면, 생성하지 않는 구문 추가
        DDL.append("create table if not exists ").append(tableName).append("(\n");
        // 3. PK로 사용될 id 컬럼을 추가 - PK명 : tableName 맨 첫글자(소문자) + No
        // todo AhnJH PK명 논의 필요
        DDL.append(tableName.substring(0,1).toLowerCase()).append("No int auto_increment primary key,\n");
        // 4-1. Map을 순회하면서 컬럼 정의 - .ketSet() : Map의 모든 key를 Set으로 반환
        for (String entry : data.keySet()){
            // 4-2. 모든 타입은 varchar(255)로 정의
            DDL.append(entry).append(" ").append("varchar(255),\n");
        } // for end
        // 5. 마지막 컬럼에도 ,가 추가되었으므로 제거
        DDL.deleteCharAt(DDL.length() - 2);
        // 6. 최종적으로 DDL 괄호 닫기
        DDL.append(");");
        // 7. 만들어진 DDL 반환
        return DDL.toString();
    } // func end
} // class end