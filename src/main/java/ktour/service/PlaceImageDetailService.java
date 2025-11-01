package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.PlaceImageDetailDto;
import ktour.model.mapper.PlaceImageDetailMapper;
import ktour.model.repository.CommonRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceImageDetailService extends AbstractService<PlaceImageDetailDto, Integer, PlaceInfoCriteria> {

    private final PlaceImageDetailMapper placeImageDetailMapper;

    @Override
    protected CommonRepository<PlaceImageDetailDto, Integer, PlaceInfoCriteria> repo() {
        return placeImageDetailMapper;
    }

    @Transactional
    public void bulkInsertWithSerial(List<PlaceImageDetailDto> rows){
        if (rows == null || rows.isEmpty()) return;
        Integer pNo = rows.get(0).getPNo();
        int max = placeImageDetailMapper.findMaxSerial(pNo); // 없으면 -1
        int serial = (max < 0 ? 0 : max + 1);
        int i = 0;
        for (PlaceImageDetailDto d : rows) {
            if (d.getSerialnum() == null || d.getSerialnum().isBlank()) {
                d.setSerialnum(String.valueOf(serial + i));
            }
            i++;
        }
        placeImageDetailMapper.bulkInsert(rows);
    }

    public int deleteAllByPno(Integer pNo){
        if (pNo == null || pNo == 0) return 0;
        return placeImageDetailMapper.deleteAllByPno(pNo);
    }

    public List<PlaceImageDetailDto> readAllToPno(int pNo){
        return placeImageDetailMapper.readAllToPno(pNo);
    }

} // func end
