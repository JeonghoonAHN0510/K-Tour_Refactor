package ktour.common;

/**
 * 비즈니스 규칙 위반 등 도메인 레벨의 예외를 나타내는 런타임 예외.
 * <p>
 * - status: HTTP 상태 코드(예: 460 등 비표준 코드 포함 가능)
 *  <p>
 * - error : 오류 식별 키워드
 *  <p>
 * - message: 상세 메시지
 */
public class BusinessException extends RuntimeException {

    private final int status;
    private final String error;

    public BusinessException(int status, String message) {
        super(message);
        this.status = status;
        this.error = "BUSINESS_ERROR";
    }

    public BusinessException(int status, String error, String message) {
        super(message);
        this.status = status;
        this.error = error;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
}

