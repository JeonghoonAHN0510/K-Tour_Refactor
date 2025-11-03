# 멀티테넌시(Multi-Tenancy) 구현

---

### 🔀 '마이그레이션' 흐름

사용자가 `goseong`이라는 새로운 테넌트가 가입(`signup`)했을 때, 다음 작업을 수행하는 흐름입니다.

1.  `goseong`이라는 **새로운 빈 데이터베이스를 생성**합니다. (`SqlCreator.java`)
2.  `goseong` DB 안에 **필요한 모든 테이블을 생성**합니다. (`syncService.syncAllTable()`)
3.  `goseong` DB에 **초기 기본 데이터(공통 코드 등)를 복사**합니다. (`syncService.syncInsert()`)

---

## 1. 🔄 예시 코드 분석: 멀티테넌시 DB 연결 흐름 (요청 처리)

사용자가 `http://goseong.localhost:8080/siteinfo/search` (사이트 검색)를 요청할 때, `goseong` DB에 동적으로 연결되는 전체 흐름입니다.


**1. 요청 가로채기 (Filter)**
* `TenantFilter.java`가 모든 HTTP 요청(`HttpServletRequest`)을 컨트롤러가 받기 전에 가로챕니다.

**2. 테넌트 ID 추출 (Resolver)**
* `TenantFilter`가 `TenantResolver.java`의 `resolve()` 메소드를 호출합니다.
* `TenantResolver`는 요청 헤더의 `Origin` 또는 `Host` 값(예: `http://goseong.localhost:8080`)을 가져옵니다.
* 문자열을 분석하여 서브도메인인 **"goseong"**을 추출합니다.
* (만약 `localhost`라면 "k_tour_headquarter"를 반환합니다.)

**3. 테넌트 ID 저장 (Context)**
* `TenantFilter`가 `TenantContext.java`의 `setCurrentTenant("goseong")`을 호출합니다.
* `TenantContext`는 `ThreadLocal` 변수에 "goseong" 문자열을 저장합니다.
    * **핵심:** `ThreadLocal`은 현재 요청을 처리하는 **스레드(Thread)에만** 데이터가 종속되도록 보장합니다. 동시에 "incheon" 요청이 들어와도 스레드가 다르므로 데이터가 섞이지 않습니다.

**4. 요청 처리 (Controller → Service → Mapper)**
* `TenantFilter`가 `chain.doFilter()`를 호출하여 실제 요청(`SiteInfoController` -> `SiteInfoService` -> `SiteInfoMapper`)을 실행합니다.
* `SiteInfoMapper` (MyBatis)가 DB에 SQL을 실행하기 위해 Spring에게 '데이터소스(DB 커넥션)'를 요청합니다.

**5. DB 연결 라우팅 (DataSource)**
* Spring은 설정 파일(`DataSourceConfig.java`)에 정의된 `DynamicRoutingDataSource` Bean에게 "어떤 DB에 연결할지" 물어봅니다.

**6. 라우팅 키 조회**
* `DynamicRoutingDataSource.java`의 `determineCurrentLookupKey()` 메소드가 자동으로 호출됩니다.
* 이 메소드는 `TenantContext.getCurrentTenant()`를 호출하여 `ThreadLocal`에 저장된 **"goseong"**을 반환합니다.

**7. 실제 DB 커넥션 결정 (Config)**
* `DataSourceConfig.java`의 `determineTargetDataSource()` (오버라이드된 메소드)가 "goseong" 키를 받습니다.
* 이 메소드는 `cache` (Map)에 "goseong"을 위한 `DataSource`가 있는지 확인합니다.
    * **캐시에 없음 (최초 1회):** `createTenantDataSource("goseong")`를 호출합니다. 이 메소드는 `jdbc:mysql://localhost:3306/goseong` URL로 접속하는 새 `DataSource` 객체를 생성하여 캐시에 저장하고 반환합니다.
    * **캐시에 있음 (이후 모든 요청):** 캐시에서 "goseong"용 `DataSource`를 즉시 반환합니다.

**8. SQL 실행**
* `SiteInfoMapper`는 `goseong` DB에 연결된 `DataSource`를 통해 `searchSites` 쿼리를 실행합니다.

**9. 자원 정리 (Filter)**
* 컨트롤러가 응답(`ResponseEntity`)을 반환하고 요청 처리가 완전히 끝나면, `TenantFilter`의 `finally` 블록이 실행됩니다.
* `TenantContext.clear()`가 호출되어 `ThreadLocal`에서 "goseong" 데이터를 삭제합니다.
    * **중요:** 이 과정을 거치지 않으면, 스레드 풀(Thread Pool)에 의해 해당 스레드가 재사용될 때 이전에 사용한 "goseong" 정보가 남아 메모리 누수나 데이터 오염을 일으킬 수 있습니다.

---

## 2. 🚀 코드 분석: 신규 테넌트 DB 생성 흐름 (회원가입)

사용자가 `http://goseong.localhost:8080/siteinfo/signup` (신규 가입)을 요청할 때의 흐름입니다.

**1. 테넌트 ID 식별 (1~3단계 동일)**
* `TenantFilter` -> `TenantResolver` -> `TenantContext` 흐름을 통해 `ThreadLocal`에 "goseong"이 저장됩니다.

**2. 컨트롤러 실행**
* `SiteInfoController.java`의 `signup()` 메소드가 실행됩니다.

**3. DB 생성 (SqlCreator)**
* 컨트롤러가 `TenantContext.getCurrentTenant()`를 호출해 "goseong"을 가져옵니다.
* `SqlCreator.java`의 `createDataBase("goseong")`을 호출합니다.
* **중요:** `SqlCreator`는 `DynamicRoutingDataSource`를 사용하지 않습니다. 대신 `DriverManager`를 사용해 **기본 MySQL 서버(`jdbc:mysql://localhost:3306/`)**에 직접 접속합니다.
* `CREATE DATABASE IF NOT EXISTS goseong` DDL을 실행하여 `goseong`이라는 빈 데이터베이스를 생성합니다.

**4. 테이블 동기화 (SyncService)**
* 컨트롤러가 `syncService.syncAllTable()`을 호출합니다.
* `SyncService` 내부에서는 `goseong` DB에 필요한 모든 `CREATE TABLE` DDL을 실행할 것입니다.
* 이때 `SyncService`가 DB에 접속하면, **'흐름 3'의 5~7단계**가 동작합니다. `DynamicRoutingDataSource`가 `ThreadLocal`의 "goseong"을 읽어 `goseong` DB로 연결해주기 때문에, 새로 생성된 빈 DB에 테이블이 생성됩니다.

**5. 데이터 복사 (SyncService)**
* 컨트롤러가 `syncService.syncInsert()`를 호출합니다.
* `SyncService`는 먼저 `k_tour_headquarter` DB (본사)에서 기본 데이터를 `SELECT`한 후, `goseong` DB에 `INSERT`하여 초기 데이터를 복사(시딩)합니다.

**6. 완료 응답**
* DB 생성 및 동기화가 성공하면, 컨트롤러는 "서브도메인 가입 완료 : goseong" 메시지를 반환합니다.

---

## 3. 🗂️ 주요 파일별 역할 요약

| 파일명 | 주요 역할                                                       |
| --- |---------------------------------------------------------------------|
| `TenantFilter.java` | 모든 HTTP 요청을 가로채서 `TenantContext`를 설정하고 정리합니다.                       |
| `TenantResolver.java` | 요청 URL(Host/Origin 헤더)을 분석하여 서브도메인(테넌트 ID)을 추출합니다.                  |
| `TenantContext.java` | `ThreadLocal`을 사용해 현재 요청 스레드에 테넌트 ID를 안전하게 저장합니다.                   |
| `DynamicRoutingDataSource.java` | Spring에게 '라우팅 키'(테넌트 ID)가 무엇인지 알려주는 역할을 합니다.                        |
| `DataSourceConfig.java` | '라우팅 키'를 받아 실제 DB 커넥션(DataSource)을 동적으로 생성하고 캐싱합니다.                 |
| `SqlCreator.java` | 라우팅과 관계없이, MySQL 서버에 직접 접속하여 `CREATE DATABASE` DDL을 실행합니다. |
| `SiteInfoController.java` | `/signup` 요청을 받아 DB 생성 및 동기화 흐름을 지시합니다.   |
| `SiteInfoService.java` | 일반적인 로직을 수행하며, 자신이 어떤 DB에 연결되는지는 알지 못합니다.             |