/**
 * 관리자단 > 사이트 관리 > 푸시/팝업 관리 > 목록 섹션
 * @author juju9595
 * @since 2025.10.21
 * @version 0.1.0
 */

import { useState, useEffect } from "react";
import axios from "axios";

export default function ListSection(props) {
  // [1] 입력 상태
  const [ppTitle, setppTitle] = useState("");
  const [ppUse, setppUse] = useState("");    // UI: "", "0", "1", "2"
  const [ppType, setppType] = useState("");  // UI: "", "1", "2"
  const [status, setstatus] = useState("");  // UI: "", "1", "2", "3"

  // [2] 결과/페이지 상태
  const [pushList, setpushList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // ==========================
  // UI → 백엔드 기대값 매핑
  // ==========================
  // ppUse: (UI) 0/1/2  → (백단/DB) 1/2/3 로 전송
  const mapPpUse = (v) => {
    if (v === "" || v == null) return "";
    if (v === "0") return "1"; // 푸시알림+팝업
    if (v === "1") return "2"; // 푸시알림
    if (v === "2") return "3"; // 팝업
    return String(v);
  };

  // ppType: 지금은 "1","2" 그대로 사용 (DB가 텍스트면 여기서 변환)
  const mapPpType = (v) => (v == null ? "" : String(v));

  // status: "1/2/3" 문자열로 전송
  const mapStatus = (v) => (v == null ? "" : String(v));

  // [3] 검색
  const pushsearch = async () => {
    setLoading(true);

    // @RequestParam(필수) → 키를 절대 삭제하지 않고, 빈값은 빈문자열로 보냄
    const params = {
      ppUse:   mapPpUse(ppUse),
      ppType:  mapPpType(ppType),
      ppTitle: (ppTitle ?? "").trim(),
      status:  mapStatus(status),
      page,
      pageSize,
    };

    
    // 최종 전송 URL/params 확인
    const qs = new URLSearchParams(params).toString();
    console.log("[REQ] GET /push/search?" + qs, params);

    try {
      const res = await axios.get("http://localhost:8080/push/search", {
        params,
        withCredentials: true,
      });

      const data = res.data;

      // 다양한 응답 형태 대응
      const rows =
        (Array.isArray(data?.rows) && data.rows) ||
        (Array.isArray(data?.content) && data.content) ||
        (Array.isArray(data?.list) && data.list) ||
        (Array.isArray(data) && data) ||
        [];

        // ?는 "옵셔널 체이닝(Optional chaining)" 문법 -> e?.response?.status e가 존재하면 response를 찾고, response가 존재하면 status를 찾음
        // 중간에 하나라도 없으면 undefined 반환하고 멈춤
      const totalCount =
        (typeof data?.total === "number" && data.total) ||
        (typeof data?.totalElements === "number" && data.totalElements) ||
        (typeof data?.count === "number" && data.count) ||
        (Array.isArray(data) ? data.length : rows.length);

      setpushList(rows);
      setTotal(totalCount);

      console.log("[RES] rows:", rows.length, "total:", totalCount);
    } catch (e) {
      console.error("[검색 오류]", {
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });
      setpushList([]);
      setTotal(0);
      alert(
        `[검색 실패] status: ${e?.response?.status ?? "?"}\n` +
        `${e?.response?.data ?? e?.message ?? "알 수 없는 오류"}`
      );
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    pushsearch();
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

  /** ========================= 관리자단 > 사이트관리 > 푸시/팝업관리(PushPopup) .jsx영역 ================================== */
  return (
    <>
      <section className="listWrap">
        {/* 상세 검색 */}
        <div className="detailSearch">
          <form method="get" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="ppUseSelect">
              <b>사용구분</b>
              <select
                id="ppUseSelect"
                value={ppUse}
                onChange={(e) => setppUse(e.target.value)}
                className="memberTypeInput"
              >
                <option value="">전체</option>
                <option value="0">푸시알림+팝업</option>
                <option value="1">푸시알림</option>
                <option value="2">팝업</option>
              </select>
            </label>

            <label htmlFor="ppTypeSelect">
              <b>카테고리</b>
              <select
                id="ppTypeSelect"
                value={ppType}
                onChange={(e) => setppType(e.target.value)}
                className="memberTypeInput"
              >
                <option value="">전체</option>
                <option value="1">공지</option>
                <option value="2">이벤트</option>
              </select>
            </label>

            <label htmlFor="statusSelect">
              <b>노출상태</b>
              <select
                id="statusSelect"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
                className="subsStatusInput"
              >
                <option value="">전체</option>
                <option value="1">진행전</option>
                <option value="2">진행중</option>
                <option value="3">진행완료</option>
              </select>
            </label>

            <label htmlFor="titleInput">
              <b>제목</b>
              <input
                id="titleInput"
                value={ppTitle}
                onChange={(e) => setppTitle(e.target.value)}
                className="nameInput"
                type="text"
                placeholder="제목"
              />
            </label>

            <button
              onClick={pushsearch}
              type="button"
              className="searchBtn"
              disabled={loading}
            >
              {loading ? "검색중..." : "검색"}
            </button>
          </form>
        </div>

        {/* 결과 헤더 */}
        <ul className="titleBox">
          <li className="result">검색결과 : {total.toLocaleString()}건</li>
          <li className="btnBox">
            <select
              className="baseDateInput"
              value={pageSize}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPageSize(v);
                setPage(1);
              }}
            >
              <option value={10}>10개 보기</option>
              <option value={30}>30개 보기</option>
              <option value={50}>50개 보기</option>
            </select>
            <button type="button" className="btn line" onClick={() => console.log("[엑셀] TODO")}>
              엑셀 다운로드
            </button>
          </li>
        </ul>

        {/* 목록 테이블 */}
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>사용구분</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>노출시작일</th>
                <th>노출종료일</th>
                <th>푸시알림시간</th>
                <th>작성자</th>
              </tr>
            </thead>
            <tbody>
               {Array.isArray(pushList) && pushList.length > 0 ? (
              pushList.map((p, idx) => {
                const active = props.selectedId === p.ppNo;
                return (
                  <tr
                    key={p.ppNo ?? idx}
                    onClick={() => props.onSelect?.(p)}
                    className={active ? "active" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{p.ppNo ?? idx + 1}</td>
                    <td>{p.ppUse ?? "-"}</td>
                    <td>{p.ppType ?? "-"}</td>
                    <td><b>{p.ppTitle ?? "-"}</b></td>
                    <td>{p.ppStart ? String(p.ppStart).substring(0, 10) : "-"}</td>
                    <td>{p.ppEnd ? String(p.ppEnd).substring(0, 10) : "-"}</td>
                    <td>{p.ppIterated ?? "-"}</td>
                    <td>{p.mgNick ?? p.mgNo ?? "-"}</td>
                  </tr>
                );})
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    {loading ? "검색중..." : "검색 결과가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
} // ListSection.jsx end
