package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.FestivalIntroDto;
import ktour.model.mapper.FestivalIntroMapper;
import ktour.model.repository.CommonRepository;


/**
 * [ FestivalIntroService ]
 * <p>
 * 행사/축제/공연 상세정보 / ContentTypeID 15 / PK 3
 * @author OngTK
 */
@Service
@RequiredArgsConstructor
public class FestivalIntroService extends AbstractService<FestivalIntroDto, Integer, PlaceInfoCriteria> {

    private final FestivalIntroMapper festivalIntroMapper;

    @Override
    protected CommonRepository<FestivalIntroDto, Integer, PlaceInfoCriteria> repo() {
        return festivalIntroMapper;
    }

    /**
     * [ PR-01 ] 행사/축제/공연 상세정보 저장
     * <p>
     * FiNo에 다라서 C or U를 선택
     * @author OngTK
     */
    public boolean saveFestivalIntro(FestivalIntroDto dto){
        if(dto.getFiStatus() == 0){             // 변경없음

        } else if(dto.getFiStatus() == 1){      // Create
            festivalIntroMapper.create(dto);
            if(dto.getFiNo() > 0) {
                return true;
            } else {
                return false;
            }
        } else if(dto.getFiStatus() == 2) {      // Update
            return festivalIntroMapper.update(dto);
        }
        return false;
    } // func end


} // func end
