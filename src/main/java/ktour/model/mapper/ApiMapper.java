package ktour.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * API 관련 자동화를 위한 Mapper
 *
 * @author AhnJH
 */

@Mapper
public interface ApiMapper {
    /**
     * 동적으로 SQL을 만들기 위해서 script 사용
     * <p>
     * collection : data의 key들을 순회
     * <p>
     * item : key를 변수에 저장
     * <p>
     * separator : 각 항목의 구분자를 설정
     * @author AhnJH
     * @param tableName 삽입할 테이블명
     * @param data 삽입할 데이터
     * @return 일단은 생성된 행의 개수 반환 -> auto_increment된 수 반환으로 변경 예정
     */

    @Insert("<script> " +
            "insert into ${tableName} " +
            "<foreach collection='data.keys' item='key' separator=', ' open='(' close=')'>" +
            "${key}" +
            "</foreach>" +
            " values " +
            "<foreach collection='data.keys' item='key' separator=', ' open='(' close=')'>" +
            "#{data[${key}]}" +
            "</foreach>" +
            "</script>")
    // todo AhnJH XML로 매핑 변경 필요
    int dynamicInsert(String tableName, Map<String, Object> data);
} // interface end