package ktour.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.RestaurantIntroDto;
import ktour.model.mapper.RestaurantIntroMapper;
import ktour.model.repository.CommonRepository;

@Service
@AllArgsConstructor
public class RestaurantIntroService extends AbstractService<RestaurantIntroDto, Integer, PlaceInfoCriteria>  {

    private final RestaurantIntroMapper restaurantIntroMapper;

    @Override
    protected CommonRepository<RestaurantIntroDto, Integer, PlaceInfoCriteria> repo() {
        return restaurantIntroMapper;
    } // func end

    /**
     * [ PR-01 ] 음식정 상세정보 저장
     * @author OngTK
     */
    public boolean saveRestaurantIntro(RestaurantIntroDto dto){
        if(dto.getRiStatus() == 0){             // 변경없음

        } else if(dto.getRiStatus() == 1){      // Create
            restaurantIntroMapper.create(dto);
            if(dto.getRiNo() > 0) {
                return true;
            } else {
                return false;
            }
        } else if(dto.getRiStatus() == 2) {      // Update
            return restaurantIntroMapper.update(dto);
        }
        return false;
    } // func end


} // class end
