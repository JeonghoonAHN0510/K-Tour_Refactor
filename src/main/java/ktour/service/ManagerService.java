package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.ManagerCriteria;
import ktour.model.dto.ManagerDto;
import ktour.model.mapper.ManagerMapper;

import java.util.List;

/**
 * Manager Table과 관련된 Service
 * @author AhnJH
 */

@Service
@RequiredArgsConstructor
public class ManagerService {
    private final ManagerMapper managerMapper;

    /**
     * 검색 기준을 통해 검색한 결과를 반환한다.
     * @param managerCriteria 관리자 정보에 대한 검색 기준
     * @return 페이징처리된 검색 결과
     * @author AhnJH
     */
    public List<ManagerDto> searchManagers(ManagerCriteria managerCriteria){
        return managerMapper.searchManagers(managerCriteria);
    } // func end
} // class end