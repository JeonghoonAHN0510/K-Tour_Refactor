package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ktour.model.criteria.ManagerCriteria;
import ktour.service.ManagerService;

/**
 * Manager Table과 관련된 Controller
 * @author AhnJH
 */

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
public class ManagerController {
    private final ManagerService managerService;

    /**
     * [MG-01] 관리자정보 검색
     * [(관리자유형), (회원명), (관리자ID), (휴대전화)]를 입력받아, 해당하는 관리자정보들을 조회한다.
     *
     * @param mgAuth   관리자유형 (1:시스템관리자, 2:지자체관리자)
     * @param mName    회원명
     * @param mId      관리자ID == 회원ID
     * @param mPhone   휴대전화
     * @return 검색결과
     * @author AhnJH
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchManagers(@RequestParam(required = false) Integer mgAuth,
                                            @RequestParam(required = false) String mName,
                                            @RequestParam(required = false) String mId,
                                            @RequestParam(required = false) String mPhone){
        // 1. 입력받은 매개변수를 통해 검색기준 구성하기
        ManagerCriteria managerCriteria = new ManagerCriteria();
        if (mgAuth != null) managerCriteria.setMgAuth(mgAuth);
        if (mName != null) managerCriteria.setMName(mName);
        if (mId != null) managerCriteria.setMId(mId);
        if (mPhone != null) managerCriteria.setMPhone(mPhone);
        // 2. Service로부터 결과를 받아 반환하기
        return ResponseEntity.ok(managerService.searchManagers(managerCriteria));
    } // func end
} // class end