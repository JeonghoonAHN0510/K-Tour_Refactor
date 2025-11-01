import { Link } from "react-router-dom";
/**
 * 404 Not Found 컴포넌트 : 존재하지 않는 페이지 요청시 노출 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.18
 * @version 0.1.0
 */

export default function NotPound404( props ){

// -------------------------------------- 404 > jsx 영역--------------------------------------
    return(<>
        <h1> 404 Not Found </h1>
        <p> 존재하지 않는 페이지 입니다. </p>
        <Link to ="/">메인페이지로 이동</Link>  
    </>)
}//NotPound404.jsx end