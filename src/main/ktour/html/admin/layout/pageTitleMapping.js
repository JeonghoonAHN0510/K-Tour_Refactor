
/**
 * [ 페이지(HTML)별 타이틀(메뉴명) 매핑 ]
 * - URL을 키로 사용하여 1, 2Depth 메뉴 정보와 페이지 경로 매핑
 * @author kimJS
 * @since 2025.10.14
 */
console.log("<< pageTitleMapping.js start >>");

export const map_info = () => {
    console.log( '>> map_info exe >>' );
    const MENU_MAP = {
        "/html/admin/map/place_info.html": {
            menu1Depth: "관광지도관리",
            menu2Depth: "플레이스 현황",
            menu1Active: "class='active'",
            menu2Active: "class='active'",
            pathUrl1: "/html/admin/map/place_info.html",
            pathUrl2: "/html/admin/map/place_info.html"
        },
        "/html/admin/member/manager.html": {
            menu1Depth: "회원관리",
            menu2Depth: "관리자현황",
            menu1Active: "class='active'",
            menu2Active: "class='active'",
            pathUrl1: "/html/admin/member/manager.html",
            pathUrl2: "/html/admin/member/manager.html"
        },
        "/html/admin/site/site_info.html": {
            menu1Depth: "사이트관리",
            menu2Depth: "사이트정보",
            menu1Active: "class='active'",
            menu2Active: "class='active'",
            pathUrl1: "/html/admin/site/site_info.html",
            pathUrl2: "/html/admin/site/site_info.html"
        },
        "/html/admin/site/push_popup.html": {
            menu1Depth: "사이트관리",
            menu2Depth: "푸시/팝업관리",
            menu1Active: "class='active'",
            menu2Active: "class='active'",
            pathUrl1: "/html/admin/site/push_popup.html",
            pathUrl2: "/html/admin/site/push_popup.html"
        }
    }; 

    // 메뉴 객체 리턴
    return MENU_MAP[location.pathname];

 };//func end
