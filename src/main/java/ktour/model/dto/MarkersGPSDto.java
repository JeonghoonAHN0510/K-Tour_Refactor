package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

/**
 * <p> 본사 DB의 MarkersGPS 테이블에 대한 클래스.
 * <p> MarkersGPS 테이블에 대한 접근을 지원합니다.
 * @author AhnJH
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkersGPSDto {
    // 기본적인 정보
    private int mkNo;               // 마커번호[PK]
    private int pNo;                // Place번호[FK]
    private String mkURL;           // 마커이미지경로
    private double mapx;            // GPS X좌표(#TourAPI 연동컬럼)
    private double mapy;            // GPS Y좌표(#TourAPI 연동컬럼)
    private String createdAt;       // 등록일(최초 DB복사일)
    private String updatedAt;       // 수정일(DB업데이트일/해당 레코드 수정일)
    // 부가적인 정보
    private File uploadedMk;        // 업로드된 마커 파일
    private String defaultMarker;   // 기본마커 이미지
    private double south;
    private double north;
    private double west;
    private double east;
    private Integer ctNo;
} // class end