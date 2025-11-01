package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ktour.model.criteria.SiteInfoCriteria;
import ktour.service.SiteInfoService;

/**
 * SiteInfo Table을 관리하는 Controller
 * @author AhnJH
 */

@RestController
@RequestMapping("/siteinfo")
@RequiredArgsConstructor
public class SiteInfoController {
    private final SiteInfoService siteInfoService;

    /**
     * [SI-01] 사이트정보 검색
     * [(공개여부), (도메인), (사이트명)]을 입력받아, 해당하는 사이트정보들을 조회한다.
     *
     * @param siIsPublic 사이트 공개여부, null 여부 판단을 위해 Integer
     * @param siDomain 도메인 URL
     * @param siName 사이트명
     * @return 검색결과
     * @author AhnJH
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchSites(@RequestParam(required = false) Integer siIsPublic,
                                         @RequestParam(required = false) String siDomain,
                                         @RequestParam(required = false) String siName){
        // 1. 입력받은 매개변수를 통해 검색기준 구성하기
        SiteInfoCriteria siteInfoCriteria = new SiteInfoCriteria();
        if (siIsPublic != null) siteInfoCriteria.setSiIsPublic(siIsPublic);
        if (siDomain != null) siteInfoCriteria.setSiDomain(siDomain);
        if (siName != null) siteInfoCriteria.setSiName(siName);
        return ResponseEntity.ok(siteInfoService.searchSites(siteInfoCriteria));
    } // func end
} // class end