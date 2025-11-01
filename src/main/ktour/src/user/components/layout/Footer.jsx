/**
 * 사용자단(비회원) > 공통레이아웃 > 푸터 컴포넌트
 *
 * @author 
 * @since 2025.10.17
 * @version 0.1.1
 */
import { Link } from "react-router-dom";
import "@assets/user/css/footer.css";   // footer.css

export default function Footer(props) {
    return (
        <>
           <div className="footerWrap">
                <footer>
                    <p className="copyright" >  © 2025 <Link to="/admin/login">Root.Lab</Link></p>
                </footer>
            </div>
        </>
    );
}//Footer.jsx end