/**
 * 관리자단 > 회원관리 > 관리자현황(manage) > 검색리스트단(ListSection.jsx) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.1
 */

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Pagination from "@admin/components/admin/place/Pagination";
import ResizableTable from "@admin/components/common/ResizableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function ListSection(props) {

    const columns = [
        { id: "no", title: "No", width: 70 },
        { id: "mgAuth", title: "관리자유형", width: 110 },
        { id: "siName ", title: "사이트명", width: 200 },
        { id: "mName", title: "관리자명", width: 120 },
        { id: "mId", title: "관리자ID", width: 140 },
        { id: "mPhone", title: "휴대전화", width: 260 },
        { id: "createdAt", title: "가입일", width: 120 },
        { id: "updatedAt", title: "최종로그인", width: 120 },
    ];

    const data = [
        { no: 1, mgAuth: "시스템관리자", siName: "K-TOUR", mName: "김진숙", mId: "admin", mPhone: "010-1234-5678", createdAt: "2025-10-27", updatedAt: "2025-10-27 10:32:00" }
    ];


    /** =========================================== 관리자현황 > 검색리스트단 ListSection.jsx ====================================== */
    return (
        <>
            {/* <!-- [좌측] 검색/리스트 시작 --> */}
            <section className="listWrap">
                {/* <!-- 관리자현황 조건검색창 시작 --> */}
                <div className="detailSearch">
                    <form aria-label="관리자현황 조건검색">
                        {/* 1.관리자유형 */}
                        <span className="form-group">
                            <label htmlFor="mgAuth">관리자유형</label>
                            <select id="mgAuth" name="mgAuth">
                                <option value="">전체</option>
                                <option value="1">시스템관리자</option>
                                <option value="2">업체관리자</option>
                            </select>
                        </span>
                        {/* 2.관리자명 */}
                        <span className="form-group">
                            <label htmlFor="mName">관리자명</label>
                            <input type="text" id="mName" name="mName" />
                        </span>
                        {/* 3.관리자ID */}
                        <span className="form-group">
                            <label htmlFor="mId">관리자ID</label>
                            <input type="text" id="mId" name="mId" />
                        </span>
                        {/* 4.휴대전화 */}
                        <span className="form-group">
                            <label htmlFor="mPhone">휴대전화</label>
                            <input type="text" id="mPhone" name="mPhone" />
                        </span>
                        {/* 5.검색 버튼*/}
                        <span className="form-actions">
                            <button type="button" className="searchBtn">검색</button>
                            <button type="button" className="btn line">검색조건 초기화</button>
                        </span>
                    </form>
                </div>
                {/* <!-- 관리자현황 조건검색창 끝 --> */}

                {/* <!-- 목록(리스트) 테이블 시작 --> */}
                <ul className="titleBox">
                    <li className="result">검색결과 : @@개</li>
                    <li className="btnBox">
                        <select className="baseDateInput">
                            <option value="10">10개 보기</option>
                            <option value="30">30개 보기</option>
                            <option value="50">50개 보기</option>
                        </select>
                        {/* <button type="button" className="btn line">엑셀 다운로드</button>*/}
                        {/* <button className="btn full" >레이어1</button> */}
                    </li>
                </ul>
                {/* === ResizableTable(리사이징/드래그  테이블) 시작 === */}
                <div className="tableWrap">
                    <ResizableTable
                        columns={columns}
                        data={data}
                        rememberKey="Manager.columns"
                        minColWidth={80}
                        stickyFirst={false}
                        sortable={true}
                    />
                </div>
                {/* === ResizableTable(리사이징/드래그  테이블) 끝 ===== */}
            </section>
            {/* <!-- [좌측] 검색/리스트 끝 --> */}


        </>
    );
}// ListSection.jsx end