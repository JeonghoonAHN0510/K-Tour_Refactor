package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SiteInfoDto
 * <p>
 * 구독한 회원의 사이트 정보를 관리
 * @author OngTK
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SiteInfoDto {
    // 기본적인 정보
    private int siNo;                   // 사이트번호[PK]
    private String siName;              // 사이트명
    private String siDomain;            // 도메인URL
    private String siIntro;             // 사이트소개글
    private String siLogo;              // 사이트로고이미지
    private String siFavicon;           // 파비콘이미지
    private String siMarker;            // 마커이미지
    private String siTel;               // 대표전화
    private String siPrivacyOfficer;    // 개인정보처리책임자
    private String siEmail;             // 대표이메일
    private String siKeywords;          // 사이트 검색키워드
    private int siIsPublic;             // 사이트 공개여부(0 : 비공개, 1 : 공개)
    private String createdAt;           // 생성일시
    private String updatedAt;           // 수정일시
    private String siMemo;              // 메모

    // 부가적인 정보
    private String mId;                 // 관리자 아이디
    private String mName;               // 관리자 이름
} // class end