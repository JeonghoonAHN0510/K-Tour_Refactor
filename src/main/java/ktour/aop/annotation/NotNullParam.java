package ktour.aop.annotation;

import java.lang.annotation.*;

/**
 * 파라미터가 null이 아님을 요구하는 애노테이션.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface NotNullParam {}

