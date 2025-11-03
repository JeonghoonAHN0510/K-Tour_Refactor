package ktour.aop;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.Map;

/**
 * [LoggingAspect]
 * <p>
 * Controller/Service 계층의 모든 메서드 호출에 대해 공통 로깅을 적용하는 Aspect입니다.
 * <p>
 * - START: 메서드 진입 시 클래스명.메서드명(요약된 인자) 출력
 * <p>
 * - END  : 정상 종료 시 실행 시간(ms)과 요약된 반환값 출력
 * <p>
 * - EXC  : 예외 발생 시 실행 시간(ms), 예외 타입/메시지 출력(예외는 재던짐)
 *
 * 로깅 원칙
 * <p>
 * - 성능/보안을 위해 대용량·바이너리(예: MultipartFile), 컬렉션/맵/배열은 크기/타입 중심으로 요약합니다.
 * <p>
 * - 문자열/일반 객체는 길이를 제한하여 과도한 로그를 방지합니다.
 * <p>
 * - 이 Aspect가 활성화되면 System.out.println 디버그 출력은 제거해도 운영 관점의 추적이 가능합니다.
 */
@Aspect
@Component
@Order(1) // 다른 Aspect와 함께 사용할 경우 우선순위 조정(낮을수록 먼저 실행)
@Log4j2
public class LoggingAspect {

    /**
     * Controller 레이어 포인트컷
     * rootLab.controller 패키지 및 하위 모든 클래스/메서드를 대상으로 지정합니다.
     */
    @Pointcut("within(rootLab.controller..*)")
    public void controllerLayer() {}

    /**
     * Service 레이어 포인트컷
     * rootLab.service 패키지 및 하위 모든 클래스/메서드를 대상으로 지정합니다.
     */
    @Pointcut("within(rootLab.service..*)")
    public void serviceLayer() {}

    /**
     * Around 어드바이스
     * - 실행 전: 메서드 식별자와 인자 요약을 기록
     * - 실행 후: 수행 시간(ms)과 반환값 요약을 기록
     * - 예외 시: 예외 타입/메시지를 기록하고 예외를 재던져 상위에서 처리되도록 보장
     */
    @Around("controllerLayer() || serviceLayer()")
    public Object logAround(ProceedingJoinPoint pjp) throws Throwable {
        String className = pjp.getSignature().getDeclaringTypeName();
        String methodName = pjp.getSignature().getName();
        String argsStr = formatArgs(pjp.getArgs());

        long start = System.currentTimeMillis();
        log.info("START {}.{}({})", className, methodName, argsStr);
        try {
            Object result = pjp.proceed();
            long took = System.currentTimeMillis() - start;
            log.info("END   {}.{} took={}ms return={}", className, methodName, took, summarizeResult(result));
            return result;
        } catch (Throwable ex) {
            long took = System.currentTimeMillis() - start;
            log.error("EXC   {}.{} took={}ms ex={} msg={}", className, methodName, took,
                    ex.getClass().getSimpleName(), ex.getMessage());
            throw ex;
        }
    }

    /**
     * 메서드 인자 요약 포맷터
     * - MultipartFile/Collection/Map/Array는 크기·타입 정보만, 일반 객체/문자열은 길이 제한
     */
    private String formatArgs(Object[] args) {
        if (args == null || args.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(safeToString(args[i]));
        }
        return truncate(sb.toString(), 500);
    }

    /**
     * 반환값 요약 포맷터
     * - ResponseEntity는 상태코드/바디를 별도로 요약, 그 외는 summarizeObject 규칙 사용
     */
    private String summarizeResult(Object result) {
        if (result == null) return "null";
        try {
            if (result instanceof ResponseEntity<?> resp) {
                Object body = resp.getBody();
                String status = String.valueOf(resp.getStatusCode());
                return "ResponseEntity(status=" + status + ", body=" + summarizeObject(body) + ")";
            }
            return summarizeObject(result);
        } catch (Throwable ignore) {
            return result.getClass().getSimpleName();
        }
    }

    /**
     * 공통 객체 요약 규칙
     * - MultipartFile: 파일명/사이즈
     * - Collection/Map: 타입/사이즈
     * - Array: 컴포넌트 타입/길이
     * - 일반 객체/문자열: 최대 300자
     */
    private String summarizeObject(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof MultipartFile f) {
            return "MultipartFile[name=" + f.getName() + ", size=" + f.getSize() + "]";
        }
        if (obj instanceof Collection<?> c) {
            return obj.getClass().getSimpleName() + "(size=" + c.size() + ")";
        }
        if (obj instanceof Map<?, ?> m) {
            return obj.getClass().getSimpleName() + "(size=" + m.size() + ")";
        }
        Class<?> cls = obj.getClass();
        if (cls.isArray()) {
            int len = java.lang.reflect.Array.getLength(obj);
            return cls.getComponentType().getSimpleName() + "[] (len=" + len + ")";
        }
        String s = String.valueOf(obj);
        return truncate(s, 300);
    }

    /**
     * 인자용 안전 문자열 변환(더 보수적 제한: 200자)
     * - 예외 발생 시에도 로깅 실패를 방지하기 위해 클래스명으로 대체
     */
    private String safeToString(Object obj) {
        if (obj == null) return "null";
        try {
            if (obj instanceof MultipartFile f) {
                return "MultipartFile[name=" + f.getName() + ", size=" + f.getSize() + "]";
            }
            if (obj instanceof Collection<?> c) {
                return obj.getClass().getSimpleName() + "(size=" + c.size() + ")";
            }
            if (obj instanceof Map<?, ?> m) {
                return obj.getClass().getSimpleName() + "(size=" + m.size() + ")";
            }
            Class<?> cls = obj.getClass();
            if (cls.isArray()) {
                int len = java.lang.reflect.Array.getLength(obj);
                return cls.getComponentType().getSimpleName() + "[] (len=" + len + ")";
            }
            String s = String.valueOf(obj);
            return truncate(s, 200);
        } catch (Throwable ignore) {
            return obj.getClass().getSimpleName();
        }
    }

    /**
     * 문자열 길이 제한 유틸리티(로그 폭주/민감정보 과다 노출 방지)
     */
    private String truncate(String s, int max) {
        if (s == null) return null;
        return (s.length() <= max) ? s : s.substring(0, max) + "...";
    }
}
