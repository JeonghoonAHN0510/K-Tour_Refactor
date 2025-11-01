/**
 * K-Tour > 사용자단(비회원) > 라우터 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.19
 * @version 0.1.3
 */
import { lazy, Suspense } from "react";            // 코드 스플리팅(필요한 시점 비동기 로딩_Lazy Loading)
import { Routes, Route } from "react-router-dom";  // 라우터(URL 경로)

const LayoutUser  = lazy(() => import("@user/components/layout/LayoutUser")); // 사용자단 > 공통레이아웃
const MainPlace   = lazy(() => import("@user/pages/map/MainPlace"));          // 사용자단 > 메인(플레이스현황) 페이지
const NotFound404 = lazy(() => import("@user/pages/NotFound404"));            // 404 Not Found 페이지

function Loading() { return <div className="loaing">로딩 중…</div>; }         // 로딩중

export default function UserRouter() {

  return (
    <Suspense fallback={<Loading />}>           
        <Routes>
          {/* /user 하위 전용 : 사용자 레이아웃 그룹(페이지 ) */}
          <Route element={<LayoutUser />}>
            <Route index element={<MainPlace />} /> {/* 메인(플레이스현황) 페이지 */}
          </Route>
          {/* 404 */}
          <Route path="*" element={<NotFound404 />} />  
        </Routes>
    </Suspense>
  );
}//UserRouter.jsx end