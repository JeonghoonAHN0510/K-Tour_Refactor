package ktour.aop;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ktour.aop.annotation.NotNullParam;
import ktour.aop.annotation.PositiveParam;
import ktour.common.BusinessException;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

/**
 * 파라미터 검증 AOP
 * <p>
 * - @PositiveParam: 정수 파라미터가 0보다 큰지 확인
 * <p>
 * - @NotNullParam : 파라미터가 null이 아닌지 확인
 * <p>
 * 위반 시 BusinessException(460) 발생 → GlobalExceptionHandler가 표준 에러로 변환
 * <p>
 */
@Aspect
@Component
@Order(0) // 로깅보다 먼저 수행하여 빠르게 차단
@Log4j2
public class ValidationAspect {

    @Around("within(rootLab.controller..*)")
    public Object validateMethodArgs(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature ms = (MethodSignature) pjp.getSignature();
        Method method = ms.getMethod();
        Annotation[][] paramAnns = method.getParameterAnnotations();
        Object[] args = pjp.getArgs();
        String[] paramNames = ms.getParameterNames();

        for (int i = 0; i < paramAnns.length; i++) {
            Object arg = args[i];
            String name = (paramNames != null && i < paramNames.length) ? paramNames[i] : ("arg" + i);

            for (Annotation ann : paramAnns[i]) {
                if (ann.annotationType() == NotNullParam.class) {
                    if (arg == null) {
                        throw new BusinessException(460, "REQUIRED_PARAMETER", name + " must not be null");
                    }
                }
                if (ann.annotationType() == PositiveParam.class) {
                    if (arg == null) {
                        throw new BusinessException(460, "INVALID_PARAMETER", name + " must be positive (>0)");
                    }
                    if (arg instanceof Number num) {
                        long v = num.longValue();
                        if (v <= 0) {
                            throw new BusinessException(460, "INVALID_PARAMETER", name + " must be positive (>0)");
                        }
                    } else {
                        // 예상 타입이 아닌 경우에도 개발 편의를 위해 명시적 실패 처리
                        throw new BusinessException(460, "INVALID_PARAMETER", name + " must be a number");
                    }
                }
            }
        }
        return pjp.proceed();
    }
}

