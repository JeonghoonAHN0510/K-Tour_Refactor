/**
 * 사용자단(비회원) > 공통레이아웃 > 좌측 하단메뉴 컴포넌트
 *
 * @author kimJS, AhnJH
 * @since 2025.10.17
 * @version 0.1.2
 */
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faThumbsUp, faMusic, faStreetView, faCircleChevronRight, faDog, faSignsPost, faLocationCrosshairs, faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import '@assets/user/css/asideLnb.css' // 좌측메뉴 asideLnb.css
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { selectedSigngu, setActiveLnbMenu, setRecommendLatLng, selectCategory, setSearchLatLng } from "../../store/mapSlice";

const recommendCourses = {
    ldNo: 247,
    lDongRegnNm: '강원특별자치도',
    lDongSignguNm: '고성군',
    Courses: [
        {
            courseName: '고성8경',
            csNo: 1,
            places: [
                {title: '건봉사', pNo: 10099},
                {title: '천학정', pNo: 42056},
                {title: '화진포', pNo: 54502},
                {title: '청간정', pNo: 42155},
                {title: '울산바위', pNo: 9983},
                {title: '통일전망타워', pNo: 22391},
                {title: '송지호', pNo: 20545},
                {title: '마산봉 설경', pNo: null}  // 마산봉 설경은 존재하지 않아서, pNo null로
            ]
        },
        {
            courseName: '여행코스1',
            csNo: 2,
            places: [
                {title: '건봉사', pNo: 10099},
                {title: '천학정', pNo: 42056},
                {title: '화진포', pNo: 54502},
                {title: '청간정', pNo: 42155},
                {title: '울산바위', pNo: 9983},
                {title: '통일전망타워', pNo: 22391},
                {title: '송지호', pNo: 20545},
                {title: '마산봉 설경', pNo: null}  // 마산봉 설경은 존재하지 않아서, pNo null로
            ]
        },
        {
            courseName: '여행코스2',
            csNo: 3,
            places: [
                {title: '건봉사', pNo: 10099},
                {title: '천학정', pNo: 42056},
                {title: '화진포', pNo: 54502},
                {title: '청간정', pNo: 42155},
                {title: '울산바위', pNo: 9983},
                {title: '통일전망타워', pNo: 22391},
                {title: '송지호', pNo: 20545},
                {title: '마산봉 설경', pNo: null}  // 마산봉 설경은 존재하지 않아서, pNo null로
            ]
        },
        {
            courseName: '여행코스3',
            csNo: 4,
            places: [
                {title: '건봉사', pNo: 10099},
                {title: '천학정', pNo: 42056},
                {title: '화진포', pNo: 54502},
                {title: '청간정', pNo: 42155},
                {title: '울산바위', pNo: 9983},
                {title: '통일전망타워', pNo: 22391},
                {title: '송지호', pNo: 20545},
                {title: '마산봉 설경', pNo: null}  // 마산봉 설경은 존재하지 않아서, pNo null로
            ]
        },
        {
            courseName: '여행코스4',
            csNo: 5,
            places: [
                {title: '건봉사', pNo: 10099},
                {title: '천학정', pNo: 42056},
                {title: '화진포', pNo: 54502},
                {title: '청간정', pNo: 42155},
                {title: '울산바위', pNo: 9983},
                {title: '통일전망타워', pNo: 22391},
                {title: '송지호', pNo: 20545},
                {title: '마산봉 설경', pNo: null}  // 마산봉 설경은 존재하지 않아서, pNo null로
            ]
        },
    ]
}

export default function AsideLnb(props) {
    // =================== useDispatch ===================
    const dispatch = useDispatch();
    // =================== useSelector ===================
    const { firstLDong, LdongName, axiosOption, selectedLdNo, activeLnbMenu, regionSignguList, currentPosition } = useSelector((state) => state.relatedMap);
    // =================== useState 선언부 ===================
    const [surroundingPlace, SetSurroundingPlace] = useState([]);   // 내 주변 시군구 정보
    const [activeLdNo, setActiveLdNo] = useState(null);             // 활성화된 시군구 표시를 위한 active
    /**
     * firstLDong이 변경되었을 때, 해당하는 시구의 시군구 정보를 얻기 위해 일치하는 시구를 찾아서 시군구 정보를 얻습니다.
     * 
     * @author AhnJH
     */
    useEffect(() => {
        LdongName.map((name) => {
            if (name.ldongregnnm == firstLDong.split(" ")[0]) {
                getLDongSignguCdByAxios(name.ldongregncd);
            } // if end
        }) // map end
    }, [firstLDong]);

    /**
     * 좌측메뉴 선택을 관리하는 메소드
     * <p>
     * 내 주변을 선택하면, 현재 위치로 가기 위해 재접속을 진행한다.
     * @param {string} menuName 선택된 메뉴의 영문명
     * @author AhnJH
     */
    const handleGnbClick = (menuName) => {
        dispatch(setActiveLnbMenu(menuName));
        if (menuName == 'mySurroundings') {
            dispatch(setSearchLatLng({
                lat: currentPosition.lat,
                lng: currentPosition.lng
            }))
        } else if (menuName == 'recommendPlace') {
            dispatch(setRecommendLatLng({
                lat: 38.3806388889,
                lng: 128.4682222222
            })); // 임시로 추천플레이스가 '고성'
            dispatch(selectCategory('all'));
        } // if end
    } // func end

    /**
     * selectedLdNo가 변경되었을 때, activeLdNo에 반영하기 위해 useState를 사용하는 useEffect
     * @author AhnJH
     */
    useEffect(() => {
        setActiveLdNo(selectedLdNo);
    }, [selectedLdNo])

    // =================== LDongSignguCd Axios GET ===================
    const getLDongSignguCdByAxios = async (ldongregncd) => {
        if (ldongregncd == null) return;
        try {
            const response = await axios.get(`http://localhost:8080/ldongcode/getsigngu?lDongRegnCd=${ldongregncd}`, axiosOption);
            const data = response.data;
            SetSurroundingPlace(data);

            const initialSignguName = firstLDong.split(" ")[1];
            const initialActiveNo = data.find((signgu) => {
                signgu.ldongsigngunm == initialSignguName
            }) // find end
            if (initialActiveNo) {
                setActiveLdNo(initialActiveNo.ldNo);
            } else {
                setActiveLdNo(null);
            } // if end
        } catch (error) {
            console.log('getLDongSignguCdByAxios 오류 발생');
            console.log(error);
        } // try-catch end
    } // func end

    const handleLdNoClick = (signgu) => {
        setActiveLdNo(signgu.ldNo);
        dispatch(selectedSigngu(signgu.ldNo));
    } // func end

    /** ========================= 사용자단(비회원) > 공통레이아웃 > 좌측메뉴(asideLnb) .jsx영역 ================================== */
    return <>
        <div className="gnbWrap">
            <div className="gnb">
                <ul>
                    <li
                        className={activeLnbMenu === 'mySurroundings' ? 'active' : ''}
                        onClick={() => handleGnbClick('mySurroundings')}
                    >
                        <FontAwesomeIcon icon={faStreetView} />내 주변
                    </li>
                    <li
                        className={activeLnbMenu === 'regionSelect' ? 'active' : ''}
                        onClick={() => handleGnbClick('regionSelect')}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />지역선택(전국)
                    </li>
                    <li
                        className={activeLnbMenu === 'recommendPlace' ? 'active' : ''}
                        onClick={() => handleGnbClick('recommendPlace')}
                    >
                        <FontAwesomeIcon icon={faCompass} />추천플레이스
                    </li>
                    <li><FontAwesomeIcon icon={faMusic} />축제/행사/공연</li>
                    <li onClick={() => alert("준비중입니다.")}><FontAwesomeIcon icon={faDog} />반려동물동반</li>
                </ul>
            </div>

            {/* <!-- 좌측 서브 메뉴 시작 --> */}
            {activeLnbMenu === 'mySurroundings' && (
                <div className="lnb">
                    <h2>
                        <FontAwesomeIcon icon={faStreetView} />내 주변
                        <div className="comment">주제별 다양한 장소를 검색하세요</div>
                    </h2>
                    <ul className="subMenuList" id="lnbMap">
                        {
                            surroundingPlace &&
                            surroundingPlace.map((signgu) => {
                                const isActive = signgu.ldNo == activeLdNo;
                                return (
                                    <li key={signgu.ldNo}>
                                        <Link
                                            to="#"
                                            className={isActive ? 'active' : ''}
                                            onClick={() => handleLdNoClick(signgu)}
                                        >
                                            <span>{signgu.ldongsigngunm}</span>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            )}

            {/* '지역 선택' 서브 메뉴 */}
            {activeLnbMenu === 'regionSelect' && (
                <div className="lnb">
                    <h2>
                        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />지역선택(전국)
                        <div className="comment">
                            {regionSignguList.length > 0
                                ? '시/군/구를 선택하세요.'
                                : '상단에서 원하는 지역을 선택하세요.'
                            }
                        </div>
                    </h2>
                    <ul className="subMenuList" id="lnbRegion">
                        {
                            regionSignguList &&
                            regionSignguList.map((signgu) => {
                                const isActive = signgu.ldNo == activeLdNo;
                                return (
                                    <li key={signgu.ldNo}>
                                        <Link
                                            to="#"
                                            className={isActive ? 'active' : ''}
                                            onClick={() => handleLdNoClick(signgu)}
                                        >
                                            <span>{signgu.ldongsigngunm}</span>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            )}
            {activeLnbMenu === 'recommendPlace' && (
                <div className="lnb">
                    <h2>
                        <FontAwesomeIcon icon={faCompass} />추천플레이스
                        <div className="comment">
                            {recommendCourses.lDongRegnNm} {recommendCourses.lDongSignguNm}
                        </div>
                    </h2>
                    <ul className="subMenuList" id="lnbRegion">
                        {
                            recommendCourses.Courses.map((course) => {
                                return (
                                    <li key={course.courseName}>
                                        <Link>
                                            <span>{course.courseName}</span>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            )}
        </div>
    </>
}//AsideLnb.jsx end