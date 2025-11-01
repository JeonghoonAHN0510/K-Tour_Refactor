/**
 * 사용자단(비회원) > 메인 > 우측 플레이스목록 개별 클릭시, 플레이스 상세정보 ★우측★모달(레이어) 컴포넌트
 *
 * @author 
 * @since 2025.10.24
 * @version 0.1.0
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { selectRightMarker } from "../../store/mapSlice";

// tourIntro 속성명
const tourIntroLabels = {
    infoCenter: "문의 및 안내",
    restDate: "휴무일",
    openDate: "개장일",
    useSeason: "이용 시기",
    useTime: "이용 시간",
    accomcount: "수용인원",
    expAgeRange: "체험 가능 연령",
    expGuide: "체험 안내",
    parking: "주차시설",
    chkBabyCarriage: "유모차 대여",
    chkCreditCard: "신용카드",
    chkPet: "애완동물 동반"
};
// RestaurantIntro 속성명
const restaurantIntroLabels = {
    infoCenterFood: "문의 및 안내",
    restDateFood: "휴무일",
    openDateFood: "개업일",
    openTimeFood: "영업시간",
    firstMenu: "대표메뉴",
    treatMenu: "취급메뉴",
    packing: "포장",
    kidsFacility: "어린이놀이방",
    chkCreditCardFood: "신용카드",
    discountInfoFood: "할인안내",
    reservationFood: "예약안내",
    parkingFood: "주차시설",
    scaleFood: "매장규모",
    seat: "좌석 수",
    smoking: "금연시설 여부"
};
// FestivalIntro 속성명
const festivalIntroLabels = {
    eventStartDate: "행사시작일",
    eventEndDate: "행사종료일",
    eventPlace: "장소",
    eventHomepage: "행사홈페이지",
    ageLimit: "관람가능연령",
    useTimeFestival: "이용요금",
    bookingPlace: "예매처",
    discountInfoFestival: "할인정보",
    placeInfo: "행사장 위치",
    festivalGrade: "축제등급",
    festivalType: "축제유형",
    playTime: "공연시간",
    program: "프로그램",
    progressType: "진행상태",
    spendTimeFestival: "관람소요시간",
    sponsor1: "주최자",
    sponsor1Tel: "주최자 연락처",
    sponsor2: "주관사",
    sponsor2Tel: "주관사 연락처",
    subEvent: "부대행사"
};

export default function RightModalPlace(props) {
    const { axiosOption, selectedRightMarker } = useSelector((state) => state.relatedMap);
    // =================== useState 선언부 ===================
    const [placeInfo, SetPlaceInfo] = useState(null);
    // =================== useDispatch ===================
    const dispatch = useDispatch();

    const getplaceInfoByAxios = async () => {
        if (!selectedRightMarker) return;
        try {
            const response = await axios.get(`http://localhost:8080/placeinfo/basic?pno=${selectedRightMarker}`, axiosOption);
            SetPlaceInfo(response.data);
        } catch (error) {
            console.log('getplaceInfoByAxios 오류 발생');
            console.log(error);
        } // try-catch end
    } // func end
    // =================== useEffect - [selectedRightMarker] : 상세정보 GET ===================
    useEffect(() => {
        getplaceInfoByAxios();
    }, [selectedRightMarker])

    const handleCloseModal = () => {
        dispatch(selectRightMarker(null));
    } // func end
    // axios 처리가 안 됐으면, 종료
    if (!placeInfo || !selectedRightMarker) return;
    /** =========================== ★우측모달★ LeftModalPlace.jsx ===================================== */
    return (
        <>
            <div className="rightModal" id="rightModalPlace">
                {/* 모달 박스 시작 */}
                <div className="modal_box">
                    {/* 콘텐츠 내용 시작 */}
                    <button className="modalClose" onClick={handleCloseModal} ><FontAwesomeIcon icon={faXmark} /></button>

                    <div className="modal_img_box">
                        {
                            placeInfo.placeInfo.firstimage ?
                                (<img
                                    src={placeInfo.placeInfo.firstimage.indexOf('http') != -1 ?
                                        placeInfo.placeInfo.firstimage :
                                        '..../public/uploads/1/firstImage/' + placeInfo.placeInfo.firstimage
                                    }
                                    alt="타이틀"
                                />)
                                :
                                (<img src="/user/img/no_img.jpg" alt="타이틀" />)
                        }
                        <div className="modalContentOutline">
                            <h3>{placeInfo.placeInfo.title}</h3>
                            <div className="category">{placeInfo.placeInfo.lclsSystm2Nm}&nbsp; {placeInfo.placeInfo.lclsSystm3Nm}</div>
                        </div>
                    </div>

                    <div className="modalContent">
                        <p className="description">
                            {
                                placeInfo.placeInfo.overview || '정보 없음'
                            }
                        </p>

                        <h4>상세정보</h4>
                        <ul>
                            <li><b>주소</b>{placeInfo.placeInfo.addr1}{'\t'}{placeInfo.placeInfo.addr2}</li>
                            {
                                placeInfo.placeInfo.homepate &&
                                <li>
                                    <b>홈페이지</b>
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        {placeInfo.placeInfo.homepate}
                                    </a>
                                </li>
                            }
                            {
                                placeInfo.placeInfo.tel &&
                                <li>
                                    <b>전화</b>
                                    <a href={placeInfo.placeInfo.tel}>{placeInfo.placeInfo.tel}</a>
                                </li>
                            }
                        </ul>

                        <h4>사진이미지</h4>
                        <ul className="additionImgWrap">
                            {
                                placeInfo.PlaceImageDetail.map((image) => {
                                    return <li key={image.pidNo}>
                                        <img src={image.originimgurl.indexOf != -1 ?
                                            image.originimgurl :
                                            '..../public/uploads/1/originImgUrl/' + place.originimgurl
                                        } alt="" />
                                    </li>
                                })
                            }
                        </ul>

                        <h4>부가정보</h4>
                        <ul>
                            {
                                placeInfo.PlaceInfoDtoList.map((info) => {
                                    if (info.infoText) {
                                        return <li key={info.pirNo}> <b>{info.infoName}</b> {info.infoText.replace('_', ',')} </li>
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            {placeInfo.TourIntro &&
                                Object.keys(tourIntroLabels).map((key) => {
                                    const value = placeInfo.TourIntro[key];
                                    if (value) {
                                        const label = tourIntroLabels[key];
                                        return (
                                            <li key={key}>
                                                <b>{label}</b> {value}
                                            </li>
                                        );
                                    } // if end
                                    // 값이 없으면, 렌더링 X
                                    return null;
                                })
                            }
                            {placeInfo.RestaurantIntro &&
                                Object.keys(restaurantIntroLabels).map((key) => {
                                    const value = placeInfo.RestaurantIntro[key];
                                    if (value) {
                                        const label = restaurantIntroLabels[key];
                                        return (
                                            <li key={key}>
                                                <b>{label}</b> {value}
                                            </li>
                                        );
                                    } // if end
                                    // 값이 없으면, 렌더링 X
                                    return null;
                                })
                            }
                            {placeInfo.FestivalIntro &&
                                Object.keys(festivalIntroLabels).map((key) => {
                                    const value = placeInfo.FestivalIntro[key];
                                    if (value && value != '선택안함') {
                                        const label = festivalIntroLabels[key];
                                        const displayValue = String(value).replace(
                                            /^((?:19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
                                            '$1년 $2월 $3일'
                                        );
                                        return (
                                            <li key={key}>
                                                <b>{label}</b> {displayValue}
                                            </li>
                                        );
                                    } // if end
                                    // 값이 없으면, 렌더링 X
                                    return null;
                                })
                            }
                        </ul>
                    </div>
                    {/* 콘텐츠 내용 끝 */}
                </div>
                {/* 모달 박스 끝 */}
            </div>
            {/* 05. 지도 마커 클릭시, 플레이스 상세정보 조회 모달(레이어) 끝 */}
        </>
    );
} // LeftModalPlace.jsx end
