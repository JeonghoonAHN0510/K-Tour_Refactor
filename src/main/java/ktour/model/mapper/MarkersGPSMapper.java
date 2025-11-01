package ktour.model.mapper;

import org.apache.ibatis.annotations.*;
import ktour.model.criteria.PlaceInfoCriteria;
import ktour.model.dto.MarkersGPSDto;
import ktour.model.repository.CommonRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * [ MarkersGPS ]
 * <p>
 * 마커GPS 위도, 경도, 마커이미지를 관리
 * @author OngTK AhnJH
 */
@Mapper
public interface MarkersGPSMapper extends CommonRepository<MarkersGPSDto, Integer, PlaceInfoCriteria> {

    /**
     * [1] pno 별 개별 조회
     */
    @Select("""
            select * from markersgps where pno = #{pno};
            """)
    @Override
    Optional<MarkersGPSDto> read(Integer pno);

    /**
     * [MG-01] 렌더링 기준 마커조회
     * 렌더링된 화면 기준으로 [동서남북] 좌표를 받아, 해당 범위 내의 마커를 조회한다.
     *
     * @param markersGPSDto 동서남북 좌표가 들어있는 Dto
     * @return 해당 범위에 있는 마커 리스트
     * @author AhnJH
     */
    List<Map<String, Object>> getMarkersGpsByCurrentLatLng(MarkersGPSDto markersGPSDto);

    List<Map<String, Object>> getMarkersGpsOnFestival(MarkersGPSDto markersGPSDto);

    /**
     * 신규 마커정보 저장
     */
    @Insert("""
        INSERT INTO markersGPS (pNo, mkURL, mapx, mapy)
        VALUES (#{pNo}, #{mkURL}, #{mapx}, #{mapy})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "mkNo")
    int create(MarkersGPSDto dto);

    /**
     * 마커정보 수정
     */
    @Update("""
        UPDATE markersGPS
           SET mkURL = #{mkURL},
               mapx  = #{mapx},
               mapy  = #{mapy}
         WHERE mkNo = #{mkNo}
    """)
    boolean update(MarkersGPSDto dto);

} // interface end
