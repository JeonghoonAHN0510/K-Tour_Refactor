package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ktour.model.criteria.MemberCriteria;
import ktour.service.MemberService;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    
    private final MemberService memberService;
    /** [M-01] 회원정보 검색
     * [(회원유형), (회원명), (회원ID), (휴대전화)]를 입력받아, 해당하는 회원정보들을 조회한다.
     * @param page     조회하려는 현재 페이지
     * @param pageSize     한 페이지 당 노출되는 콘텐츠 수
     * @param mType    회원유형/권한 (0.관리자회원/ 1.일반회원/ 2.사업자/ 3.단체,모임)
     * @param mName    회원명
     * @param mId      회원ID
     * @param mPhone   휴대전화
     * @return 검색결과 */
    @GetMapping("/search")
    public ResponseEntity<?> searchMembers(@RequestParam(required = false) Integer mType,
                                           @RequestParam(required = false) String mName,
                                           @RequestParam(required = false) String mId,
                                           @RequestParam(required = false) String mPhone,
                                           @RequestParam(defaultValue = "1") int page,
                                           @RequestParam(defaultValue = "0") int pageSize){
        // 1. 입력받은 매개변수를 통해 검색기준 구성하기
        MemberCriteria memberCriteria = new MemberCriteria();
        if (mType != null) memberCriteria.setMType(mType);
        if (mName != null) memberCriteria.setMName(mName);
        if (mId != null) memberCriteria.setMId(mId);
        if (mPhone != null) memberCriteria.setMPhone(mPhone);
//        memberCriteria.setPage(page);
//        memberCriteria.setPageSize(pageSize);
//        memberCriteria.setStartRow((page - 1) * pageSize);
        // 2. Service로부터 결과를 받아 반환하기
        return ResponseEntity.ok(memberService.searchMembers(memberCriteria));
    } // func end
    
}//class end
