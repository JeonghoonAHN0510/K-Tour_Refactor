# RootLab2 공통 AOP/예외/검증 정리 문서

본 문서는 RootLab2 코드베이스에 단계적으로 적용한 공통 기능(1단계 로깅 AOP, 2단계 전역 예외 표준화, 3단계 파라미터 검증 AOP)과 그에 따라 컨트롤러의 중복 if-검증을 축소한 작업 내용을 정리합니다.

## 0. 요약

- 1단계(Log AOP): Controller/Service 전역 진입·종료·예외·실행시간 로그 표준화
- 2단계(Global Error): `BusinessException` + `GlobalExceptionHandler`로 표준 에러 바디 응답
- 3단계(Validation AOP): 파라미터 애노테이션(`@NotNullParam`, `@PositiveParam`) 기반 공통 검증
- 중복 if 축소: 컨트롤러 곳곳의 null/양수 수동 검증을 애노테이션 기반으로 대체(선 적용 범위 중심)

의존성: `spring-boot-starter-aop` 추가 (Gradle)

---

## 1. 공통 로깅 AOP (1단계)

- 파일: `src/main/java/rootLab/aop/LoggingAspect.java`
- 포인트컷: `within(rootLab.controller..*) || within(rootLab.service..*)`
- 동작:
  - START: 클래스.메서드(요약된 인자)
  - END: 실행시간(ms) + 요약된 반환값
  - EXC: 예외 타입/메시지 + 실행시간
- 민감/대용량 데이터 요약 규칙
  - `MultipartFile`: 파일명/크기만
  - `Collection/Map/Array`: 타입/크기만
  - 문자열/일반 객체: 최대 300~500자 제한
- 비고: 로그는 SLF4J(Logback) 라우팅, println 제거 대체 목적

예시 로그

```
INFO  START PlaceInfoController.searchPlaces(page=1, size=10, ...)
INFO  END   PlaceInfoController.searchPlaces took=42ms return=Page(...)
WARN  EXC   TourIntroService.saveTourIntro took=3ms ex=BusinessException msg=...
```

Gradle 의존성

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-aop'
}
```

---

## 2. 전역 예외 표준화 (2단계)

- 파일
  - `src/main/java/rootLab/common/BusinessException.java`
  - `src/main/java/rootLab/common/ApiError.java`
  - `src/main/java/rootLab/advice/GlobalExceptionHandler.java`
- 설계
  - 비즈니스 오류는 `BusinessException(status, error, message)`로 표현
  - 전역 예외 핸들러가 표준 바디(`ApiError`)로 변환하여 반환
    - 필드: `timestamp`, `status`, `error`, `message`, `path`
- 매핑 요약
  - `BusinessException` → 예외의 `status`(예: 460)
  - 바인딩/검증 실패 → 400
  - 미디어 타입 불일치 → 415
  - 기타 미처리 예외 → 500

에러 응답 예시

```json
{
  "timestamp": "2025-10-30T23:02:12.345+09:00",
  "status": 460,
  "error": "INVALID_PARAMETER",
  "message": "pNo must be positive (>0)",
  "path": "/placeinfo/festivalintro"
}
```

컨트롤러/서비스 사용 예시

```java
if (someRuleViolated) {
    throw new BusinessException(460, "INVALID_RULE", "설명 메시지");
}
```

---

## 3. 파라미터 검증 AOP (3단계)

- 파일
  - `src/main/java/rootLab/aop/annotation/NotNullParam.java`
  - `src/main/java/rootLab/aop/annotation/PositiveParam.java`
  - `src/main/java/rootLab/aop/ValidationAspect.java`
- 포인트컷: `within(rootLab.controller..*)` (컨트롤러 계층)
- 검증 규칙
  - `@NotNullParam`: null이면 `BusinessException(460, REQUIRED_PARAMETER)`
  - `@PositiveParam`: 0 이하/숫자 아님이면 `BusinessException(460, INVALID_PARAMETER)`
- 우선순위: `@Order(0)`로 로깅보다 먼저 수행 → 빠른 차단

컨트롤러 적용 예시(시그니처)

```java
// DTO null 방지
public ResponseEntity<?> saveFestivalIntro(@RequestBody @NotNullParam FestivalIntroDto dto)

// PK 양수 보장
public ResponseEntity<?> readFestivalIntro(@RequestParam @PositiveParam int pNo)

// 혼합 사용 (nullable + 양수)
public ResponseEntity<?> updateTourIntro(@RequestParam @NotNullParam @PositiveParam Integer pNo)
```

---

## 4. 컨트롤러의 수동 if-검증 축소(선 적용)

다음 엔드포인트에 애노테이션을 부착하여 공통 검증으로 이관했습니다. 일부 기존 if-검증은 동작에 영향이 없어 남겨두었고, 점진 제거 가능합니다.

- FestivalIntroController
  - `POST /placeinfo/festivalintro` → `@RequestBody @NotNullParam`
  - `GET  /placeinfo/festivalintro` → `@RequestParam @PositiveParam`
- RestaurantIntroController
  - `POST /placeinfo/restaurant` → `@RequestBody @NotNullParam`
  - `GET  /placeinfo/restaurant` → `@RequestParam @PositiveParam`
- TourIntroController
  - `POST /placeinfo/tourIntro` → `@RequestBody @NotNullParam`
  - `GET  /placeinfo/tourIntro` → `@RequestParam @NotNullParam @PositiveParam`
- PlaceInfoRepeatController
  - `POST /placeinfo/repeatinfo` → `@RequestBody @NotNullParam` (list null if 제거)
  - `GET  /placeinfo/repeatinfo` → `@RequestParam @PositiveParam` (pno==0 if 제거)
- PlaceInfoController
  - `DELETE /placeinfo/basic` → `@RequestParam @PositiveParam`

중첩 필드 값에 대한 검증(예: `placeInfo.getPNo() > 0`)은 파라미터 애노테이션만으로는 커버되지 않으므로, Bean Validation(아래 5번)으로 DTO 필드 수준 검증을 추가하는 것을 권장합니다.

---

## 5. 권장 후속 작업

1) Bean Validation 확장(선호)

- 의존성: `org.springframework.boot:spring-boot-starter-validation`
- DTO 필드에 `@NotNull`, `@Positive` 등을 선언하고 컨트롤러에서 `@Valid` 적용
- 전역 예외 처리기에 의해 400 응답으로 표준 처리

2) 페이지/검색 파라미터 표준화

- `HandlerMethodArgumentResolver`로 `PageRequest` 자동 생성
- Criteria는 `@ModelAttribute` 바인딩 또는 공통 바인더 유틸 도입

3) 수동 if 제거의 범위 확대

- 현재 애노테이션만 부착하고 남아있는 if-검증은 기능에 영향이 없으므로, 커밋 단위/리스크 기준으로 점진 제거

---

## 6. 참고(변경 파일 요약)

- AOP
  - `aop/LoggingAspect.java`
  - `aop/ValidationAspect.java`
  - `aop/annotation/NotNullParam.java`
  - `aop/annotation/PositiveParam.java`
- 전역 예외
  - `common/BusinessException.java`
  - `common/ApiError.java`
  - `advice/GlobalExceptionHandler.java`
- 빌드 설정
  - `build.gradle` → `spring-boot-starter-aop` 추가
- 컨트롤러(선 적용)
  - `controller/FestivalIntroController.java`
  - `controller/RestaurantIntroController.java`
  - `controller/TourIntroController.java`
  - `controller/PlaceInfoRepeatController.java`
  - `controller/PlaceInfoController.java` (DELETE /basic)

---

## 7. 운영 체크리스트

- 로그 레벨/패턴: 운영 환경에서 INFO/WARN 수준 확인
- 예외 메시지: 외부 노출 적정성 점검(민감 데이터 포함 금지)
- 점진적 제거 계획: 남아있는 수동 if-검증 목록 관리 및 제거 일정 수립
