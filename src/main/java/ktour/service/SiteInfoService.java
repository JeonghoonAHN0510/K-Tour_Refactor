package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.SiteInfoCriteria;
import ktour.model.dto.SiteInfoDto;
import ktour.model.mapper.SiteInfoMapper;

import java.util.List;

/**
 * SiteInfo Table을 관리하는 Service
 * @author AhnJH
 */

@Service
@RequiredArgsConstructor
public class SiteInfoService {
    private final SiteInfoMapper siteInfoMapper;

    /**
     * 검색 기준을 통해 검색한 결과를 반환한다.
     * @param siteInfoCriteria 사이트 정보에 대한 검색 기준
     * @return 페이징처리된 검색 결과
     * @author AhnJH
     */
    public List<SiteInfoDto> searchSites(SiteInfoCriteria siteInfoCriteria){
        // 1. 검색기준을 Mapper에게 전달하여 검색결과 받기
        return siteInfoMapper.searchSites(siteInfoCriteria);
    } // func end
} // class end