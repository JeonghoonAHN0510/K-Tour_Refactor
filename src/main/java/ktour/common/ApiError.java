package ktour.common;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

/**
 * 공통 에러 응답 바디
 */
@Data
@Builder
public class ApiError {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime timestamp;       // 오류 발생 시간(클라이언트/서버 간 추적용)
    private int status;                     // HTTP 상태 코드(비표준 코드 포함 가능: 예, 460)
    private String error;                   // 오류 식별 키워드 또는 간략 사유
    private String message;                 // 오류 상세 메시지(사용자/개발자 확인용)
    private String path;                    // 요청 URI
}

