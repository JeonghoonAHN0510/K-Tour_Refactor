package ktour.advice;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import ktour.common.ApiError;
import ktour.common.BusinessException;

import java.time.OffsetDateTime;

/**
 * 전역 예외 처리기
 * <p>
 * - 컨트롤러 전역에서 발생하는 예외를 표준 포맷(ApiError)으로 응답
 * <p>
 * - 비즈니스 예외(BusinessException)는 예외에 포함된 상태코드로 반환(예: 460)
 * <p>
 * - 그 외 공통 예외는 400/415/500 등으로 매핑
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@Log4j2
public class GlobalExceptionHandler {

    // 비즈니스 예외: 커스텀 상태 코드 사용 가능(예: 460)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusiness(BusinessException ex, HttpServletRequest req) {
        log.warn("[비즈니스 예외] BusinessException: {} - {}", ex.getError(), ex.getMessage());
        ApiError body = ApiError.builder()
                .timestamp(OffsetDateTime.now())
                .status(ex.getStatus())
                .error(ex.getError())
                .message(ex.getMessage())
                .path(getPath(req))
                .build();
        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    // 바인딩/검증 실패(스프링 바인딩)
    @ExceptionHandler({ BindException.class, MethodArgumentNotValidException.class })
    public ResponseEntity<ApiError> handleBind(Exception ex, HttpServletRequest req) {
        String message = ex.getMessage();
        ApiError body = error(400, "[바인딩/검증 실패] BINDING_ERROR", message, getPath(req));
        return ResponseEntity.status(400).body(body);
    }

    // 요청 파라미터 누락
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest req) {
        String message = String.format("[요청 파라미터 누락] Missing request parameter: %s", ex.getParameterName());
        ApiError body = error(400, "MISSING_PARAMETER", message, getPath(req));
        return ResponseEntity.status(400).body(body);
    }

    // 타입 불일치
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        String message = String.format("[타입 불일치] Parameter '%s' type mismatch", ex.getName());
        ApiError body = error(400, "TYPE_MISMATCH", message, getPath(req));
        return ResponseEntity.status(400).body(body);
    }

    // JSON 파싱/본문 누락
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleNotReadable(HttpMessageNotReadableException ex, HttpServletRequest req) {
        ApiError body = error(400, "[JSON 파싱/본문 누락] MESSAGE_NOT_READABLE", "Malformed JSON or request body missing", getPath(req));
        return ResponseEntity.status(400).body(body);
    }

    // 미지원 미디어 타입
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleMediaType(HttpMediaTypeNotSupportedException ex, HttpServletRequest req) {
        ApiError body = error(415, "[미지원 미디어 타입] UNSUPPORTED_MEDIA_TYPE", ex.getMessage(), getPath(req));
        return ResponseEntity.status(415).body(body);
    }

    // 알 수 없는 예외 → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnknown(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception", ex);
        ApiError body = error(500, "[알 수 없는 예외] INTERNAL_SERVER_ERROR", "Unexpected server error", getPath(req));
        return ResponseEntity.status(500).body(body);
    }

    private ApiError error(int status, String error, String message, String path) {
        return ApiError.builder()
                .timestamp(OffsetDateTime.now())
                .status(status)
                .error(error)
                .message(message)
                .path(path)
                .build();
    }

    private String getPath(HttpServletRequest req) {
        return (req != null) ? req.getRequestURI() : null;
    }
}

