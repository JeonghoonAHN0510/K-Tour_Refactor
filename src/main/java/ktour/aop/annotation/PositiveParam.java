package ktour.aop.annotation;

import java.lang.annotation.*;

/**
 * 파라미터가 양수(>0)임을 요구하는 애노테이션.
 * - int/Integer/long/Long 등 정수형에 사용 권장
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PositiveParam {}

