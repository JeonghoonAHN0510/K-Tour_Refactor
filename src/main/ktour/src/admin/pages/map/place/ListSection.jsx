/**
  * ListSection: PlaceInfo 좌측 목록/검색 패널
 *
 * 역할 개요
 * - 검색 폼: 콘텐츠유형, 노출상태, 카테고리, 지역, 주소 키워드, 장소명, 장소번호
 * - 결과 목록: 테이블(사이즈 조절 가능), 행 클릭으로 상세 조회
 * - 페이징: 페이지/페이지크기 변경 시 목록 재조회
 *
 * 상태/스토어
 * - 로컬 상태: 검색 입력값(category, region, ctNo, showVal, title, phone, pNo, addressInput),
 *              화면용 목록 rows, page, size, totalElements
 * - 전역 스토어(placeSlice): rows, total, page, size, filters를 보관
 *   - 페이지 이탈 후 복귀 시 상태를 유지하기 위해 fetchPlaceList는 파라미터 미지정 시
 *     스토어의 filters, page, size를 사용
 *
 * 주요 액션
 * - onSearch: 로컬 입력값 → filters로 정규화/저장 → page=1 → fetchPlaceList()
 * - onReset: 로컬 입력값과 화면 목록만 초기화
 * - onRowClick: 선택 행의 pno로 fetchPlaceDetail() 디스패치, onPick 콜백도 호환 유지
 * - onPageChange/onSizeChange: 전역 page/size 갱신 후 fetchPlaceList()
 *
 * 주의사항
 * - onReset은 전역 filters를 지우지 않습니다. 완전 초기화를 원하면 setListFilters(null) 추가 고려
 * - pno 키는 pno/pNo/PNO가 혼재할 수 있어 안전하게 병합 추출
 */

import ResizableTable from "../../../components/admin/place/ResizableTableAtplace";
import "@assets/admin/css/resizableTable.css";
import CategorySelect from "../../../components/admin/place/CategorySelect";
import RegionSelect from "../../../components/admin/place/RegionSelect";
import Pagination from "../../../components/admin/place/Pagination";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPlaceDetail,
    fetchPlaceList,
    setListFilters,
    setPage as setPageAction,
    setSize as setSizeAction,
} from "@admin/store/placeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


export default function ListSection(props) {
    const dispatch = useDispatch();
    const placeStore = useSelector((s) => s.place || {});

    // 검색 상태(로컬 입력값)
    const [category, setCategory] = useState({ ccNo: null, l1Cd: null, l2Cd: null, l3Cd: null, l1Nm: null, l2Nm: null, l3Nm: null });
    const [region, setRegion] = useState({ ldNo: null, regnCd: null, signguCd: null, regnNm: null, signguNm: null });
    const [ctNo, setCtNo] = useState("");
    const [showVal, setShowVal] = useState("1");
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [pNo, setPNo] = useState("");
    const [addressInput, setAddressInput] = useState("");

    // 목록 표시 상태(스토어 동기화)
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        if (Array.isArray(placeStore.rows)) setRows(placeStore.rows);
        if (typeof placeStore.total === "number") setTotalElements(placeStore.total);
        if (placeStore.page) setPage(placeStore.page);
        if (placeStore.size) setSize(placeStore.size);
    }, [placeStore.rows, placeStore.total, placeStore.page, placeStore.size]);

    const onRegionChange = (v) => setRegion(v);

    const ccName = category.l3Nm || category.l2Nm || category.l1Nm || null;
    const ldName = region.regnNm && region.signguNm ? `${region.regnNm} ${region.signguNm}` : region.regnNm || null;

    /**
    * 검색 실행 핸들러
    * - 로컬 입력값을 서버 검색 파라미터로 정규화(params)
    * - 전역 filters 저장 → page 1로 초기화 → fetchPlaceList() 호출
    */
    const onSearch = async (e) => {
        const params = {
            title: title?.trim() || null,
            address: ldName || (addressInput?.trim() || null),
            ccName,
            ctNo: ctNo || null,
            showflag: showVal === "" ? null : Number(showVal),
            pNo: pNo || null,
        };
        Object.keys(params).forEach((k) => (params[k] === null || params[k] === "") && delete params[k]);
        dispatch(setListFilters(params));
        dispatch(setPageAction(1));
        dispatch(fetchPlaceList(undefined));
    };

    /**
     * 입력값 초기화
     * - 로컬 입력값과 화면 목록만 리셋합니다.
     * - 전역 filters까지 초기화하려면 setListFilters(null) 추가를 고려하세요.
     */
    const onReset = () => {
        setCategory({ ccNo: null, l1Cd: null, l2Cd: null, l3Cd: null, l1Nm: null, l2Nm: null, l3Nm: null });
        setRegion({ ldNo: null, regnCd: null, signguCd: null, regnNm: null, signguNm: null });
        setCtNo("");
        setShowVal("");
        setTitle("");
        setPhone("");
        setPNo("");
        setAddressInput("");
        setRows([]);
        setPage(1);
    };

    // 테이블 컬럼 정의: id는 데이터 키, title은 헤더 라벨, width는 최소 폭
    // 주의: 일부 백엔드 응답에서 키 대소문자(pno/pNo/PNO)가 혼재할 수 있습니다.
    const columns = [
        { id: "no", title: "No", width: 30 },
        { id: "pno", title: "플레이스번호", width: 90 },
        { id: "title", title: "플레이스명", width: 150 },
        { id: "contentTypeName", title: "콘텐츠타입", width: 100 },
        { id: "lclsSystm3Nm", title: "카테고리", width: 120 },
        { id: "addr1", title: "주소", width: 260 },
        { id: "tel", title: "전화번호", width: 140 },
    ];

    const activeEnter = (e) => { if (e.key === "Enter") onSearch(); };

    // 테이블 표시용 행에 No 컬럼 주입(페이지 기준 시작 번호부터 연속 번호)
    const rowsForTable = useMemo(() => {
        const start = (Number(page) - 1) * Number(size) + 1;
        return Array.isArray(rows)
            ? rows.map((r, i) => ({ ...r, no: start + i }))
            : [];
    }, [rows, page, size]);

    return (
        <>
            {/* [좌측] 검색/리스트 */}
            <section className="listWrap">
                {/* 검색영역 */}
                <div className="detailSearch">
                    <form aria-label="장소 조건 검색" onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
                        {/* 1. 콘텐츠유형 */}
                        <div className="form-group">
                            <label htmlFor="content-type">콘텐츠유형</label>
                            <select id="content-type" name="contentType" value={ctNo} onChange={(e) => setCtNo(e.target.value)}>
                                <option value="">전체</option>
                                <option value="1">관광지</option>
                                <option value="2">문화시설</option>
                                <option value="3">축제/공연/행사</option>
                                <option value="4">여행코스</option>
                                <option value="5">레포츠</option>
                                <option value="6">숙박</option>
                                <option value="7">쇼핑</option>
                                <option value="8">음식점</option>
                            </select>
                        </div>

                        {/* 2. 노출 상태 */}
                        <div className="form-group">
                            <label htmlFor="exposure-status">노출 상태</label>
                            <select id="exposure-status" name="exposureStatus" value={showVal} onChange={(e) => setShowVal(e.target.value)}>
                                <option value="">전체</option>
                                <option value="1">노출</option>
                                <option value="0">비노출</option>
                            </select>
                        </div>

                        {/* 3. 카테고리 (다단 선택) */}
                        <div className="form-group">
                            <CategorySelect value={category} onChange={setCategory} />
                        </div>

                        {/* 4. 지역(시/군/구) */}
                        <div className="form-group">
                            <RegionSelect value={region} onChange={onRegionChange} />
                        </div>

                        {/* 5. 주소 키워드 */}
                        <div className="form-group">
                            <label htmlFor="address-keyword">주소</label>
                            <input type="text" id="address-keyword" name="addressKeyword" value={addressInput} onChange={(e) => setAddressInput(e.target.value)} onKeyDown={activeEnter} />
                        </div>

                        {/* 6. 장소명 */}
                        <div className="form-group">
                            <label htmlFor="place-name">장소명</label>
                            <input type="text" id="place-name" name="placeName" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={activeEnter} />
                        </div>

                        {/* 7. 장소번호 */}
                        <div className="form-group">
                            <label htmlFor="place-number">장소 번호</label>
                            <input type="number" id="place-number" name="placeNumber" value={pNo} onChange={(e) => setPNo(e.target.value)} onKeyDown={activeEnter} />
                        </div>

                        {/* 8. 버튼 */}
                        <div className="form-actions">
                            <button type="button" className="searchBtn" onClick={onSearch}>검색</button>
                            <button type="button" className="btn line" onClick={onReset}>초기화</button>
                        </div>
                    </form>
                </div>

                {/* 리스트 영역 */}
                <ul className="titleBox">
                    <li className="result"><FontAwesomeIcon icon={faMagnifyingGlass} />검색결과 : {totalElements} 건</li>
                    <li className="btnBox">
                        <select
                            className="baseDateInput"
                            value={size}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                setSize(v); setPage(1);
                                dispatch(setSizeAction(v));
                                dispatch(setPageAction(1));
                                dispatch(fetchPlaceList(undefined));
                            }}
                        >
                            <option value={10}>10개 보기</option>
                            <option value={30}>30개 보기</option>
                            <option value={50}>50개 보기</option>
                        </select>
                        <button type="button" className="btn line">엑셀 다운로드</button>
                    </li>
                </ul>

                <div className="tableWrap">
                    <ResizableTable
                        columns={columns}
                        data={rowsForTable}
                        rememberKey="PlaceInfo.columns"
                        minColWidth={50}
                        stickyFirst={false}
                        sortable={true}
                        onRowClick={(row) => {
                            const pno = row?.pno ?? row?.pNo ?? row?.PNO;
                            if (pno) dispatch(fetchPlaceDetail(Number(pno)));
                            props?.onPick?.(row);
                        }}
                    />
                </div>

                <Pagination
                    currentPage={page}
                    size={size}
                    totalElements={totalElements}
                    onPageChange={(p) => { setPage(p); dispatch(setPageAction(p)); dispatch(fetchPlaceList(undefined)); }}
                    onSizeChange={(sz) => { setSize(sz); setPage(1); dispatch(setSizeAction(sz)); dispatch(setPageAction(1)); dispatch(fetchPlaceList(undefined)); }}
                />
            </section>
        </>
    );
}


