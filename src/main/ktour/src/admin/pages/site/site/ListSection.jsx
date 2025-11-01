/**
 * 관리자단 > 사이트관리 > 사이트정보(site) > 검색리스트단(ListSection.jsx) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.2
 */
import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import Pagination from "@admin/components/admin/place/Pagination";
import ResizableTable from "@admin/components/common/ResizableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function ListSection({
    selectedDomain,
    setSelectedDomain,
    activeSite,
    setActiveSite,
}) {
    // ---------- 검색 조건 ----------
    const [siName, setSiName] = useState("");        // 사이트명
    const [siDomain, setSiDomain] = useState("");    // 도메인(URL)
    const [siIsPublic, setSiIsPublic] = useState(""); // 공개여부("0" | "1" | "")
    // ---------- 리스트/페이지 ----------
    const [rows, setRows] = useState([]);            // 현재 페이지 데이터
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searched, setSearched] = useState(false);

    const EMPTY_FLAG = [{ __empty: true }];
    const siIsPublicLabelMap = { 0: "비공개", 1: "공개" };

    // [핵심] 검색 실행 (page/size 반영)
    const onSearch = useCallback(async (e) => {
        try {
            e?.preventDefault?.();

            // 쿼리 파라미터(빈 값 제외)
            const params = {
                ...(siName ? { siName } : {}),
                ...(siDomain ? { siDomain } : {}),
                ...(siIsPublic !== "" ? { siIsPublic } : {}), // "0"도 유효
            };

            // const A = { siName: "루트랩" }; const B = { siDomain: "ktour.kr" };
            // const params = { ...A, ...B }; ----> 스프레드 연산자(Spread Operator) 
            // 결과 → { siName: "루트랩", siDomain: "ktour.kr" }

            const { data } = await axios.get("http://localhost:8080/siteinfo/search", { params });
            const list = Array.isArray(data) ? data : [];
            const total = list.length;
            setTotalElements(total);

            const offset = (page - 1) * size;
            const pageSlice = list.slice(offset, offset + size);

            if (pageSlice.length === 0) {
                setRows(EMPTY_FLAG);
                // 검색 시 선택 해제
                setSelectedDomain?.(null);
                setSearched(true);
                return;
            }

            // API 응답 필드 가정: { siName, siDomain, siTel, siEmail, siIsPublic, siCreatedAt, siUpdatedAt }
            const rowsMapped = pageSlice.map((r, idx) => ({
                no: offset + idx + 1,
                siIsPublic: siIsPublicLabelMap[Number(r.siIsPublic)] ?? "-",
                siName: <strong>{r.siName}</strong>,
                siDomain: r.siDomain,
                siTel: r.siTel,
                siEmail: r.siEmail,
                siCreatedAt: r.createdAt,
                siUpdatedAt: r.updatedAt,
                // 선택 및 상세조회용 식별자(행키)를 siDomain으로 통일
                __key: r.siDomain,
            }));

            setRows(rowsMapped);
            setSearched(true);

            // 첫 행 자동 선택 + 상세조회
            const firstKey = rowsMapped[0]?.__key;
            if (firstKey) {
                setSelectedDomain?.(firstKey);
                await handleRowClick(firstKey);
            }
        } catch (error) {
            console.error("[onSearch] 검색 실패:", error);
            setRows(EMPTY_FLAG);
            setTotalElements(0);
            setSearched(true);
        }
    }, [siName, siDomain, siIsPublic, page, size, setSelectedDomain]);

    // 상세조회
    const handleRowClick = useCallback(async (domain) => {
        try {
            if (!domain) return;
            setSelectedDomain?.(domain);

            const { data } = await axios.get("http://localhost:8080/siteinfo/search", {
                params: { siDomain: domain },
            });

            // 도메인 단건 조회 가정
            const item = Array.isArray(data) ? (data[0] ?? null) : data ?? null;
            setActiveSite?.(item);
        } catch (err) {
            console.error("[detail] 실패:", err);
            setActiveSite?.(null);
        }
    }, [setActiveSite, setSelectedDomain]);

    // activeSite 디버깅 로그 (옵션)
    useEffect(() => {
        if (activeSite) console.log("activeSite:", activeSite);
    }, [activeSite]);

    // 페이지/사이즈 변경 시 재조회
    useEffect(() => {
        onSearch();
    }, [page, size, onSearch]);

    // 선택 행 하이라이트 표시
    const viewRows = useMemo(() => {
        if (rows.length === 1 && rows[0]?.__empty) return rows;
        return rows.map((r) => ({
            ...r,
            _active: selectedDomain === r.__key, // 선택 행 비교
        }));
    }, [rows, selectedDomain]);

    // 검색조건 초기화
    const onReset = useCallback(() => {
        setSiName("");
        setSiDomain("");
        setSiIsPublic("");
        // 초기화 후 첫 페이지로 이동 + 재검색
        setPage(1);
    }, []);

    // 테이블 컬럼
    const columns = [
        { id: "no", title: "No", width: 50 },
        { id: "siIsPublic", title: "사이트공개여부", width: 80 },
        { id: "siName", title: "사이트명", width: 130 },
        { id: "siDomain", title: "도메인(URL)", width: 140 },
        { id: "siTel", title: "대표전화", width: 120 },
        { id: "siEmail", title: "대표이메일", width: 150 },
        { id: "siCreatedAt", title: "등록일", width: 120 },
        { id: "siUpdatedAt", title: "수정일", width: 120 },
    ];

    const handlePageChange = (p) => setPage(p);
    const handleSizeChange = (s) => {
        setSize(s);
        setPage(1);
    };
    // 전체 비우기(*주의 : 개발 중일 때만 사용할 것)
    localStorage.clear();
    /** =========================  사이트현황(SiteInfo) > 검색/리스트 ListSection.jsx =============================== */

    return (
        <>
            {/* 좌측: 검색/리스트 */}
            <section className="listWrap">
                {/* 조건검색 */}
                <div className="detailSearch">
                    <form aria-label="사이트정보 조건검색" onSubmit={onSearch}>
                        {/* 공개여부(0/1) */}
                        <span className="form-group">
                            <label htmlFor="siIsPublic">공개여부</label>
                            <select
                                id="siIsPublic"
                                name="siIsPublic"
                                value={siIsPublic}
                                onChange={(e) => setSiIsPublic(e.target.value)}
                            >
                                <option value="">전체</option>
                                <option value="1">공개</option>
                                <option value="0">비공개</option>
                            </select>
                        </span>

                        {/* 도메인(URL) */}
                        <span className="form-group">
                            <label htmlFor="siDomain">도메인(URL)</label>
                            <input
                                type="text"
                                id="siDomain"
                                name="siDomain"
                                value={siDomain}
                                onChange={(e) => setSiDomain(e.target.value)}
                            />
                        </span>

                        {/* 사이트명 */}
                        <span className="form-group">
                            <label htmlFor="siName">사이트명</label>
                            <input
                                type="text"
                                id="siName"
                                name="siName"
                                value={siName}
                                onChange={(e) => setSiName(e.target.value)}
                            />
                        </span>

                        {/* 버튼 */}
                        <span className="form-actions">
                            <button type="submit" className="searchBtn">검색</button>
                            <button type="button" className="btn line" onClick={onReset}>
                                검색조건 초기화
                            </button>
                        </span>
                    </form>
                </div>

                {/* 검색결과/페이지 사이즈 */}
                <ul className="titleBox">
                    <li className="result">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        검색결과 : {totalElements} 건
                    </li>
                    <li className="btnBox">
                        <select
                            className="baseDateInput"
                            value={size}
                            onChange={(e) => handleSizeChange(Number(e.target.value))}
                        >
                            <option value={10}>10개 보기</option>
                            <option value={30}>30개 보기</option>
                            <option value={50}>50개 보기</option>
                        </select>
                    </li>
                </ul>

                {/* 리스트 테이블 */}
                <div className="tableWrap">
                    <ResizableTable
                        columns={columns}
                        data={viewRows}
                        rememberKey="SiteInfo.columns"
                        minColWidth={50}
                        stickyFirst={false}
                        sortable={true}
                        // 빈행 제외, 키(__key: siDomain)로 상세조회
                        onRowClick={(row) => {
                            if (row?.__empty) return; //__ 내부 식별자 전용, 사용자가 보는 데이터가 아니라 내부 로직 전용 의미임.
                            handleRowClick(row?.__key); // 언더바(__)는 화면에 보여지는 데이터가 아님
                        }}
                    />
                </div>

                {/* 페이지네이션 */}
                <Pagination
                    currentPage={page}
                    size={size}
                    totalElements={totalElements}
                    onPageChange={handlePageChange}
                    onSizeChange={handleSizeChange}
                />
            </section>
        </>
    );
}
