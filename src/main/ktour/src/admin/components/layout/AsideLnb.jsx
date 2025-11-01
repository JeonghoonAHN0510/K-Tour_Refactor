/**
 * 관리자단 > 공통레이아웃 > 좌측메뉴(asideLnb) 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.16
 * @version 0.1.2
 */
import { NavLink, useLocation } from "react-router-dom";
import { adminMenus } from "@admin/data/adminMenus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight  } from "@fortawesome/free-solid-svg-icons";
import '@assets/admin/css/asideLnb.css' // 좌측메뉴 asideLnb.css

export default function AsideLnb(props) {
  const { pathname } = useLocation();

  // 현재 URL에 해당하는 1차 메뉴 그룹 찾기
  const activeGroup = adminMenus.find(
    (group) =>
      group.path === pathname ||
      group.children.some((child) => child.path === pathname)
  );

  /** ========================= 관리자단 > 공통레이아웃 > 좌측메뉴(asideLnb) .jsx영역 ================================== */
  return (
    <>
       <aside className="lnb">
      <h2>
        {activeGroup ? (
          <>
            <FontAwesomeIcon icon={activeGroup.icon} />{/* 아이콘 출력 */}
            <span>{activeGroup.title}</span>
          </>
        ) : (
          "메뉴명"
        )}
      </h2>

      {activeGroup?.children?.length > 0 && (
        <ul className="submenu">
          {activeGroup.children.map((child) => (
            <li key={child.path}>
              <NavLink
                to={child.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {child.label}
                <FontAwesomeIcon icon={faAngleRight} />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </aside>
    </>
  );
}
//AsideLnb.jsx end