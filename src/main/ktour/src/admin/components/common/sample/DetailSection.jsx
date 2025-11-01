/**
 * 관리자단 > 공통컴포넌트(레이어, 테이블 등) > 샘플사용(Sample) > (우측) 상세정보 DetailSection.jsx
 *
 * @author kimJS
 * @since 2025.10.26
 * @version 0.1.0
 */


export default function DetailSection(props) {

/** ============================ [본문 우측] 상세정보(CRUD) ============================== */
    return (
        <>
            {/* <!-- 상세정보(CRUD) 시작 --> */}
            <section className="registWrap">
                {/* <!-- 탭/타이틀/버튼 시작 --> */}
                <div className="titleBox">
                    <ul className="tabtitle">
                        <li className="active">탭1</li>
                        <li>탭2</li>
                        <li>탭3</li>
                    </ul>
                    <span className="btnBox">
                        <button type="button" className="btn full">저장</button>
                        <button type="button" className="btn line">삭제</button>
                        <button type="button" className="btn line">신규등록</button>
                    </span>
                </div>
                {/* <!--탭/타이틀/버튼 시작  --> */}

                {/* <!-- 상세정보 1.2.3.입/출력 시작 --> */}
                <div className="formWrap">

                </div>
                {/* <!-- 상세정보 1.2.3.입/출력 끝 --> */}
            </section>
            {/* <!-- 상세정보(CRUD) 끝 --> */}
        </>
    );
}// DetailSection.jsx end