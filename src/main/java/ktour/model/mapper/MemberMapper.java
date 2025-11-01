package ktour.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import ktour.model.criteria.MemberCriteria;
import ktour.model.dto.MemberDto;

import java.util.List;

@Mapper
public interface MemberMapper {

    /**
     * 검색기준을 통해 검색한 결과를 반환한다.
     * @param memberCriteria 회원정보 검색기준
     * @return 검색기준에 따른 검색결과
     */
    List<MemberDto> searchMembers(MemberCriteria memberCriteria);

}// interface end