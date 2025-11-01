import { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * props.onChange({ ccNo, l1Cd, l2Cd, l3Cd })
 * labels는 화면표시(…Nm), values는 코드와 ccNo를 상태로 보관
 */
export default function CategorySelect({ value, onChange, idSuffix = "", namePrefix = "" }) {
  const [rows, setRows] = useState([]);            // 원본 API rows
  const [l1, setL1] = useState("");                // 선택된 l1Cd
  const [l2, setL2] = useState("");                // 선택된 l2Cd
  const [l3, setL3] = useState("");                // 선택된 l3Cd
  const [ccNo, setCcNo] = useState(null);          // 최종 소분류 ccNo

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/category", { params: { active: true } });
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("카테고리 로딩 실패:", e);
        if (mounted) setRows([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // rows: [{ lclsSystm1Cd, lclsSystm1Nm, lclsSystm2Cd, lclsSystm2Nm, lclsSystm3Cd, lclsSystm3Nm, ccNo }, ...]
// l1/l2/l3: 현재 선택된 코드(문자열 또는 빈문자열)
// onChange: 상위로 선택 결과를 올려보내는 콜백
// value: 외부(상위)에서 내려온 초기값/동기화용 값

// ---------------------------------------------------------------------------
// 1) rows → 3단계 트리형 자료구조로 변환 (렌더마다 다시 계산하지 않도록 useMemo)
//    최상위는 Map<l1Cd, { name, children: Map<l2Cd, { name, children: Array<{code,name,ccNo}> }> }>
// ---------------------------------------------------------------------------
const l1Map = useMemo(() => {
  const map = new Map();
  for (const r of rows) {
    // 각 행에서 1/2/3레벨 코드&이름 추출
    const l1Cd = r.lclsSystm1Cd, l2Cd = r.lclsSystm2Cd, l3Cd = r.lclsSystm3Cd;
    const l1Nm = r.lclsSystm1Nm, l2Nm = r.lclsSystm2Nm, l3Nm = r.lclsSystm3Nm;

    // 1레벨 노드가 없으면 생성: { name, children: Map() }
    if (!map.has(l1Cd)) map.set(l1Cd, { name: l1Nm, children: new Map() });

    // 2레벨 Map 가져온 뒤, 현재 l2Cd가 없으면 생성: { name, children: [] }
    const l2Map = map.get(l1Cd).children;
    if (!l2Map.has(l2Cd)) l2Map.set(l2Cd, { name: l2Nm, children: [] });

    // 3레벨은 배열로 보관: [{ code(l3Cd), name(l3Nm), ccNo }]
    l2Map.get(l2Cd).children.push({ code: l3Cd, name: l3Nm, ccNo: r.ccNo });
  }
  return map;
}, [rows]);

// ---------------------------------------------------------------------------
// 2) 셀렉트 옵션 계산 (useMemo로 캐싱)
//    - l1Options: 1레벨 전체 목록
//    - l2Options: 현재 l1이 선택된 경우에만 해당 하위 목록
//    - l3Options: 현재 l1/l2가 선택된 경우에만 해당 하위 목록(배열 그대로)
// ---------------------------------------------------------------------------
const l1Options = useMemo(
  () => [...l1Map.entries()].map(([code, v]) => ({ code, name: v.name })),
  [l1Map]
);

const l2Options = useMemo(() => {
  if (!l1 || !l1Map.has(l1)) return [];
  // l1의 children(Map)을 [ [l2Cd, {name, children}], ... ] 형태로 펼친 후 옵션으로 변환
  return [...l1Map.get(l1).children.entries()].map(([code, v]) => ({ code, name: v.name }));
}, [l1, l1Map]);

const l3Options = useMemo(() => {
  if (!l1 || !l2 || !l1Map.has(l1)) return [];
  const l2Map = l1Map.get(l1).children;
  if (!l2Map.has(l2)) return [];
  // 3레벨은 이미 [{code,name,ccNo}] 배열이므로 그대로 반환
  return l2Map.get(l2).children;
}, [l1, l2, l1Map]);

// ---------------------------------------------------------------------------
// 3) 체인지 핸들러
//    - 상위 단계가 바뀌면 하위 단계값과 ccNo를 리셋
//    - 선택된 코드뿐 아니라 사람이 읽을 이름도 함께 onChange로 올려줌
// ---------------------------------------------------------------------------

// L1 변경: L2/L3/ccNo 모두 초기화
const onChangeL1 = (e) => {
  const v = e.target.value;
  setL1(v); setL2(""); setL3(""); setCcNo(null);

  const l1Nm = v ? l1Map.get(v)?.name : null;
  // 상위로 현재 선택 상태 알림 (아직 ccNo/하위코드 없음)
  onChange?.({ ccNo: null, l1Cd: v || null, l2Cd: null, l3Cd: null, l1Nm, l2Nm: null, l3Nm: null });
};

// L2 변경: L3/ccNo 초기화
const onChangeL2 = (e) => {
  const v = e.target.value;
  setL2(v); setL3(""); setCcNo(null);

  const l1Nm = l1 ? l1Map.get(l1)?.name : null;
  const l2Nm = v ? l1Map.get(l1)?.children.get(v)?.name : null;

  onChange?.({ ccNo: null, l1Cd: l1 || null, l2Cd: v || null, l3Cd: null, l1Nm, l2Nm, l3Nm: null });
};

// L3 변경: ccNo 결정(3레벨 항목에 붙어 있는 실제 키), 모든 이름 포함해 전달
const onChangeL3 = (e) => {
  const v = e.target.value;
  setL3(v);

  // 방금 선택한 l3 항목 찾기
  const found = l3Options.find(x => x.code === v);
  const nextCcNo = found?.ccNo ?? null;
  setCcNo(nextCcNo);

  const l1Nm = l1 ? l1Map.get(l1)?.name : null;
  const l2Nm = l2 ? l1Map.get(l1)?.children.get(l2)?.name : null;
  const l3Nm = v ? found?.name : null;

  // 최종 선택 결과: ccNo 포함
  onChange?.({ ccNo: nextCcNo, l1Cd: l1 || null, l2Cd: l2 || null, l3Cd: v || null, l1Nm, l2Nm, l3Nm });
};

// ---------------------------------------------------------------------------
// 4) 외부 value/rows 변화에 따른 "초기 동기화"
//    - rows가 로드되었거나(value가 변경되었거나) 할 때, 외부값에 맞춰 내부 선택을 설정
//    - 동기화 기준 우선순위: ccNo → (l1/l2/l3 코드) → (l1/l2/l3 이름)
// ---------------------------------------------------------------------------
useEffect(() => {
  if (!rows || rows.length === 0) return;
  const v = value || {};

  // 현재 상태를 기본값으로 시작 — hit가 없으면 기존 선택 유지
  let nextL1 = l1, nextL2 = l2, nextL3 = l3, nextCc = ccNo;

  // 찾기 유틸
  const byCcNo = (cc) => rows.find(r => String(r.ccNo) === String(cc));
  const byCodes = (c1, c2, c3) =>
    rows.find(r =>
      String(r.lclsSystm1Cd) === String(c1) &&
      String(r.lclsSystm2Cd) === String(c2) &&
      String(r.lclsSystm3Cd) === String(c3)
    );
  const byNames = (n1, n2, n3) =>
    rows.find(r =>
      String(r.lclsSystm1Nm) === String(n1) &&
      String(r.lclsSystm2Nm) === String(n2) &&
      String(r.lclsSystm3Nm) === String(n3)
    );

  // ① ccNo로 찾기 → ② 코드로 찾기 → ③ 이름으로 찾기
  let hit = null;
  if (v.ccNo) hit = byCcNo(v.ccNo);
  if (!hit && (v.l1Cd && v.l2Cd && v.l3Cd)) hit = byCodes(v.l1Cd, v.l2Cd, v.l3Cd);
  if (!hit && (v.l1Nm && v.l2Nm && v.l3Nm)) hit = byNames(v.l1Nm, v.l2Nm, v.l3Nm);

  if (hit) {
    // 내부 상태 갱신
    nextL1 = hit.lclsSystm1Cd;
    nextL2 = hit.lclsSystm2Cd;
    nextL3 = hit.lclsSystm3Cd;
    nextCc = hit.ccNo;

    setL1(nextL1); setL2(nextL2); setL3(nextL3); setCcNo(nextCc);

    // 상위에도 현재 선택 사항을 즉시 통지
    const l1Nm = hit.lclsSystm1Nm, l2Nm = hit.lclsSystm2Nm, l3Nm = hit.lclsSystm3Nm;
    onChange?.({ ccNo: nextCc, l1Cd: nextL1, l2Cd: nextL2, l3Cd: nextL3, l1Nm, l2Nm, l3Nm });
  } else {
    // 외부 값이 모두 비워졌거나 매칭이 없을 때 내부 선택 초기화
    const cleared = !v.ccNo && !v.l1Cd && !v.l2Cd && !v.l3Cd && !v.l1Nm && !v.l2Nm && !v.l3Nm;
    if (cleared) {
      if (l1 !== "" || l2 !== "" || l3 !== "" || ccNo != null) {
        setL1(""); setL2(""); setL3(""); setCcNo(null);
      }
    }
  }
  // value.*나 rows가 바뀔 때만 실행 (불필요한 재실행 방지)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [rows, value?.ccNo, value?.l1Cd, value?.l2Cd, value?.l3Cd, value?.l1Nm, value?.l2Nm, value?.l3Nm]);
  return (
    <div className="form-group category-group">
      <label htmlFor="category-large{ idSuffix ? ('-' + idSuffix) : '' }">카테고리</label>

      {/* 대분류: 라벨은 lclsSystm1Nm, value는 lclsSystm1Cd */}
      <select id="category-large" name="categoryLarge" value={l1} onChange={onChangeL1}>
        <option value="">대분류</option>
        {l1Options.map(opt => (
          <option key={opt.code} value={opt.code}>{opt.name}</option>
        ))}
      </select>

      {/* 중분류 */}
      <select aria-label="카테고리 중분류" name="categoryMedium" value={l2} onChange={onChangeL2} disabled={!l1}>
        <option value="">중분류</option>
        {l2Options.map(opt => (
          <option key={opt.code} value={opt.code}>{opt.name}</option>
        ))}
      </select>

      {/* 소분류: 선택 시 ccNo가 결정됨 */}
      <select aria-label="카테고리 소분류" name="categorySmall" value={l3} onChange={onChangeL3} disabled={!l2}>
        <option value="">소분류</option>
        {l3Options.map(opt => (
          <option key={opt.code} value={opt.code}>{opt.name}</option>
        ))}
      </select>

      {/* 필요 시 숨김 필드로 ccNo를 폼에 포함 */}
      <input type="hidden" name="categoryCcNo" value={ccNo ?? ""} />
    </div>
  );
}
