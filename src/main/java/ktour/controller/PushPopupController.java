package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.model.dto.PushPopupDto;
import ktour.service.PushPopupService;

@RestController
@RequestMapping("/push")
@RequiredArgsConstructor
public class PushPopupController {

    private final PushPopupService pushPopupService;

    /**
     * 1. 검색
     * [(place번호), (카테고리), (제목)]를 입력받아, 해당하는 푸시알림팝업을 조회한다.
     * @param ppUse
     * @param ppType
     * @param ppTitle
     * @param status
     * @return 검색결과
     * @author juju9595
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchPush(
            @RequestParam String ppUse,
            @RequestParam String ppType,
            @RequestParam String ppTitle,
            @RequestParam String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize){

        return ResponseEntity.ok(pushPopupService.searchPush(ppUse, ppType, ppTitle, status, page, pageSize));
    }

    /**
     * 2. 등록/ 파일등록
     *
     * @author juju9595
     */
    @PostMapping("/add")
    public ResponseEntity<?> addPush(  PushPopupDto pushPopupDto ,
                                       @CookieValue( value = "loginUser" , required = false ) String token ) {
        // 만약에 로그인 상태가 아니면 // **임시** 로 1번 회원으로 등록중
        if( token == null ){ pushPopupDto.setMgNo("1");  }
        System.out.println("pushPopupDto = " + pushPopupDto);
        int result = pushPopupService.addPush(pushPopupDto);
        return ResponseEntity.ok(result);
    }

    /**
     * 3. 삭제
     *
     * @author juju9595
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Boolean> deletePush(@RequestParam int ppNo){
        boolean result = pushPopupService.deletePush(ppNo);
        return ResponseEntity.ok(result);
    }

    /**
     * 4. 수정
     *
     * @author juju9595
     */
    @PutMapping("/update")
    public ResponseEntity<Boolean> updatePush(PushPopupDto dto){// 처음에 json RequestBody 로 받음 첨부파일이 있어 json 받기 어려움
        System.out.println("dto = " + dto);
        boolean result = pushPopupService.updatePush(dto);
        return ResponseEntity.ok(result);
    }


   /**
        * 🔍 플레이스번호로 검색
     * @param pNo 플레이스번호
     */
    @GetMapping("/searchPlace")
    public ResponseEntity<?> searchPushByPlace(@RequestParam String pNo) {
        System.out.println("검색된 플레이스번호: " + pNo);
        // 서비스에서 pNo 기반 검색 수행
        return ResponseEntity.ok(pushPopupService.findByPlaceNo(pNo));
    }


    @GetMapping("/banner")
    public ResponseEntity<?> bannerPush(){
        return ResponseEntity.ok(pushPopupService.bannerPush());
    }
}
