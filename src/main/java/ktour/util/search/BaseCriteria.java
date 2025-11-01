package ktour.util.search;

import java.util.HashMap;
import java.util.Map;

/**
 * [ BaseCriteria ]
 * 도메인별 Criteria의 공통 부모인 추상 class
 */
public abstract class BaseCriteria {

    public Map<String, Object> toParamMap() {
        return new HashMap<>();
    }

} // c;ass end