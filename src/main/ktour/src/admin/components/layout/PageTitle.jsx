/**
 * 관리자 > 공통레이아웃 > 페이지 타이틀/경로 컴포넌트
 * ----------------------------------------------------
 * - 현재 URL 기준으로 활성 메뉴/서브메뉴를 찾아 타이틀과 경로 표시
 * - 페이지 타이틀: 활성 서브(label) > 그룹(title) > 기본값(K-Tour)
 * - 경로(path): 그룹 > 서브 구조로 표시
 * @author kimJS
 * @since 2025.10.16
 * @version 0.1.3
 */

import { Link, useLocation } from "react-router-dom";
import { adminMenus } from "@admin/data/adminMenus";
import "@assets/admin/css/pageTitle.css";

export default function PageTitle() {
  const { pathname } = useLocation();

  // 현재 URL과 일치하는 메뉴 그룹 찾기
  const group = adminMenus.find(
    (g) =>
      pathname.startsWith(g.path) ||
      g.children?.some((c) => pathname.startsWith(c.path))
  );

  // 그룹 안에서 현재 활성화된 서브메뉴 찾기
  const child = group?.children?.find((c) =>
    pathname.startsWith(c.path)
  );

  // 페이지 제목 (서브 > 그룹 > 기본)
  const pageTitle = child?.label || group?.title || "K-Tour";

  return (
    <div className="pageTitle">
      {/* 페이지 제목 */}
      <h1>{pageTitle}</h1>

      {/* 경로 표시 (Breadcrumb) */}
      <div className="path">
        <Link to={group?.path || "/admin"}>{group?.title || "K-Tour"}</Link>
        {child && (
          <>
            <Link to={child.path} className="active">
              {child.label}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}// PageTitle.jsx end