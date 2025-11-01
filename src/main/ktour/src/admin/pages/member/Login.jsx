/**
 * 관리자단 > 회원관리 > 관리자 로그인 페이지 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.16
 * @version 0.1.2
 */
import { Link, useNavigate } from "react-router-dom";              
import "@assets/admin/css/login.css"; // login.css
export default function Login(props) {

    const navigate = useNavigate(); // useNavigate 훅 호출

    /** 관리자 로그인 메소드 */
    const loginAdmin = () => {
        console.log("loginAdmin >> ");

        // 1. navigate 함수를 호출하여 원하는 경로로 이동
        navigate('/admin/map/place_info'); // 관리자단 > 관광정보관리 > 플레이스현황 페이지 이동

    };//loginAdmin end


/** ======================================== Login.jsx 영역 ==============================================  */
    return <>
        {/* <!-- login > header start --> */}
        <div className="loginWrap">
            <header className="loginWrap">
                <h1 className="logo">
                    <Link to="/"  title="K-TOUR 홈으로 이동">
                        <strong className="logo">K-TOUR</strong><span>테마형 관광지도 플랫폼</span>
                    </Link>
                </h1>
            </header>
            {/* <!-- login > header end --> */}
            <main>
                <div className="loginBox">
                    <h2>관리자 로그인</h2>
                    {/* <!-- 로그인 입력폼 시작 --> */}
                    <form action="#" method="post">
                        <section>
                            <input type="text" id="loginIDInput" name="loginIDInput" required placeholder="아이디" />
                            <input type="text" id="pwdInput" name="pwdInput" required placeholder="비밀번호" />
                            <button type="button" onClick={loginAdmin} className="selected">LOGIN</button>
                        </section>
                        {/* <!-- 로그인 입력폼 끝 --> */}
                        <section>
                            <a href="#">아이디 찾기</a>
                            <a href="#">비밀번호 찾기</a>
                        </section>
                    </form>
                </div>
            </main>
            {/* <!-- login > footer start --> */}
            <footer>
                <ul className="footerMenu">
                    <li>
                        <Link to="/" className="btn" title="K-Tour 홈으로 이동">K-TOUR</Link>
                    </li>
                    <li><a href="#">솔루션문의</a></li>
                    <li><a href="#">구독신청</a></li>
                </ul>
                <small>&copy; 2025 Root.Lab</small>
            </footer>
        </div>
        {/* <!-- login > footer end --> */}
    </>
}// Login.jsx end