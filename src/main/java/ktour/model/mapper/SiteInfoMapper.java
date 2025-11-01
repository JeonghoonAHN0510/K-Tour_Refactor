package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import ktour.model.criteria.SiteInfoCriteria;
import ktour.model.dto.SiteInfoDto;

import java.util.List;

/**
 * SiteInfo Table을 관리하는 Mapper
 * @author AhnJH
 */

@Mapper
public interface SiteInfoMapper {
    /**
     * 검색기준을 통해 검색한 결과를 반환한다.
     * @param siteInfoCriteria 사이트정보 검색기준
     * @return 검색기준에 따른 검색결과
     * @author AhnJH
     */
    List<SiteInfoDto> searchSites(SiteInfoCriteria siteInfoCriteria);
} // interface end