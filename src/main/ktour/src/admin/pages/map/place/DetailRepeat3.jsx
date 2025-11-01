/**
 * DetailRepeat3: 반복 정보(제목/내용) 편집 섹션
 *
 * 역할
 * - 자유 형식 반복 정보 행(제목/내용)을 추가/수정/삭제하고 저장합니다.
 * - 저장 시 상태를 부여하여 서버로 일괄 전송합니다.
 *
 * 데이터/상태 흐름
 * - props.items: 서버로부터 내려온 기존 반복 정보 목록
 * - rows: 화면 편집용 로컬 행 목록
 * - originalRef: 최초 로딩 스냅샷(변경 여부 판단용)
 * - deleted: 삭제 표시된 기존 행 목록(pirNo 있는 항목)
 *
 * 상태 규칙(pirStatus)
 * - 신규: 1, 수정: 2, 변경없음: 0, 삭제: 3
 * - 서버 payload에는 키를 pno로 통일합니다(pNo/pno/PNO 혼재 보정).
 */
import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { saveRepeatInfo } from "@admin/store/placeSlice";

/**
 * 서버 행을 화면 편집용 로우로 정규화
 */
function asRow(v) {
  if (!v) return { pirNo: null, pNo: null, fldgubun: 0, infoName: "", infoText: "", serialNum: 0, updatedAt: null, createdAt: null };
  return {
    pirNo: v.pirNo ?? null,
    pNo: v.pNo ?? v.pno ?? v.PNO ?? null,
    fldgubun: v.fldgubun ?? 0,
    infoName: v.infoName ?? "",
    infoText: v.infoText ?? "",
    serialNum: v.serialNum ?? 0,
    updatedAt: v.updatedAt ?? null,
    createdAt: v.createdAt ?? null,
  };
}

/** 신규 입력 기본행 팩토리 */
const blankRow = () => ({ pirNo: null, pNo: null, fldgubun: 0, infoName: "", infoText: "", serialNum: 0, updatedAt: null, createdAt: null });

/** 'YYYY-MM-DD HH:mm:ss' → Date 변환(실패 시 null) */
function parseKst(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const d = new Date(dateStr.replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

/** rows에서 최신 일시(업데이트 우선, 없으면 생성)를 구해 표시 문자열로 반환 */
function latestDisplay(rows) {
  const pick = (f) => rows.map(r => parseKst(r[f])).filter(Boolean).sort((a, b) => b - a)[0];
  const up = pick('updatedAt');
  if (up) return rows.find(r => parseKst(r.updatedAt)?.getTime() === up.getTime())?.updatedAt ?? '-';
  const cr = pick('createdAt');
  return cr ? (rows.find(r => parseKst(r.createdAt)?.getTime() === cr.getTime())?.createdAt ?? '-') : '-';
}

const DetailRepeat3 = forwardRef(function DetailRepeat3({ items = [], pNo, onChange }, ref) {
  const dispatch = useDispatch();

  // 편집 가능한 로컬 행 목록
  const [rows, setRows] = useState(() => (Array.isArray(items) && items.length ? items.map(asRow) : [blankRow()]));
  // 최초 스냅샷(변경 여부 판단에 사용)
  const originalRef = useRef([]);
  // 삭제 표시된 기존 행들(pirNo 존재). 저장 시 pirStatus=3으로 전송
  const [deleted, setDeleted] = useState([]);

  // items/pNo 변경 시 폼 초기화 + 스냅샷/삭제 목록 리셋
  useEffect(() => {
    const init = Array.isArray(items) && items.length > 0 ? items.map(asRow) : [blankRow()];
    setRows(init);
    originalRef.current = (Array.isArray(items) ? items.map(asRow) : []).filter(r => r.pirNo);
    setDeleted([]);
  }, [items, pNo]);

  // 외부 변경 알림(onChange)과 로컬 갱신을 함께 수행
  const emit = (next) => {
    setRows(next);
    if (typeof onChange === 'function') onChange(next);
  };

  /** 행 추가 */
  const addRow = () => emit([...rows, blankRow()]);

  /** 행 삭제 표시(기존 행은 deleted에 보관) */
  const markRemoveRow = (idx) => {
    const target = rows[idx];
    if (target?.pirNo) setDeleted((prev) => [...prev, target]);
    const next = rows.filter((_, i) => i !== idx);
    if (!next.length) next.push(blankRow());
    emit(next);
  };

  /** 단일 필드 값 변경 */
  const updateRow = (idx, field, value) => emit(rows.map((r, i) => i === idx ? { ...r, [field]: value } : r));

  const latest = useMemo(() => latestDisplay(rows), [rows]);

  /** 원본 대비 변경 여부 판단(infoName/infoText만 비교) */
  const isModified = (r) => {
    if (!r?.pirNo) return false;
    const orig = originalRef.current.find(o => o.pirNo === r.pirNo);
    if (!orig) return false;
    return String(orig.infoName ?? '') !== String(r.infoName ?? '') || String(orig.infoText ?? '') !== String(r.infoText ?? '');
  };

  /**
   * 저장: 삭제(D)/신규(C)/수정(U)/무변경(0) 상태별 payload 구성 후 저장 thunk 호출
   * - 신규 행이 있고 pNo가 없으면 저장 중단(장소 미선택)
   * - 중복 전송 방지: 삭제된 항목은 rows 루프에서 제외
   */
  const handleSave = async () => {
    try {
      const newRows = rows.filter(r => !r.pirNo);
      if (newRows.length > 0 && !pNo) { alert("장소가 선택되지 않았습니다."); return; }

      const payload = [];
      // 삭제 대상
      deleted.forEach(r => {
        if (!r?.pirNo) return;
        payload.push({
          pirNo: r.pirNo,
          pno: Number(r.pNo ?? pNo),
          fldgubun: r.fldgubun ?? 0,
          infoName: r.infoName ?? '',
          infoText: r.infoText ?? '',
          serialNum: r.serialNum ?? 0,
          pirStatus: 3
        });
      });

      // 신규/기존(삭제 표시된 기존 행은 제외)
      rows.forEach(r => {
        // 삭제표시된 기존 행은 rows에서 제외하여 중복 방지
        if (r?.pirNo && deleted.some(d => d.pirNo === r.pirNo)) return;

        if (!r?.pirNo) {
          payload.push({
            pirNo: null,
            pno: Number(pNo),
            fldgubun: 0,
            infoName: r.infoName ?? '',
            infoText: r.infoText ?? '',
            serialNum: 0,
            pirStatus: 1
          });
        } else {
          const orig = originalRef.current.find(o => o.pirNo === r.pirNo) ?? r;
          const status = isModified(r) ? 2 : 0;
          payload.push({
            pirNo: r.pirNo,
            pno: Number(orig.pNo ?? pNo),
            fldgubun: orig.fldgubun ?? 0,
            infoName: r.infoName ?? '',
            infoText: r.infoText ?? '',
            serialNum: orig.serialNum ?? 0,
            pirStatus: status
          });
        }
      });

      await dispatch(saveRepeatInfo({ pNo: Number(pNo), rows: payload })).unwrap();
      alert('저장되었습니다.');
      originalRef.current = rows.map(asRow).filter(r => r.pirNo);
      setDeleted([]);
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 부모(DetailSection)에서 일괄 저장 시 payload 산출용 API 노출
  const collectPayloadForAll = (mode = 'new') => {
    const payload = [];
    // 삭제 대상
    deleted.forEach(r => {
      if (!r?.pirNo) return;
      payload.push({
        pirNo: r.pirNo,
        pno: Number(r.pNo ?? pNo),
        fldgubun: r.fldgubun ?? 0,
        infoName: r.infoName ?? '',
        infoText: r.infoText ?? '',
        serialNum: r.serialNum ?? 0,
        pirStatus: 3
      });
    });
    // 신규/기존
    rows.forEach(r => {
      if (r?.pirNo && deleted.some(d => d.pirNo === r.pirNo)) return;
      if (!r?.pirNo) {
        // 신규는 update 모드에서도 1로 처리
        payload.push({
          pirNo: null,
          pno: Number(pNo ?? 0),
          fldgubun: 0,
          infoName: r.infoName ?? '',
          infoText: r.infoText ?? '',
          serialNum: 0,
          pirStatus: 1
        });
      } else {
        const orig = originalRef.current.find(o => o.pirNo === r.pirNo) ?? r;
        const status = isModified(r) ? 2 : 0;
        payload.push({
          pirNo: r.pirNo,
          pno: Number(orig.pNo ?? pNo),
          fldgubun: orig.fldgubun ?? 0,
          infoName: r.infoName ?? '',
          infoText: r.infoText ?? '',
          serialNum: orig.serialNum ?? 0,
          pirStatus: status
        });
      }
    });
    return payload;
  };

  useImperativeHandle(ref, () => ({ collectPayloadForAll }));

  return (
    <div className="placeRepeatWrap">
      <form aria-label="반복 정보 입력">
        <fieldset>
          <legend>반복 정보</legend>
          {rows.map((r, idx) => (
            <div key={r.pirNo ?? `new-${idx}`} className="form-group" style={{ display: 'flex' }}>
              <div>
                <label htmlFor={`repeat-title-${idx}`} className="sr-only">제목</label>
                <input
                  type="text"
                  id={`repeat-title-${idx}`}
                  name={`repeat[${idx}].infoName`}
                  placeholder="제목"
                  value={r.infoName}
                  onChange={(e) => updateRow(idx, 'infoName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`repeat-content-${idx}`} className="sr-only">내용</label>
                <input
                  type="text"
                  id={`repeat-content-${idx}`}
                  name={`repeat[${idx}].infoText`}
                  placeholder="내용"
                  value={r.infoText}
                  onChange={(e) => updateRow(idx, 'infoText', e.target.value)}
                />
              </div>
              <div>
                <button type="button" className="btn line" onClick={() => markRemoveRow(idx)}>삭제</button>
              </div>
            </div>
          ))}
          <div className="info_date">
            <b>최종 수정일</b> {latest}
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSave}>저장</button>
            <button type="button" onClick={addRow}>행 추가</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
});

export default DetailRepeat3;
