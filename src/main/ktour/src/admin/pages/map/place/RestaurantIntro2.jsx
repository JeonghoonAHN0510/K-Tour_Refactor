/**
 * RestaurantIntro2: 음식점 상세 입력 폼
 *
 * 역할
 * - 음식점 관련 세부 항목 입력 및 저장
 * - 저장 시 saveRestaurantIntro thunk로 DTO 전달(riNo/pno/riStatus 포함)
 *
 * 데이터 흐름
 * - props.data를 초기 표시값으로 사용
 * - 수집: form(FormData) → collect() → dto 조립
 * - 변경 판단: isChanged()로 기존 값 대비 일부 키 비교
 * - 상태 값: riStatus = 신규 1, 수정 2, 변경없음 0
 */
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { saveRestaurantIntro } from "@admin/store/placeSlice";

const RestaurantIntro2 = forwardRef(function RestaurantIntro2({ data, pNo }, ref) {
  const dispatch = useDispatch();
  const base = data ?? {};
  const fmt = (s) => (s ?? "");
  const formRef = useRef(null);

  /**
   * 폼 입력값 수집
   * - FormData에서 문자열/숫자를 수집하여 DTO 기초 객체 반환
   */
  const collect = () => {
    const fd = new FormData(formRef.current);
    const get = (k) => (fd.get(k) ?? "").toString();
    const toInt = (k) => {
      const v = get(k).trim();
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    return {
      chkCreditCardFood: get("chkCreditCardFood"),
      discountInfoFood: get("discountInfoFood"),
      firstMenu: get("firstMenu"),
      infoCenterFood: get("infoCenterFood"),
      kidsFacility: toInt("kidsFacility"),
      lcnsNo: get("lcnsNo"),
      openDateFood: get("openDateFood"),
      openTimeFood: get("openTimeFood"),
      packing: get("packing"),
      parkingFood: get("parkingFood"),
      reservationFood: get("reservationFood"),
      restDateFood: get("restDateFood"),
      scaleFood: get("scaleFood"),
      seat: get("seat"),
      smoking: get("smoking"),
      treatMenu: get("treatMenu"),
    };
  };

  /**
   * 변경 여부 판단
   * - 지정된 키 목록에 대해 기존 값(base)과 현재 값(curr) 문자열 비교
   */
  const isChanged = (curr) => {
    const same = (a, b) => String(a ?? "") === String(b ?? "");
    const keys = [
      "chkCreditCardFood","discountInfoFood","firstMenu","infoCenterFood","kidsFacility",
      "lcnsNo","openDateFood","openTimeFood","packing","parkingFood","reservationFood",
      "restDateFood","scaleFood","seat","smoking","treatMenu"
    ];
    return keys.some((k) => !same(curr[k], base[k]));
  };

  /**
   * 저장
   * - riNo 존재: 변경 시 2, 무변경 0
   * - riNo 없음: 신규 1
   * - pNo/pno 혼재 대비 resolvedPno 보정
   */
  const handleSave = async () => {
    const curr = collect();
    const riNo = base?.riNo ?? null;
    const resolvedPno = pNo ?? base?.pNo ?? base?.pno ?? null;
    if (!resolvedPno) { alert("장소가 선택되지 않았습니다."); return; }
    const dto = { riNo: riNo ?? 0, pno: Number(resolvedPno), ...curr, riStatus: riNo ? (isChanged(curr) ? 2 : 0) : 1 };
    try {
      await dispatch(saveRestaurantIntro(dto)).unwrap();
      alert("저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 부모(DetailSection)에서 일괄 저장 시 DTO 산출용 API 노출
  const collectForAll = (mode = 'new') => {
    const curr = collect();
    const riNo = base?.riNo ?? null;
    const hasAny = Object.values(curr).some(v => String(v ?? '').trim() !== '');
    if (!hasAny && !riNo) return null;
    const status = riNo ? (mode === 'update' ? (isChanged(curr) ? 2 : 0) : 0) : 1;
    return { riNo: riNo ?? 0, ...curr, riStatus: status };
  };

  useImperativeHandle(ref, () => ({ collectForAll }));

  /**
   * 초기화
   * - 특정 필드(riNo/pNo/pno/createdAt/updatedAt)는 건너뜀
   */
  const handleReset = () => {
    const form = formRef.current;
    if (!form) return;
    const skip = new Set(["riNo", "pNo", "pno", "createdAt", "updatedAt"]);
    Array.from(form.elements).forEach((el) => {
      if (!el || !el.name || skip.has(el.name)) return;
      const tag = (el.tagName || "").toLowerCase();
      const type = (el.type || "").toLowerCase();
      if (tag === "input" || tag === "textarea") {
        if (type === "checkbox" || type === "radio") {
          el.checked = false;
        } else {
          el.value = "";
        }
      }
    });
  };

  const b = base || {};

  return (
    <div className="RestaurantIntroWrap">
      <form ref={formRef} aria-label="음식점 상세 정보 입력">
        <fieldset>
          <legend>음식점 상세 정보</legend>

          {/* 메뉴 / 결제 */}
          <h4 className="section-title">메뉴 / 결제</h4>
          <div className="form-group">
            <label htmlFor="chkCreditCardFood">신용카드</label>
            <input id="chkCreditCardFood" name="chkCreditCardFood" type="text" defaultValue={fmt(b.chkCreditCardFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="discountInfoFood">할인 정보</label>
            <input id="discountInfoFood" name="discountInfoFood" type="text" defaultValue={fmt(b.discountInfoFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="firstMenu">대표 메뉴</label>
            <input id="firstMenu" name="firstMenu" type="text" defaultValue={fmt(b.firstMenu)} />
          </div>
          <div className="form-group">
            <label htmlFor="treatMenu">취급 메뉴</label>
            <input id="treatMenu" name="treatMenu" type="text" defaultValue={fmt(b.treatMenu)} />
          </div>

          {/* 안내 / 문의 */}
          <h4 className="section-title">안내 / 문의</h4>
          <div className="form-group">
            <label htmlFor="infoCenterFood">문의 및 안내</label>
            <input id="infoCenterFood" name="infoCenterFood" type="text" defaultValue={fmt(b.infoCenterFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="kidsFacility">어린이 놀이방 유무(0/1)</label>
            <input id="kidsFacility" name="kidsFacility" type="number" defaultValue={fmt(b.kidsFacility)} />
          </div>
          <div className="form-group">
            <label htmlFor="smoking">금연/흡연 여부</label>
            <input id="smoking" name="smoking" type="text" defaultValue={fmt(b.smoking)} />
          </div>

          {/* 인허가 / 규모 / 좌석 */}
          <h4 className="section-title">인허가 / 규모 / 좌석</h4>
          <div className="form-group">
            <label htmlFor="lcnsNo">인허가 번호</label>
            <input id="lcnsNo" name="lcnsNo" type="text" defaultValue={fmt(b.lcnsNo)} />
          </div>
          <div className="form-group">
            <label htmlFor="scaleFood">규모</label>
            <input id="scaleFood" name="scaleFood" type="text" defaultValue={fmt(b.scaleFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="seat">좌석 수</label>
            <input id="seat" name="seat" type="text" defaultValue={fmt(b.seat)} />
          </div>

          {/* 영업 */}
          <h4 className="section-title">영업</h4>
          <div className="form-group">
            <label htmlFor="openDateFood">개업일</label>
            <input id="openDateFood" name="openDateFood" type="text" defaultValue={fmt(b.openDateFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="openTimeFood">영업 시간</label>
            <input id="openTimeFood" name="openTimeFood" type="text" defaultValue={fmt(b.openTimeFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="reservationFood">예약 안내</label>
            <input id="reservationFood" name="reservationFood" type="text" defaultValue={fmt(b.reservationFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="restDateFood">쉬는 날</label>
            <input id="restDateFood" name="restDateFood" type="text" defaultValue={fmt(b.restDateFood)} />
          </div>
          <div className="form-group">
            <label htmlFor="packing">포장 가능</label>
            <input id="packing" name="packing" type="text" defaultValue={fmt(b.packing)} />
          </div>

          {/* 주차 */}
          <h4 className="section-title">주차</h4>
          <div className="form-group">
            <label htmlFor="parkingFood">주차시설</label>
            <input id="parkingFood" name="parkingFood" type="text" defaultValue={fmt(b.parkingFood)} />
          </div>

          <div className="info_date">
            <b>최종 수정일</b> {fmt(b.updatedAt) || fmt(b.createdAt) || "-"}
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

export default RestaurantIntro2;
