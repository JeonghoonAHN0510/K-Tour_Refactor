package ktour.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 본사 DB의 member(회원정보) 테이블에 대한 클래스.
 * <p> member 테이블에 대한 접근을 지원합니다.
 * @author KimJS
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    // 기본적인 정보
    private int mgNo;                   // 회원번호[PK], 기존 매니저 번호 유지(나중에 회원번호 mNo)로 변경하기로 함.
    private int siNo;                   // 사이트번호[FK]
    private String mId;                 // 아이디
    private String mPwd;                // 비밀번호
    private String mName;               // 이름
    private String mNick;               // 닉네임
    private String mGender;             // 성별('남','여')
    private String mPhone;              // 전화번호
    private String mEmail;              // 이메일
    private String zipCode;             // 우편번호
    private String mAddr1;              // 도로명주소
    private String mAddr2;              // 상세주소
    private String createdAt;           // 가입일
    private String updatedAt;           // 수정일
    private String deletedAt;           // 탈퇴일
    private boolean mTermsAgreed;       // 이용약관 동의
    private boolean mLocationAgreed;    // 위치정보 동의
    private boolean mPushAgreed;        // 푸시알림 동의
    private String memo;                // 이슈/메모
    private int mType;                  // 회원유형/권한 (0.관리자회원/ 1.일반회원/ 2.사업자/ 3.단체,모임)
    private int mgAuth;                 // 관리자유형/권한 (0. 시스템관리자, 1. 업체(지자체) 관리자 )

    // 부가적인 정보
    private String siName;              // 사이트명
    private String siDomain;            // 도메인주소(URL)

}// class end
