/**
 * 관리자단 > 회원관리 > 비밀번호수정(UpdatePwd.jsx) 컴포넌트
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.0
 */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import DragResizeLayer from "@admin/components/common/DragResizeLayer";

export default function UpdatePwd(props) {

    const { layerContainerRef } = useOutletContext();       // 레이어 관련 상속
    const [ updatePwd, setUpdatePwd ] = useState(false);    // 비밀번호 수정 레이어 표시(노출)여부 상태

    /** ========================= 회원관리 > 비밀번호수정 UpdatePwd.jsx ================================== */
    return (
        <>
            <button type="button" id="updatePwdBtn" onClick={() => setUpdatePwd(true)}>비밀번호 수정</button>
            {/* ============== 1.DragResizeLayer(리사이징/드래그 레이어) 시작 =================== */}
            {/* 조건부 렌더링(conditional rendering) : {showList && ( ... )} --> showList가 true일 때만 <DragResizeLayer> 출력 */}
            { updatePwd && (
                <DragResizeLayer
                    layerContainerRef={layerContainerRef}
                    titleText="비밀번호 수정"
                    initialOffset={{ x: 0, y: 0 }}
                    onClose={() => setUpdatePwd(false)}
                    onCancel={() => setUpdatePwd(false)}
                    onSave={() => { alert("비밀번호 수정 완료!"); setUpdatePwd(false); }}
                >
                    <div style={{ padding: 8 }}>
                        <p>새로운 비밀번호를 입력하세요.</p>
                        <ul>
                            <li>
                                <span className="form-group">
                                    <label htmlFor="oldMPwd">기존 비밀번호</label>
                                    <input type="password" id="oldMPwd" name="oldMPwd" />
                                </span>
                            </li>
                            <li>
                                <span className="form-group">
                                    <label htmlFor="newMPwd">신규 비밀번호</label>
                                    <input type="password" id="newMPwd" name="newMPwd" />
                                </span>
                            </li>
                            <li>
                                <span className="form-group">
                                    <label htmlFor="newMPwd2">신규 비밀번호(확인)</label>
                                    <input type="password" id="newMPwd2" name="newMPwd2" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </DragResizeLayer>
            )}
        </>
    );
}//PlaceInfo.jsx end