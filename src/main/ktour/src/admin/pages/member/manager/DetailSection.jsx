/**
 * 관리자단 > 회원관리 > 관리자현황(manage) > 상세정보(DetailSection.jsx) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.26
 * @version 0.1.0
 */

import UpdatePwd from "@admin/pages/member/UpdatePwd"; // 비밀번호 수정 > 버튼/레이어 컴포넌트
import ResetPwd from "@admin/pages/member/ResetPwd";  // 비밀번호 초기화 > 버튼/레이어 컴포넌트

export default function DetailSection(props) {

    /** ============================ 관리자현황(manage) > 상세정보(DetailSection.jsx) ============================== */
    return (
        <>
            {/* <!-- 상세정보(CRUD) 시작 --> */}
            <section className="registWrap">
                {/* <!-- 탭/타이틀/버튼 시작 --> */}
                <div className="titleBox">
                    <ul className="tabtitle">
                        <li className="active">관리자정보</li>
                    </ul>
                    <span className="btnBox">
                        <button type="button" className="btn line">신규등록</button>
                        <button type="button" className="btn line">삭제</button>
                        <button type="button" className="btn full">저장</button>
                    </span>
                </div>
                {/* <!--탭/타이틀/버튼 끝  --> */}

                {/* <!-- 탭/본문 상세정보 시작 --> */}
                <div className="formWrap">
                    <form id="userForm" method="post">
                        <fieldset>

                            <div className="form-group">
                                <label htmlFor="mgAuth"><b>관리자유형</b></label>
                                <select id="mgAuth" name="memberTypeInput">
                                    <option value="1">시스템관리자</option>
                                    <option value="2">업체관리자</option>
                                </select>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="siNo "><b>사이트명</b></label>
                                    <input type="text" id="siNo"  placeholder="K-Tour" disabled />
                                </span>

                                <span className="form-group">
                                    <label htmlFor="domainInput"><b>도메인주소</b></label>
                                    <input type="text" id="domainInput" className="loginIdInput" placeholder="rootlab.kr" disabled />
                                    <button type="button" id="domainBtn">바로가기</button>
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mName"><b>관리자명</b></label>
                                    <input type="text" id="mName" className="mName" placeholder="김진숙" required disabled />
                                </span>

                                <span className="form-group">
                                    <label htmlFor="mNick"><b>닉네임</b></label>
                                    <input type="text" id="mNick" placeholder="시스템관리자" disabled />
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mId"><b>관리자ID</b></label>
                                    <input type="text" id="mId" className="loginIdInput" placeholder="admin" disabled />
                                </span>

                                <span className="form-group">
                                    <label htmlFor="mGender"><b>성별</b></label>
                                    <select id="mGender" name="mGender">
                                        <option value="남">남성</option>
                                        <option value="여">여성</option>
                                    </select>
                                </span>
                            </div>
                            <span className="form-group">
                                <label htmlFor="mPwd"><b>비밀번호</b></label>
                                <input type="password" id="mPwd" placeholder="*******" disabled />

                                {/* 비밀번호 수정 버튼/레이어 시작 */}
                                <UpdatePwd />
                                {/* 비밀번호 수정 버튼/레이어 끝 */}

                                {/* 비밀번호 초기화 버튼/레이어 시작 */}
                                <ResetPwd />
                                {/* 비밀번호 초기화 버튼/레이어 끝 */}

                            </span>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mPhone"><b>휴대전화</b></label>
                                    <input type="number" id="mPhone" placeholder="010-0000-0000" required />
                                </span>

                                <span className="form-group">
                                    <label htmlFor="mEmail"><b>이메일</b></label>
                                    <input type="text" id="mEmail" name="mEmail" placeholder="root.kjs82@gmail.com" required />
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="zipCodeInput"><b>기본주소</b></label>
                                    <button type="button" id="zipCodeBtn">우편번호</button>
                                    <input type="text" id="zipCodeInput" name="zipCodeInput" placeholder="우편번호" />
                                    <input type="text" id="mAdd1" name="mAdd1" placeholder="주소" />
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="zipCodeInput"><b>상세주소</b></label>
                                    <input type="text" id="addrDetailInput" name="addrDetailInput" placeholder="상세주소" />
                                </span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="memoInput"><b>이슈/메모</b></label>
                                <textarea id="memoInput" className="memoInput" placeholder="이슈/메모"></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="termsInput"><b>이용약관</b></label>
                                <select id="termsInput" className="memberTypeInput">
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="locationInput"><b>위치정보</b></label>
                                <select id="locationInput" className="memberTypeInput">
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pushInput"><b>푸시알림</b></label>
                                <select id="pushInput" className="memberTypeInput">
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>
                            <div className="info_date">
                                <b>등록일:</b>2025-00-00 (00:00:00)
                                <b>수정일:</b>2025-00-00 (00:00:00)
                            </div>
                        </fieldset>
                    </form>
                </div>
                {/* <!-- 탭/본문 상세정보 끝 --> */}
            </section>
            {/* <!-- 상세정보(CRUD) 끝 --> */}
        </>
    );
}// DetailSection.jsx end