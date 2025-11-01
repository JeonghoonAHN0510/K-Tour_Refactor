/**
 * 관리자단 > 회원관리 > 회원현황(member) > 검색리스트단(ListSection.jsx) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.4
 */
import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import Pagination from "@admin/components/admin/place/Pagination";
import ResizableTable from "@admin/components/common/ResizableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function ListSection({ activeMember, setActiveMember, selectedMid, setSelectedMid }) {
    const [mType, setMType] = useState("");                 // 검색 필터 상태(회원유형)
    const [mName, setMName] = useState("");                 // 검색 필터 상태(회원명)
    const [mId, setMId] = useState("");                     // 검색 필터 상태(회원ID)
    const [mPhone, setMPhone] = useState("");               // 검색 필터 상태(휴대폰번호)

    const [rows, setRows] = useState([]);                   // 검색 결과 테이블 데이터
    const [size, setSize] = useState(10);                   // 페이지네이션 / 기본 10
    const [page, setPage] = useState(1);                    // 페이지네이션 붙일 때 업데이트 / 기본 1 
    const [totalElements, setTotalElements] = useState(0);  // 검색결과 레코드 수
    const EMPTY_FLAG = [{ __empty: true }];                 // 검색결과 빈 행(row) 처리

    const [searched, setSearched] = useState(false);        // 검색 상태
// const [selectedMid, setSelectedMid] = useState(null);    // 테이블에서 어떤 행이 선택되었는지 표시상태 (active 클래스)
// const [activeMember, setActiveMember] = useState(null);  // 우측(Detail) > 상세 폼에 입력값 채울 선택된 회원정보 데이터
   
    const typeLabelMap = { 0: "관리자", 1: "일반회원", 2: "사업자", 3: "단체/모임" }; // 회원유형(int) = 문자열 데이터 변환
    const genderLabelMap = { "남": "남성", "여": "여성" };          // 성별(enum) = 문자열 데이터 변환

    //** [1] 스프링 서버로부터 데이터 요청 > 검색 실행 핸들러  */
    const onSearch = useCallback(async (e) => {
        try {
            e?.preventDefault?.(); // 이벤트 객체 e가 존재할 때만 preventDefault() 를 실행하는 안전 호출(safe call) 문법
            const params = {
                mType: mType || null,
                mName: mName || null,
                mId: mId || null,
                mPhone: mPhone || null,
                size,
                page,
            };
            Object.keys(params).forEach((k) => params[k] == null && delete params[k]);

            const { data } = await axios.get("http://localhost:8080/member/search", { params });

            // 회원정보 데이터 담기
            const list = Array.isArray(data) ? data : [];
            const total = list.length;
            setTotalElements(total);
            // offset 정의 (1페이지=1 기준)
            const offset = (page - 1) * size;
            const pageSlice = list.slice(offset, offset + size);

            // 검색결과가 없는 경우처리
            if (pageSlice.length === 0) {
                setRows(EMPTY_FLAG);
                setSelectedMid(null);
                setSearched(true);
                return;
            }
            const rowsMapped = pageSlice.map((r, idx) => ({
                no: offset + idx + 1,
                mType: typeLabelMap[Number(r.mtype)] ?? "-",
                mName: <strong>{r.mname}</strong>,
                mNick: r.mnick,
                mId: r.mid,
                mid: r.mid, // onRowClick(row.mid) 때문에 추가
                //mGender: r.mgender,
                mGender: genderLabelMap[r.mgender] ?? "-",
                mPhone: r.mphone,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })); // console.log("rowsMapped:", rowsMapped); 
            setRows(rowsMapped);
            setSearched(true);
            if (rowsMapped.length > 0) {
                setSelectedMid(rowsMapped[0].mid);
                handleRowClick(rowsMapped[0].mid); // 선택된 회원 상세까지 자동 조회
            }
        } catch (error) {
            console.error("[onSearch] 검색 실패!");
            setRows(EMPTY_FLAG);     // 실패 시에도 한 줄 메시지 보이기
            setTotalElements(0);
            setSearched(true);
        }
    }, [mName, mId, mPhone, page, size, setSelectedMid]);

    //** [2] 검색결과 테이블 선택된 행(setActiveMember) 데이터 호출 */
    const handleRowClick = async (mid) => {
        try {
            setSelectedMid(mid);
            const { data } = await axios.get("http://localhost:8080/member/search", {
                params: { mId: mid },
            });
            const item = Array.isArray(data) ? (data[0] ?? null) : data;
            setActiveMember(item);
        } catch (err) {
            console.error("[detail] 실패:", err);
            setActiveMember(null);
        }
    };

    useEffect(() => {
        // console.log("activeMember:", activeMember); // !선택된 회원 데이터 행 확인용!
    }, [activeMember]);

    // 추가: selectedMid가 바뀌면 항상 반영되는 화면용 rows
    const viewRows = useMemo(() => {
        if (rows.length === 1 && rows[0]?.__empty) return rows;  // 빈행(“검색결과 없음”)은 그대로 통과
        return rows.map(r => ({ ...r, _active: selectedMid === r.mid }));
    }, [rows, selectedMid]);

    //** [3] 검색조건 초기화 핸들러 */
    const onReset = () => { setMType(""); setMName(""); setMId(""); setMPhone(""); };

    //** [3] 테이블 해더 컬럼명  */
    const columns = [
        { id: "no", title: "No", width: 30 },
        { id: "mType", title: "회원유형", width: 80 },
        { id: "mName", title: "회원명", width: 80 },
        { id: "mNick", title: "닉네임", width: 100 },
        { id: "mId", title: "회원ID", width: 100 },
        { id: "mGender", title: "성별", width: 60 },
        { id: "mPhone", title: "휴대전화", width: 110 },
        { id: "createdAt", title: "가입일", width: 120 },
        { id: "updatedAt", title: "최종로그인", width: 120 },
    ];

    // 페이지 변경/개수 변경 시
    const handlePageChange = (p) => setPage(p);
    const handleSizeChange = (s) => { setSize(s); setPage(1); };// 사이즈 바꾸면 1페이지로

    // useEffect로 페이지 전환 시 자동 재조회
    useEffect(() => { onSearch(); }, [page, size, onSearch]);

    // 전체 비우기(*주의 : 개발 중일 때만 사용할 것)
    //localStorage.clear();

    /** ========================= 회원현황(member) > 검색/리스트 ListSection.jsx =============================== */
    return (
        <>
            {/* <!-- [좌측] 검색/리스트 시작 --> */}
            <section className="listWrap">
                {/* <!-- 회원현황 조건검색창 시작 --> */}
                <div className="detailSearch member">
                    <form aria-label="회원현황 조건검색" onSubmit={onSearch}>
                        {/* 1.회원유형 */}
                        <span className="form-group">
                            <label htmlFor="member_mType">회원유형</label>
                            <select id="member_mType" name="mType" value={mType} onChange={(e) => setMType(e.target.value)}>
                                <option value="">전체</option>
                                <option value="0">관리자</option>
                                <option value="1">일반회원</option>
                                <option value="2">사업자</option>
                                <option value="3">단체/모임</option>
                            </select>
                        </span>
                        {/* 2.회원명 */}
                        <span className="form-group">
                            <label htmlFor="member_mName">회원명</label>
                            <input type="text" id="member_mName" name="mName" value={mName} onChange={(e) => setMName(e.target.value)} />
                        </span>
                        {/* 3.회원ID */}
                        <span className="form-group">
                            <label htmlFor="member_mId">회원ID</label>
                            <input type="text" id="member_mId" name="mId" value={mId} onChange={(e) => setMId(e.target.value)} />
                        </span>
                        {/* 4.휴대전화 */}
                        <span className="form-group">
                            <label htmlFor="member_mPhone">휴대전화</label>
                            <input type="text" id="member_mPhone" name="mPhone" value={mPhone} onChange={(e) => setMPhone(e.target.value)} />
                        </span>
                        {/* 5.검색 버튼*/}
                        <span className="form-actions">
                            <button type="submit" className="searchBtn" >검색</button>
                            <button type="button" className="btn line" onClick={onReset} >검색조건 초기화</button>
                        </span>
                    </form>
                </div>
                {/* <!-- 회원현황 조건검색창 끝 --> */}

                {/* <!-- 목록(리스트) 테이블 시작 --> */}
                <ul className="titleBox">
                    <li className="result"> <FontAwesomeIcon icon={faMagnifyingGlass} />검색결과 : {totalElements} 건</li>
                    <li className="btnBox">
                        <select className="baseDateInput"
                            value={size}
                            onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}  // 페이지도 1로 리셋
                        >
                            <option value={10}>10개 보기</option>
                            <option value={30}>30개 보기</option>
                            <option value={50}>50개 보기</option>
                        </select>
                        {/* <button type="button" className="btn line">엑셀 다운로드</button>*/}
                        {/* <button className="btn full" >레이어1</button> */}
                    </li>
                </ul>
                {/* === ResizableTable(리사이징/드래그 테이블) 시작 === */}
                <div className="tableWrap">
                    <ResizableTable
                        columns={columns}
                        data={viewRows}
                        rememberKey="Member.columns"
                        minColWidth={50}
                        stickyFirst={false}
                        sortable={true}
                        onRowClick={(row) => !row.__empty && row.mid && handleRowClick(row.mid)}// 빈행이 아니고 mid 존재한다면 상세조회 실행
                    />
                </div>
                {/* === ResizableTable(리사이징/드래그  테이블) 끝 ===== */}
                <Pagination
                    currentPage={page}
                    size={size}
                    totalElements={totalElements}
                    onPageChange={handlePageChange}
                    onSizeChange={handleSizeChange}
                />
            </section>
            {/* <!-- [좌측] 검색/리스트 끝 --> */}

        </>
    );
}// ListSection.jsx end