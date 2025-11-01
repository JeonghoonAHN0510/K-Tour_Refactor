/**
 * K-Tour > 관리자단 > 라우터 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.19
 * @version 0.1.4
 */

import { Routes, Route } from "react-router-dom";       // 라우터(URL 경로)
import { lazy, Suspense } from "react";                 // 코드 스플리팅(필요한 시점 비동기 로딩_Lazy Loading)

// 관리자단 > 사용 페이지 : 코드 스플리팅(*지연 로딩, 필요 시점에만 로드)
const LayoutAdmin = lazy(() => import("@admin/components/layout/LayoutAdmin"));     // 관리자단 > 공통레이아웃
const Login = lazy(() => import("@admin/pages/member/Login"));                      // 관리자단 > 로그인 페이지
const PlaceInfo = lazy(() => import("@admin/pages/map/place/PlaceInfo"));           // 플레이스현황 페이지 
const Member = lazy(() => import("@admin/pages/member/member/Member"));             // 회원현황 페이지 
const Manager = lazy(() => import("@admin/pages/member/manager/Manager"));          // 관리자현황 페이지 
const SiteInfo = lazy(() => import("@admin/pages/site/site/SiteInfo"));             // 사이트정보 페이지
const PushPopup = lazy(() => import("@admin/pages/site/push_popup/PushPopup"));     // 푸시/팝업관리 페이지
const NotFound404 = lazy(() => import("@admin/pages/NotFound404"));                 // 404 Not Found 페이지
const Sample = lazy(() => import("@admin/components/common/sample/Sample"));        // 컴포넌트 샘플페이지(레이어/테이블/폼태그 등..)
export default function AdminRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* 비관리자 페이지 */}
        <Route path="login" element={<Login />} />

        {/* /admin 하위 전용 : 관리자 레이아웃 그룹(페이지 ) */}
        <Route element={<LayoutAdmin />}>
          <Route path="map/place_info" element={<PlaceInfo />} />
          <Route path="member/member" element={<Member />} />
          <Route path="member/manager" element={<Manager />} />
          <Route path="site/site_info" element={<SiteInfo />} />
          <Route path="site/push_popup" element={<PushPopup />} />
          <Route path="sample" element={<Sample />} /> {/* http://localhost:5173/admin/sample : 관리자단 > 공통컴포넌트(레이어, 테이블 등) > 샘플사용 예시 */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}
// AdminRouter.jsx end