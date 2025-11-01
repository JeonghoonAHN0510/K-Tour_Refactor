/**
 * 관리자단 > 회원관리 > 비밀번호 초기화(ResetPwd.jsx) 컴포넌트
 * @author kimJS
 * @since 2025.10.27
 * @version 0.1.0
 */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import DragResizeLayer from "@admin/components/common/DragResizeLayer";

export default function UpdatePwd(props) {

    const { layerContainerRef } = useOutletContext();     // 레이어 관련 상속
    const [ resetPwd, setResetPwd ] = useState(false);    // 비밀번호 수정 레이어 표시(노출)여부 상태

    /** ========================= 회원관리 > 비밀번호수정 ResetPwd.jsx ================================== */
    return (
        <>
            <button type="button" id="resetPwdBtn" onClick={() => setResetPwd(true)}>비밀번호 초기화</button>
            {/* ============== 1.DragResizeLayer(리사이징/드래그 레이어) 시작 =================== */}
            {/* 조건부 렌더링(conditional rendering) : {showList && ( ... )} --> showList가 true일 때만 <DragResizeLayer> 출력 */}
            { resetPwd && (
                <DragResizeLayer
                    layerContainerRef={layerContainerRef}
                    titleText="비밀번호 초기화"
                    initialOffset={{  x: -100, y: -50 }}
                    onClose={() => setResetPwd(false)}
                    onCancel={() => setResetPwd(false)}
                    onSave={() => { alert("비밀번호(1234) 초기화 완료!"); setResetPwd(false); }}
                >
                    <div style={{ padding: 8 }}>
                        <p>초기화 비밀번호를 입력하세요.</p>
                        <ul>
                            <li>
                                <span className="form-group">
                                    <label htmlFor="resetMPwd">초기화 비밀번호</label>
                                    <input type="password" id="resetMPwd" name="newMPwd" />
                                </span>
                            </li>
                            <li>
                                <span className="form-group">
                                    <label htmlFor="resetMPwd">초기화 비밀번호(확인)</label>
                                    <input type="password" id="resetMPwd" name="newMPwd" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </DragResizeLayer>
            )}
        </>
    );
}//PlaceInfo.jsx end