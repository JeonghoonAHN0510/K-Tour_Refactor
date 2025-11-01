package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.MemberCriteria;
import ktour.model.dto.*;
import ktour.model.mapper.MemberMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper memberMapper;
    /**
     * 검색 기준을 통해 검색한 결과를 반환한다.
     * @param MemberCriteria 회원 정보에 대한 검색 기준
     * @return 페이징처리된 검색 결과
     * @author KimJS
     */
    public List<MemberDto> searchMembers(MemberCriteria MemberCriteria){
        // 1. 검색기준을 Mapper에게 전달하여 검색결과 받기
        return memberMapper.searchMembers(MemberCriteria);
    } // func end

}//class end