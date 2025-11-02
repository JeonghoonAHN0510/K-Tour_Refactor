/**
 * 사용자단(비회원) > 메인(html) > 중앙 지도/ 우측 플레이스 목록
 *
 * @author 
 * @since 2025.10.24
 * @version 0.1.0
 */
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faAngleRight, faMagnifyingGlass, faMapMarkedAlt, faThumbsUp, faLandmark, faMountainSun, faHiking, faShoppingBag, faUtensils, faBed, faMasksTheater, faMapLocationDot, faStreetView, faCircleChevronRight, faMusic, faDog, faPaw, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "@assets/user/css/layoutSample.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectCategory } from "../../store/mapSlice";
import PlaceGroups from "@user/pages/map/RightPlaceList"; // 우측 플레이스 목록 영역
import PushNotification from "@user/components/common/PushNotification.jsx";

const categories = [
    { name: "전체", icon: faList, value: "all" }, // value는 API 요청 시 사용할 값 (예시)
    { name: "관광", icon: faMapMarkedAlt, value: "1" },
    { name: "문화", icon: faLandmark, value: "2" },
    { name: "축제", icon: faMusic, value: "3" },
    { name: "여행", icon: faMountainSun, value: "4" },
    { name: "레저", icon: faHiking, value: "5" },
    { name: "숙박", icon: faBed, value: "6" },
    { name: "쇼핑", icon: faShoppingBag, value: "7" },
    { name: "음식", icon: faUtensils, value: "8" }
];

export default function RightCategory(props) {
    // =================== useSelector ===================
    const { centeredLDong, selectedCategory } = useSelector((state) => state.relatedMap);
    // =================== useState ===================
    const [activeLDong, setActiveLDOng] = useState(null);
    // =================== useDispatch ===================
    const dispatch = useDispatch();

    const handleCategoryClick = (categoryValue) => {
        dispatch(selectCategory(categoryValue));
    }; // func end

    useEffect(() => {
        setActiveLDOng(centeredLDong);
    }, [centeredLDong])

    /** ========================= 사용자단(비회원) > 메인(html) 샘플페이지.jsx영역 ================================== */
    return (
        <>
            {/* <!--  03. CONTENTS START  --> */}
            <section className="rightContentsWrap">
                {/* <!-- 03-1.우측 본문 영역 시작 --> */}
                <div className="rightContents">
                    <div className="pageTitle">
                        <h2><FontAwesomeIcon icon={faLocationDot} />{activeLDong}
                            <button type="button" > <PushNotification /> </button>
                        </h2>
                        <ul className="cotentType">
                            {
                                categories.map((category) => {
                                    return <li
                                        key={category.name}
                                        className={selectedCategory == category.value ? "active" : ""}
                                        onClick={() => handleCategoryClick(category.value)}
                                    >
                                        <b><FontAwesomeIcon icon={category.icon} /></b>
                                        <span>{category.name}</span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="cardListWrap" id="mapInfoBox">

                        {/* <!-- (우측)플레이스 리스트 시작 --> */}
                        <PlaceGroups selectedCategory={selectedCategory} />
                        {/* <!-- (우측)플레이스 리스트 끝 --> */}

                    </div>
                </div>
                <Link to="/" onClick={() => (document.querySelector(".rightContents")?.scrollTo({ top: 0, behavior: "smooth" }) || window.scrollTo({ top: 0, behavior: "smooth" }))} className="toTop">맨위로</Link>

                {/* <!-- 03-1.우측 본문 영역 끝 --> */}
            </section>
        </>
    );
}//LayoutSample.jsx end