package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 본사 DB의 PlaceInfo 테이블에 대한 클래스.
 * <p> PlaceInfo 테이블에 대한 접근을 지원합니다.
 * @author AhnJH
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceInfoDto {
    // 기본적인 정보
    private int pNo;                // Place번호[PK]
    private int ctNo;               // 콘텐츠 타입번호[FK]
    private int ldNo;               // 법정동 코드번호[FK]
    private int ccNo;               // 분류체계번호[FK]
    private boolean isEditable;     // 수정가능여부
    private int contentid;          // 콘텐츠 ID(#TourAPI 연동컬럼)
    private String title;           // 콘텐츠명/제목(#TourAPI 연동컬럼)
    private int showflag;           // 콘텐츠 표출여부(#TourAPI 연동컬럼)
    private String firstimage;      // 대표원본이미지(#TourAPI 연동컬럼)
    private String firstimage2;     // 대표썸네일이미지(#TourAPI 연동컬럼)
    private String addr1;           // 기본주소(#TourAPI 연동컬럼)
    private String addr2;           // 상세주소(#TourAPI 연동컬럼)
    private String zipcode;         // 우편번호(#TourAPI 연동컬럼)
    private String homepage;        // 홈페이지링크(#TourAPI 연동컬럼)
    private String tel;             // 전화(#TourAPI 연동컬럼)
    private String telname;         // 전화번호명(#TourAPI 연동컬럼)
    private String overview;        // 개요(#TourAPI 연동컬럼)
    private String createdAt;       // 등록일(최초 DB복사일)
    private String updatedAt;       // 수정일(DB업데이트일/해당 레코드 수정일)

    // 부가적인 정보
    private String lclsSystm1Nm;
    private String lclsSystm2Nm;
    private String lclsSystm3Nm;
    private String contentTypeName;


} // class end