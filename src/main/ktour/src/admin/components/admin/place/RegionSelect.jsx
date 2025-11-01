import { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * props.onChange({ ldNo, regnCd, signguCd })
 *  - 1차 표기: lDongRegnNm
 *  - 2차 표기: lDongSignguNm
 *  - 값/코드: lDongRegnCd, lDongSignguCd, ldNo(최종)
 */
export default function RegionSelect({ value, onChange, idSuffix = "", namePrefix = "" }) {

    const [rows, setRows] = useState([]);
    const [regnCd, setRegnCd] = useState("");    // 1차 선택값(lDongRegnCd)
    const [signguCd, setSignguCd] = useState(""); // 2차 선택값(lDongSignguCd)
    const [ldNo, setLdNo] = useState(null);       // 최종 선택 ldNo

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/ldongcode/getAllDong");
                if (mounted) setRows(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("지역코드 로딩 실패:", e);
                if (mounted) setRows([]);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // 1차: 시/도 목록 (중복 제거)
    const regnOptions = useMemo(() => {
        const seen = new Set();
        const out = [];
        for (const r of rows) {
            const cd = r.lDongRegnCd ?? r.ldongRegnCd;     // 대/소문자 모두 허용
            const nm = r.lDongRegnNm ?? r.ldongRegnNm;
            if (!cd || seen.has(cd)) continue;
            seen.add(cd);
            out.push({ code: cd, name: nm });
        }
        // 정렬이 필요하면 아래 주석 해제
        // out.sort((a,b) => a.name.localeCompare(b.name, "ko"));
        return out;
    }, [rows]);

    // 2차: 선택된 시/도의 시군구 목록
    const signguOptions = useMemo(() => {
        if (!regnCd) return [];
        const seen = new Set();
        const out = [];
        for (const r of rows) {
            const rowRegn = r.lDongRegnCd ?? r.ldongRegnCd;
            if (rowRegn !== regnCd) continue;
            const cd = r.lDongSignguCd ?? r.ldongSignguCd;
            const nm = r.lDongSignguNm ?? r.ldongSignguNm;
            if (!cd || seen.has(cd)) continue;
            seen.add(cd);
            out.push({ code: cd, name: nm });
        }
        return out;
    }, [rows, regnCd]);

    const onChangeRegn = (e) => {
        console.log(e.target.value)
        const v = e.target.value;
        setRegnCd(v);
        setSignguCd("");
        setLdNo(null);
        const regnNm = v
            ? regnOptions.find(opt => opt.code === v)?.name
            : null;
        // 이름까지 함께 전달
        onChange?.({
            ldNo: null,
            regnCd: v || null,
            regnNm: regnNm || null,
            signguCd: null,
            signguNm: null
        });
    };

    const onChangeSigngu = (e) => {
        console.log(e.target.value)
        const v = e.target.value;
        setSignguCd(v);

        const found = rows.find(
            r => (r.lDongRegnCd ?? r.ldongRegnCd) === regnCd &&
                (r.lDongSignguCd ?? r.ldongSignguCd) === v
        );
        const nextLdNo = found?.ldNo ?? found?.ldno ?? null;
        const regnNm = found?.lDongRegnNm ?? found?.ldongRegnNm ?? null;
        const signguNm = found?.lDongSignguNm ?? found?.ldongSignguNm ?? null;

        setLdNo(nextLdNo);
        // 이름까지 함께 전달
        onChange?.({
            ldNo: nextLdNo,
            regnCd: regnCd || null,
            regnNm: regnNm || null,
            signguCd: v || null,
            signguNm: signguNm || null
        });
    };

    const idR1 = `region-1${idSuffix ? "-" + idSuffix : ""}`;
    const idR2 = `region-2${idSuffix ? "-" + idSuffix : ""}`;
    const nmR1 = `${namePrefix ? namePrefix + "-" : ""}region1`;
    const nmR2 = `${namePrefix ? namePrefix + "-" : ""}region2`;

    // 외부 value 동기화: rows 로딩 후 또는 value 변경 시 내부 선택을 동기화
    useEffect(() => {
        if (!rows || rows.length === 0) return;
        const v = value || {};

        // 값이 모두 비어있으면 내부도 초기화
        const isCleared = !v.ldNo && !v.regnCd && !v.signguCd && !v.regnNm && !v.signguNm;
        if (isCleared) {
            if (regnCd !== "" || signguCd !== "" || ldNo != null) {
                setRegnCd("");
                setSignguCd("");
                setLdNo(null);
            }
            return;
        }

        // 외부 값으로 역매핑하여 내부 상태 갱신
        const byLdNo = (ld) => rows.find(r => String(r.ldNo ?? r.ldno) === String(ld));
        const byCodes = (c1, c2) => rows.find(r => String(r.lDongRegnCd ?? r.ldongRegnCd) === String(c1)
            && String(r.lDongSignguCd ?? r.ldongSignguCd) === String(c2));
        const byNames = (n1, n2) => rows.find(r => String(r.lDongRegnNm ?? r.ldongRegnNm) === String(n1)
            && String(r.lDongSignguNm ?? r.ldongSignguNm) === String(n2));

        let hit = null;
        if (v.ldNo) hit = byLdNo(v.ldNo);
        if (!hit && (v.regnCd && v.signguCd)) hit = byCodes(v.regnCd, v.signguCd);
        if (!hit && (v.regnNm && v.signguNm)) hit = byNames(v.regnNm, v.signguNm);

        if (hit) {
            const nextRegn = hit.lDongRegnCd ?? hit.ldongRegnCd ?? "";
            const nextSign = hit.lDongSignguCd ?? hit.ldongSignguCd ?? "";
            const nextLd = hit.ldNo ?? hit.ldno ?? null;
            if (regnCd !== nextRegn) setRegnCd(nextRegn);
            if (signguCd !== nextSign) setSignguCd(nextSign);
            if (ldNo !== nextLd) setLdNo(nextLd);
        }
        // 이름 채우기 등의 상향 동기화는 부모 onChange가 이미 처리 중이므로 생략
    }, [rows, value?.ldNo, value?.regnCd, value?.signguCd, value?.regnNm, value?.signguNm]);

    return (
        <span className="form-group">
            <label htmlFor={idR1}>1차 지역</label>
            <select id={idR1} name={nmR1} value={regnCd} onChange={onChangeRegn}>
                <option value="">전체</option>
                {regnOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
            </select>

            <label className="sr-only" htmlFor={idR2}>2차 지역</label>
            <select
                id={idR2} 
                name={nmR2}
                value={signguCd}
                onChange={onChangeSigngu}
                disabled={!regnCd}
            >
                <option value="">전체</option>
                {signguOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
            </select>

            {/* 필요 시 폼 전송용 숨김 필드 */}
            <input type="hidden" name="ldNo" value={ldNo ?? ""} />
        </span>
    );
}
