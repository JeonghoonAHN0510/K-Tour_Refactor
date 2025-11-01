/**
 * FestivalIntro2: 행사/공연/축제 상세 입력 폼
 *
 * 역할
 * - 축제/행사 관련 세부 항목 입력 및 저장
 * - 저장 시 saveFestivalIntro thunk로 DTO 전달(fiNo/pno/fiStatus 포함)
 *
 * 데이터 흐름
 * - props.data를 초기 표시값으로 사용
 * - 수집: form(FormData) → collect() → dto 조립
 * - 변경 판단: isChanged()로 기존 값 대비 일부 키 비교
 * - 상태 값: fiStatus = 신규 1, 수정 2, 변경없음 0
 */
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { saveFestivalIntro } from "@admin/store/placeSlice";

const FestivalIntro2 = forwardRef(function FestivalIntro2({ data, pNo }, ref) {
  const dispatch = useDispatch();
  const t = data ?? {};
  const fmt = (s) => (s ?? "");
  const formRef = useRef(null);

  /**
   * 폼 입력값 수집
   * - FormData에서 문자열로 수집하여 DTO 기초 객체 반환
   */
  const collect = () => {
    const fd = new FormData(formRef.current);
    const get = (k) => (fd.get(k) ?? "").toString();
    return {
      eventStartDate: get("eventStartDate"),
      eventEndDate: get("eventEndDate"),
      progressType: get("progressType"),
      festivalType: get("festivalType"),
      ageLimit: get("ageLimit"),
      bookingPlace: get("bookingPlace"),
      discountInfoFestival: get("discountInfoFestival"),
      eventHomepage: get("eventHomepage"),
      eventPlace: get("eventPlace"),
      festivalGrade: get("festivalGrade"),
      placeInfo: get("placeInfo"),
      playTime: get("playTime"),
      program: get("program"),
      spendTimeFestival: get("spendTimeFestival"),
      sponsor1: get("sponsor1"),
      sponsor1Tel: get("sponsor1Tel"),
      sponsor2: get("sponsor2"),
      sponsor2Tel: get("sponsor2Tel"),
      subEvent: get("subEvent"),
      useTimeFestival: get("useTimeFestival"),
    };
  };

  /**
   * 변경 여부 판단
   * - 지정된 키 목록에 대해 기존 값(t)과 현재 값(curr) 문자열 비교
   */
  const isChanged = (curr) => {
    const same = (a, b) => String(a ?? "") === String(b ?? "");
    const keys = [
      "eventStartDate","eventEndDate","progressType","festivalType","ageLimit",
      "bookingPlace","discountInfoFestival","eventHomepage","eventPlace","festivalGrade",
      "placeInfo","playTime","program","spendTimeFestival","sponsor1","sponsor1Tel",
      "sponsor2","sponsor2Tel","subEvent","useTimeFestival"
    ];
    return keys.some((k) => !same(curr[k], t[k]));
  };

  /**
   * 저장
   * - fiNo 존재: 변경 시 2, 무변경 0
   * - fiNo 없음: 신규 1
   * - pNo/pno 혼재 대비 resolvedPno 보정
   */
  const handleSave = async () => {
    const curr = collect();
    const fiNo = t.fiNo ?? null;
    const resolvedPno = pNo ?? t.pNo ?? t.pno ?? null;
    if (!resolvedPno) { alert("장소가 선택되지 않았습니다."); return; }

    const dto = {
      fiNo: fiNo ?? 0,
      pno: Number(resolvedPno),
      ...curr,
      fiStatus: fiNo ? (isChanged(curr) ? 2 : 0) : 1,
    };

    try {
      await dispatch(saveFestivalIntro(dto)).unwrap();
      alert("저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 부모(DetailSection)에서 일괄 저장 시 DTO 산출용 API 노출
  const collectForAll = (mode = 'new') => {
    const curr = collect();
    const fiNo = t.fiNo ?? null;
    const hasAny = Object.values(curr).some(v => String(v ?? '').trim() !== '');
    if (!hasAny && !fiNo) return null;
    const status = fiNo ? (mode === 'update' ? (isChanged(curr) ? 2 : 0) : 0) : 1;
    return { fiNo: fiNo ?? 0, ...curr, fiStatus: status };
  };

  useImperativeHandle(ref, () => ({ collectForAll }));

  /**
   * 초기화
   * - 특정 필드(fiNo/pNo/pno/createdAt/updatedAt)는 건너뜀
   */
  const handleReset = () => {
    const form = formRef.current;
    if (!form) return;
    const skip = new Set(["fiNo","pNo","pno","createdAt","updatedAt"]);
    Array.from(form.elements).forEach((el)=>{
      if(!el||!el.name||skip.has(el.name)) return;
      const tag=(el.tagName||"").toLowerCase();
      const type=(el.type||"").toLowerCase();
      if(tag==='input'||tag==='textarea'){
        if(type==='checkbox'||type==='radio'){ el.checked=false; } else { el.value=''; }
      }
    });
  };

  const b = t || {};

  return (
    <div className="FestivalIntroWrap">
      <form ref={formRef} aria-label="행사/공연/축제 상세 정보 입력">
        <fieldset>
          <legend>행사/공연/축제 상세 정보</legend>

          {/* 일정 / 진행 */}
          <h4 className="section-title">일정 / 진행</h4>
          <div className="form-group">
            <label htmlFor="eventStartDate">행사 시작일</label>
            <input id="eventStartDate" name="eventStartDate" type="text" defaultValue={fmt(b.eventStartDate)} />
          </div>
          <div className="form-group">
            <label htmlFor="eventEndDate">행사 종료일</label>
            <input id="eventEndDate" name="eventEndDate" type="text" defaultValue={fmt(b.eventEndDate)} />
          </div>
          <div className="form-group">
            <label htmlFor="progressType">진행 상태</label>
            <input id="progressType" name="progressType" type="text" defaultValue={fmt(b.progressType)} />
          </div>
          <div className="form-group">
            <label htmlFor="festivalType">축제 유형</label>
            <input id="festivalType" name="festivalType" type="text" defaultValue={fmt(b.festivalType)} />
          </div>
          <div className="form-group">
            <label htmlFor="festivalGrade">축제 등급</label>
            <input id="festivalGrade" name="festivalGrade" type="text" defaultValue={fmt(b.festivalGrade)} />
          </div>

          {/* 장소 / 위치 / 홈페이지 */}
          <h4 className="section-title">장소 / 위치 / 홈페이지</h4>
          <div className="form-group">
            <label htmlFor="eventPlace">행사 장소</label>
            <input id="eventPlace" name="eventPlace" type="text" defaultValue={fmt(b.eventPlace)} />
          </div>
          <div className="form-group">
            <label htmlFor="placeInfo">장소 안내</label>
            <input id="placeInfo" name="placeInfo" type="text" defaultValue={fmt(b.placeInfo)} />
          </div>
          <div className="form-group">
            <label htmlFor="eventHomepage">홈페이지</label>
            <input id="eventHomepage" name="eventHomepage" type="text" defaultValue={fmt(b.eventHomepage)} />
          </div>

          {/* 예매 / 요금 */}
          <h4 className="section-title">예매 / 요금</h4>
          <div className="form-group">
            <label htmlFor="bookingPlace">예매처</label>
            <input id="bookingPlace" name="bookingPlace" type="text" defaultValue={fmt(b.bookingPlace)} />
          </div>
          <div className="form-group">
            <label htmlFor="useTimeFestival">이용 요금</label>
            <input id="useTimeFestival" name="useTimeFestival" type="text" defaultValue={fmt(b.useTimeFestival)} />
          </div>
          <div className="form-group">
            <label htmlFor="discountInfoFestival">할인 정보</label>
            <input id="discountInfoFestival" name="discountInfoFestival" type="text" defaultValue={fmt(b.discountInfoFestival)} />
          </div>

          {/* 관람 / 프로그램 */}
          <h4 className="section-title">관람 / 프로그램</h4>
          <div className="form-group">
            <label htmlFor="ageLimit">관람 가능 연령</label>
            <input id="ageLimit" name="ageLimit" type="text" defaultValue={fmt(b.ageLimit)} />
          </div>
          <div className="form-group">
            <label htmlFor="spendTimeFestival">관람 소요 시간</label>
            <input id="spendTimeFestival" name="spendTimeFestival" type="text" defaultValue={fmt(b.spendTimeFestival)} />
          </div>
          <div className="form-group">
            <label htmlFor="playTime">공연 시간</label>
            <input id="playTime" name="playTime" type="text" defaultValue={fmt(b.playTime)} />
          </div>
          <div className="form-group">
            <label htmlFor="program">프로그램</label>
            <input id="program" name="program" type="text" defaultValue={fmt(b.program)} />
          </div>

          {/* 주최 / 주관 */}
          <h4 className="section-title">주최 / 주관</h4>
          <div className="form-group">
            <label htmlFor="sponsor1">주최</label>
            <input id="sponsor1" name="sponsor1" type="text" defaultValue={fmt(b.sponsor1)} />
          </div>
          <div className="form-group">
            <label htmlFor="sponsor1Tel">주최 연락처</label>
            <input id="sponsor1Tel" name="sponsor1Tel" type="text" defaultValue={fmt(b.sponsor1Tel)} />
          </div>
          <div className="form-group">
            <label htmlFor="sponsor2">주관</label>
            <input id="sponsor2" name="sponsor2" type="text" defaultValue={fmt(b.sponsor2)} />
          </div>
          <div className="form-group">
            <label htmlFor="sponsor2Tel">주관 연락처</label>
            <input id="sponsor2Tel" name="sponsor2Tel" type="text" defaultValue={fmt(b.sponsor2Tel)} />
          </div>

          {/* 기타 */}
          <h4 className="section-title">기타</h4>
          <div className="form-group">
            <label htmlFor="subEvent">부대 행사</label>
            <input id="subEvent" name="subEvent" type="text" defaultValue={fmt(b.subEvent)} />
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

export default FestivalIntro2;
