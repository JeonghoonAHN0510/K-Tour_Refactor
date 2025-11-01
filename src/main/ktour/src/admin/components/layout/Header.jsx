/**
 * 관리자단 > 공통레이아웃 > 헤더 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.16
 * @version 0.1.3
 */
import { Link, NavLink, useLocation } from "react-router-dom";
import { adminMenus } from "@admin/data/adminMenus";                //  관리자단 상단/좌측 메뉴데이터
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "@assets/admin/css/header.css"; // 헤더 header.css

export default function Header() {
    const { pathname } = useLocation();

    // 경로 일치 또는 하위경로 포함 체크
    const isMatch = (base, path) => base === path || path.startsWith(base + "/");
    
/** ====================== 관리자단 > 공통레이아웃 > 헤더 .jsx영역 =========================== */
    return (
        <header>
            {/* 1. 좌측 로고 */}
            <div className="logoHeader">
                <span className="menuIcon" aria-label="전체메뉴">
                    <FontAwesomeIcon icon={faBars} />
                </span>
                <Link to="/admin/map/place_info" className="logo">
                    <strong>K-TOUR</strong> <span>테마형 관광지도 플랫폼</span>
                </Link>
            </div>

            {/* 2. 중앙 GNB */}
            <div className="gnb">
                {/* 2.1. 플레이스 통합검색창 */}
                <div className="headerSearch">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input type="text" name="search" placeholder="플레이스 검색" aria-label="플레이스 검색"/>
                    <button type="button">검색 </button>
                </div>

                {/* 2.2. GNB 메뉴 */}
                <nav>
                    <ul className="menu1Depth">
                        {adminMenus.map((menu) => {
                            // 대메뉴 active: 자신 path 또는 하위 path 매칭
                            const isActive = isMatch(menu.path, pathname) || menu.children.some((child) =>
                                    isMatch(child.path, pathname)
                            );
                            return (
                                <li key={menu.title} className={isActive ? "active" : ""}>
                                    <NavLink to={menu.path}>{menu.title}</NavLink>
                                    <ul className="menu2Depth">
                                        {menu.children.map((submenu) => (
                                            <li key={submenu.path} > {/* NavLink 전용 콜백 문법 */}
                                                <NavLink to={submenu.path} className={({ isActive }) => isActive ? "active" : ""}>{submenu.label}</NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ); //return end
                        })} {/*//map end */}
                    </ul>
                </nav>

                {/* 3. 우측 관리자 정보 */}
                <ul className="memberMenu">
                    <li>
                        <Link to="/admin/member/manager"><b>김진숙</b> <span>(admin)</span></Link>
                    </li>
                    <li>
                        <Link to="/admin/login">로그아웃</Link>
                    </li>
                    <li>
                        <Link to="/" className="btn" target="_blank" rel="noopener noreferrer">홈페이지 </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}//Header.jsx end