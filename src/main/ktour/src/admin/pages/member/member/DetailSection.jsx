/**
 * 관리자단 > 회원관리 > 회원현황(member) > 상세정보(DetailSection.jsx) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.1
 */

import UpdatePwd from "@admin/pages/member/UpdatePwd"; // 비밀번호 수정 > 버튼/레이어 컴포넌트
import ResetPwd from "@admin/pages/member/ResetPwd";  // 비밀번호 초기화 > 버튼/레이어 컴포넌트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function DetailSection({ activeMember }) {

    const m = activeMember ?? {}; // 좌측(ListSection) 목록 테이블에서 선택된 회원정보(activeMember) 담기
    // const pushAgreedLabelMap = { true: "동의", false: "미동의" };     // 푸시알림동의(bool) = 문자열 데이터 변환
    // const locationAgreedLabelMap = { true: "동의", false: "미동의" }; // 위치기반동의(bool) = 문자열 데이터 변환
    // const termsAgreedLabelMap = { true: "동의", false: "미동의" };    // 이용약관동의(bool) = 문자열 데이터 변환

    console.log(activeMember); //확인용

    /** ============================ 회원현황(member) > 상세정보(DetailSection.jsx) ============================== */
    return (
        <>
            {/* <!-- 상세정보(CRUD) 시작 --> */}
            <section className="registWrap">
                {/* <!-- 탭/타이틀/버튼 시작 --> */}
                <div className="titleBox">
                    <ul className="tabtitle">
                        <li className="active">일반회원</li>
                        <li>사업자</li>
                        <li>단체/모임</li>
                    </ul>
                    <span className="btnBox">
                        <button type="button" className="btn line">신규등록</button>
                        <button type="button" className="btn line">삭제</button>
                        <button type="button" className="btn full">저장</button>
                    </span>
                </div>
                {/* <!--탭/타이틀/버튼 끝  --> */}

                {/* <!-- 탭/본문 상세정보 시작 --> */}
                <div className="formWrap member">
                    <form id="userForm" >
                        <fieldset>

                            <div className="form-group">
                                <label htmlFor="mType"><b>회원유형</b></label>
                                <select id="mType" name="memberTypeInput" value={m.mtype ?? ""} onChange={() => {}} >
                                    <option value="0">관리자</option>
                                    <option value="1">일반회원</option>
                                    <option value="2">사업자회원</option>
                                    <option value="3">단체/모임회원</option>
                                </select>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mName"><b>회원명</b></label>
                                    <strong>
                                        <input type="text" value={m.mname ?? ""} id="mName" className="mName" placeholder="김" required disabled />
                                    </strong>
                                </span>
                                <span className="form-group">
                                    <label htmlFor="mId"><b>회원ID</b></label>
                                    <input type="text" value={m.mid ?? ""} id="mId" name="mId" className="loginIdInput" placeholder="admin" autoComplete="username" disabled />
                                </span>

                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mNick"><b>닉네임</b></label>
                                    <input type="text" value={m.mnick ?? ""} id="mNick" placeholder="시스템관리자" className="long" />
                                </span>


                            </div>
                            <span className="form-group">
                                <label htmlFor="mPwd"><b>비밀번호</b></label>
                                <input type="password" id="mPwd" placeholder="*******" autoComplete="current-password" disabled />

                                {/* 비밀번호 수정 버튼/레이어 시작 */}
                                <UpdatePwd />
                                {/* 비밀번호 수정 버튼/레이어 끝 */}

                                {/* 비밀번호 초기화 버튼/레이어 시작 */}
                                <ResetPwd />
                                {/* 비밀번호 초기화 버튼/레이어 끝 */}

                            </span>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="mGender"><b>성별</b></label>
                                    <select id="mGender" name="mGender" value={m.mgender ?? ""} onChange={() => {}} >
                                        <option value="남">남성</option>
                                        <option value="여">여성</option>
                                    </select>
                                </span>
                                <span className="form-group">
                                    <label htmlFor="mPhone"><b>휴대전화</b></label>
                                    <input type="text" value={m.mphone ?? ""}  id="mPhone" placeholder="010-0000-0000" required />
                                </span>

                                <span className="form-group">
                                    <label htmlFor="mEmail"><b>이메일</b></label>
                                    <input type="text" value={m.memail ?? ""} id="mEmail" name="mEmail" placeholder="root.kjs82@gmail.com" required className="long" />
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="zipCodeInput"><b>기본주소</b></label>
                                    <button type="button" id="zipCodeBtn">우편번호</button>
                                    <input type="text" value={m.zipCode ?? ""} id="zipCodeInput" name="zipCodeInput" placeholder="우편번호" />
                                    <input type="text" value={m.maddr1 ?? ""} id="mAdd1" name="mAdd1" placeholder="기본주소" />
                                </span>
                            </div>
                            <div>
                                <span className="form-group">
                                    <label htmlFor="zipCodeInput"><b>상세주소</b></label>
                                    <input type="text" value={m.maddr2 ?? ""} id="addrDetailInput" name="addrDetailInput" placeholder="상세주소" className="long" />
                                </span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="memoInput"><b>이슈/메모</b></label>
                                <textarea id="memoInput" value={m.memo ?? ""} className="memoInput" placeholder="이슈/메모"></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="termsInput"><b>이용약관</b></label>
                                <select id="termsInput" className="memberTypeInput" value={m.mtermsAgreed?? ""} onChange={() => {}} >
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="locationInput"><b>위치정보</b></label>
                                <select id="locationInput" className="memberTypeInput" value={m.mlocationAgreed ?? ""} onChange={() => {}} >
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pushInput"><b>푸시알림</b></label>
                                <select id="pushInput" className="memberTypeInput" value={m.mpushAgreed ?? ""} onChange={() => {}} >
                                    <option value="1">동의</option>
                                    <option value="2">비동의</option>
                                </select>
                            </div>
                            <div className="info_date">
                                <FontAwesomeIcon icon={faCircleInfo} />
                                <b>가입일:</b> {m.createdAt?? "--"}
                                <b>수정일:</b> {m.updatedAt ?? "--"}
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