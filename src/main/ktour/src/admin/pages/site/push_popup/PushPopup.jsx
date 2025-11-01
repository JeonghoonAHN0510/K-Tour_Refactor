/**
 * 관리자단 > 사이트관리 > 푸시/팝업관리(PushPopup) 페이지 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.19
 * @version 0.1.1
 */
import SplitPaneResponsive from "@admin/components/common/SplitPaneResponsive";   // 반응형 스플리터
import ListSection from "@admin/pages/site/push_popup/ListSection.jsx";           // 좌측: 목록
import DetailSection from "@admin/pages/site/push_popup/DetailSection.jsx";       // 우측: 상세(CRUD)


import { useEffect, useState } from "react";
import axios from "axios";

export default function PushPopup(props) {

// 목록/상세 상태&로딩
const [pushList, setPushList] = useState([]);
const [loading, setLoading] = useState(false);

const [selectedId, setSelectedId] = useState(null);
const [detail, setDetail] = useState(null);
const [detailLoading, setDetailLoding] = useState(false);

// 목록 조회
  const searchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/push/search", {
        withCredentials: true,
        params: { _t: Date.now() },                       // ← 캐시 방지 쿼리
        headers : { "Cache-Control": "no-cache, no-store" } // ← 캐시 방지 헤더
      });
      const rows = 
      Array.isArray(res.data) ? res.data :
      Array.isArray(res.data?.rows) ? res.data.rows :
      Array.isArray(res.data?.content) ? res.data.content :
      Array.isArray(res.data?.list) ? res.data.list : [];
      setPushList(rows);

      // 선택 유지(선택 중이던 항목이 목록에 있으면 교체)
      if (selectedId) {
        const hit = rows.find((r) => r.ppNo === selectedId);
        if (!hit) {
          setSelectedId(null);
          setDetail(null);
        }
      }
    } catch (e) {
      console.error("[목록 조회 실패]", e);
      setPushList([]);
    } finally {
      setLoading(false);
    }
  };

  // 행 선택 핸들러
  const handleSelectRow = (row) => {
    setSelectedId(row?.ppNo ?? null);
    setDetail(row ?? null); // 목록 데이터로 즉시 보여주고…
  };

  // 선택 변경 시 상세 재조회(서버 기준 최신값)
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedId) return;
      try {
        setDetailLoding(true);
        const res = await axios.get(
          `http://localhost:8080/push/${selectedId}`,
          { withCredentials: true }
        );
        setDetail(res.data ?? null);
      } catch (e) {
        console.error("[상세 조회 실패]", e);
        // 목록의 item만이라도 유지
      } finally {
        setDetailLoding(false);
      }
    };
    fetchDetail();
  }, [selectedId]);

  // 최초 로딩
  useEffect(() => {
    searchList();
  }, []);
/** ========================= 관리자단 > 사이트관리 > 푸시/팝업관리(PushPopup) .jsx영역 ================================== */
    return (
        <>
            <SplitPaneResponsive
                initLeftPct={50}            // 초기 좌측 폭(%)
                minLeftPx={240}             // 좌측 최소(px)
                minRightPx={320}            // 우측 최소(px)
                left={<ListSection
                    rows={pushList}
                    loading={loading}
                    selectedId={selectedId}
                    onSelect={handleSelectRow}
                    onRefresh={searchList}
                    />}      // 좌측 콘텐츠
                right={<DetailSection
                    selected={detail}
                // ⬇️ sessionUser 미정의로 크래시 나므로 전달하지 않음 (옵션 prop)
                // loginMgNo={sessionUser?.mgNo}
                onSaved={() => {
                  // 즉시 목록 갱신(캐시 방지 포함)
                searchList().then(() =>{
                  if(detail?.ppNo) setSelectedId(detail.ppNo);
                });
              }}
                onDeleted={() => {
                    // 삭제 후 목록 갱신 + 선택 해제
                    searchList();
                    setSelectedId(null);
                    setDetail(null);
                }}
                    />
                }   // 우측 콘텐츠
            />
        </>
    );
}//PushPopup.jsx end