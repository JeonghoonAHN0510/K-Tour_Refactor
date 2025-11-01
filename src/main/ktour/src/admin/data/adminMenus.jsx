/**
 * 관리자단 > 메뉴 데이터(adminMenus) : 페이지별 gnb, lnb, navigation 사용
 *
 * @author kimJS
 * @since 2025.10.19
 * @version 0.1.2
 */
import { faGear, faUsers, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

export const adminMenus = [
  {
    no: "1",
    title: "관광정보관리",
    icon: faMapMarkedAlt,
    path: "/admin/map/place_info",
    children: [{ label: "플레이스현황", path: "/admin/map/place_info" }],
  },
  {
    no: "2",
    title: "회원관리",
    icon: faUsers,
    path: "/admin/member/member",
    children: [
      { label: "회원현황", path: "/admin/member/member" },
      { label: "관리자현황", path: "/admin/member/manager" },
    ],
  },
  {
    no: "3",
    title: "사이트관리",
    icon: faGear,
    path: "/admin/site/site_info",
    children: [
      { label: "사이트현황", path: "/admin/site/site_info" },
      { label: "푸시/팝업관리", path: "/admin/site/push_popup" },
    ],
  },
];