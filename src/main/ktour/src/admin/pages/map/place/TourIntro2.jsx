/**
 * TourIntro2: 관광지 Intro 상세 입력 폼
 *
 * 역할
 * - 관광지 Intro 관련 세부 항목 입력 및 저장
 * - 저장 시 saveTourIntro thunk로 DTO 전달(tiNo/pno/tiStatus 포함)
 *
 * 데이터 흐름
 * - props.data를 baseRef.current에 스냅샷으로 유지(useRef)
 * - 수집: form(FormData) → collect() → dto 조립
 * - 변경 판단: isChanged()로 기존 값 대비 일부 키 비교
 * - 상태 값: tiStatus = 신규 1, 수정 2, 변경없음 0
 */
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { saveTourIntro } from "@admin/store/placeSlice";

const TourIntro2 = forwardRef(function TourIntro2({ data, pNo }, ref) {
  const dispatch = useDispatch();
  const baseRef = useRef(data ?? {});
  useEffect(() => { baseRef.current = (data ?? {}); }, [data]);

  const fmt = (s) => (s ?? "");
  const formRef = useRef(null);

  /** 수집: FormData → 단순 문자열 DTO */
  const collect = () => {
    const fd = new FormData(formRef.current);
    const get = (k) => (fd.get(k) ?? "").toString();
    return {
      accomcount: get("accomcount"),
      chkBabyCarriage: get("chkBabyCarriage"),
      chkCreditCard: get("chkCreditCard"),
      chkPet: get("chkPet"),
      expAgeRange: get("expAgeRange"),
      expGuide: get("expGuide"),
      heritage1: get("heritage1"),
      heritage2: get("heritage2"),
      heritage3: get("heritage3"),
      infoCenter: get("infoCenter"),
      openDate: get("openDate"),
      parking: get("parking"),
      restDate: get("restDate"),
      useSeason: get("useSeason"),
      useTime: get("useTime"),
    };
  };

  /** 변경 판단: baseRef.current와 문자열 비교 */
  const isChanged = (curr) => {
    const same = (a, b) => String(a ?? "") === String(b ?? "");
    const base = baseRef.current || {};
    const keys = [
      "accomcount","chkBabyCarriage","chkCreditCard","chkPet","expAgeRange","expGuide",
      "heritage1","heritage2","heritage3","infoCenter","openDate","parking",
      "restDate","useSeason","useTime"
    ];
    return keys.some((k) => !same(curr[k], base[k]));
  };

  /** 저장: tiStatus 계산 + thunk 디스패치 */
  const handleSave = async () => {
    const curr = collect();
    const prev = baseRef.current || {};
    const tiNo = prev.tiNo ?? null;
    const resolvedPno = pNo ?? prev.pNo ?? prev.pno ?? null;
    if (!resolvedPno) { alert("장소가 선택되지 않았습니다."); return; }

    const dto = {
      tiNo: tiNo ?? 0,
      pno: Number(resolvedPno),
      ...curr,
      tiStatus: tiNo ? (isChanged(curr) ? 2 : 0) : 1,
    };

    try {
      await dispatch(saveTourIntro(dto)).unwrap();
      alert("저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 부모(DetailSection)에서 일괄 저장 시 DTO 산출용 API 노출
  const collectForAll = (mode = 'new') => {
    const curr = collect();
    const prev = baseRef.current || {};
    const tiNo = prev.tiNo ?? null;
    const hasAny = Object.values(curr).some(v => String(v ?? '').trim() !== '');
    if (!hasAny && !tiNo) return null; // 내용이 전혀 없으면 skip
    const status = tiNo ? (mode === 'update' ? (isChanged(curr) ? 2 : 0) : 0) : 1;
    return { tiNo: tiNo ?? 0, ...curr, tiStatus: status };
  };

  useImperativeHandle(ref, () => ({ collectForAll }));

  /** 초기화: 특정 필드는 스킵 */
  const handleReset = () => {
    const form = formRef.current;
    if (!form) return;
    const skip = new Set(["tiNo","pNo","pno","createdAt","updatedAt"]);
    Array.from(form.elements).forEach((el)=>{
      if(!el||!el.name||skip.has(el.name)) return;
      const tag=(el.tagName||"").toLowerCase();
      const type=(el.type||"").toLowerCase();
      if(tag==='input'||tag==='textarea'){
        if(type==='checkbox'||type==='radio'){ el.checked=false; } else { el.value=''; }
      }
    });
  };

  const b = baseRef.current || {};
  const dateLabel = fmt(b.updatedAt) || fmt(b.createdAt) || "-";

  return (
    <div className="TourIntroWrap">
      <form ref={formRef} aria-label="관광지 상세 정보 입력">
        <fieldset>
          <legend>관광지 상세 정보</legend>

          {/* 수용 인원 */}
          <div className="form-group">
            <label htmlFor="accomcount">수용 인원</label>
            <input id="accomcount" name="accomcount" type="text" defaultValue={fmt(b.accomcount)} />
          </div>

          {/* 유모차/카드/반려동물 */}
          <div className="form-group">
            <label htmlFor="chkBabyCarriage">유모차 대여 정보</label>
            <input id="chkBabyCarriage" name="chkBabyCarriage" type="text" defaultValue={fmt(b.chkBabyCarriage)} />
          </div>
          <div className="form-group">
            <label htmlFor="chkCreditCard">신용카드 가능</label>
            <input id="chkCreditCard" name="chkCreditCard" type="text" defaultValue={fmt(b.chkCreditCard)} />
          </div>
          <div className="form-group">
            <label htmlFor="chkPet">애완동물 동반 가능</label>
            <input id="chkPet" name="chkPet" type="text" defaultValue={fmt(b.chkPet)} />
          </div>

          {/* 체험 정보 */}
          <div className="form-group">
            <label htmlFor="expAgeRange">체험 가능 연령</label>
            <input id="expAgeRange" name="expAgeRange" type="text" defaultValue={fmt(b.expAgeRange)} />
          </div>
          <div className="form-group">
            <label htmlFor="expGuide">체험 안내</label>
            <textarea id="expGuide" name="expGuide" rows={4} defaultValue={fmt(b.expGuide)} />
          </div>

          {/* 세계유산 여부 */}
          <div className="form-group">
            <label>세계유산 여부</label>
            <input aria-label="문화유산" name="heritage1" type="text" defaultValue={fmt(b.heritage1)} />
            <input aria-label="자연유산" name="heritage2" type="text" defaultValue={fmt(b.heritage2)} />
            <input aria-label="기록유산" name="heritage3" type="text" defaultValue={fmt(b.heritage3)} />
          </div>

          {/* 안내/개장/주차/쉬는 날/이용 정보 */}
          <div className="form-group">
            <label htmlFor="infoCenter">문의 및 안내</label>
            <input id="infoCenter" name="infoCenter" type="text" defaultValue={fmt(b.infoCenter)} />
          </div>
          <div className="form-group">
            <label htmlFor="openDate">개장일</label>
            <input id="openDate" name="openDate" type="text" defaultValue={fmt(b.openDate)} />
          </div>
          <div className="form-group">
            <label htmlFor="parking">주차시설</label>
            <input id="parking" name="parking" type="text" defaultValue={fmt(b.parking)} />
          </div>
          <div className="form-group">
            <label htmlFor="restDate">쉬는 날</label>
            <input id="restDate" name="restDate" type="text" defaultValue={fmt(b.restDate)} />
          </div>
          <div className="form-group">
            <label htmlFor="useSeason">이용 시기</label>
            <input id="useSeason" name="useSeason" type="text" defaultValue={fmt(b.useSeason)} />
          </div>
          <div className="form-group">
            <label htmlFor="useTime">이용 시간</label>
            <input id="useTime" name="useTime" type="text" defaultValue={fmt(b.useTime)} />
          </div>

          <div className="info_date">
            <b>최종 수정일</b> {dateLabel}
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSave}>저장</button>
            <button type="button" onClick={handleReset}>초기화</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
});

export default TourIntro2;
