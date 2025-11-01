/**
 * [ header 레이아웃(HTML) import ]
 *
 * @author kimJS
 * @since 2025.10.13
 */
import { map_info } from "./pageTitleMapping.js"; 
export const header = () => {
    console.log( '[1] 해더 레이아웃(HTML)' );
    const { menu1Depth, menu2Depth, pathUrl1, pathUrl2, menu1Active, menu2Active } = map_info();
    const containerHTML = document.querySelector('#container');
    const headerHTML = `   
    <!-- header start -->
        <header>
            <div class="logoHeader">
                <span class="menuIcon" aria-label="전체메뉴" >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="//www.w3.org/2000/svg" data-seed-icon="true" data-seed-icon-version="0.0.23" width="24" height="24"><g><g><path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4C22 4.55228 21.5523 5 21 5H3C2.44772 5 2 4.55228 2 4Z" fill="currentColor"></path><path d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z" fill="currentColor"></path><path d="M3 19C2.44772 19 2 19.4477 2 20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20C22 19.4477 21.5523 19 21 19H3Z" fill="currentColor"></path></g></g></svg>
                </span>
                <a href="/html/admin/map/place_info.html" class="logo"><strong>K-Tour </strong><span>테마형 관광지도 플랫폼</span></a>
            </div>
            <div class="gnb">
                <div class="headerSearch">
                    <form action="#" method="get">
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M20.9992 21L14.9492 14.95" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="text" name="search" placeholder="메뉴/기능 검색" aria-label="검색어 입력">
                        <button type="submit" class="searchMdule">검색</button>
                    </form>
                </div>
                <nav>
                    <ul class="menu1Depth">
                        <li ${menu1Depth === '관광지도관리' ? 'class="active"' : ''} >
                            <a href="/html/admin/map/place_info.html">관광정보관리</a>
                            <ul class="menu2Depth">
                                <li><a href="/html/admin/map/place_info.html">Place현황</a></li>
                            </ul>
                        </li>
                        <li ${menu1Depth === '회원관리' ? 'class="active"' : ''} >
                            <a href="/html/admin/member/manager.html">회원관리</a>
                            <ul class="menu2Depth">
                                <li><a href="/html/admin/member/manager.html">관리자현황</a></li>
                            </ul>
                        </li>
                        <li ${menu1Depth === '사이트관리' ? 'class="active"' : ''} >
                            <a href="/html/admin/site/site_info.html">사이트관리</a>
                            <ul class="menu2Depth">
                                <li><a href="/html/admin/site/site_info.html">사이트정보</a></li>
                                <li><a href="/html/admin/site/push_popup.html">푸시/팝업관리</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <ul class="memberMenu">
                    <li><a href="/html/admin/member/index.html" onclick=""><b>김진숙</b><span>(admin)</span></a></li>
                    <li><a href="#" onclick="">로그아웃</a></li>
                    <li><a href="/html/index.html" target="_blank" class="btn">홈페이지</a></li>
                </ul>
            </div>
        </header>
    <!-- header end -->
    `
    containerHTML.insertAdjacentHTML('afterbegin', headerHTML);
 }//func end

 header(); //js 실행