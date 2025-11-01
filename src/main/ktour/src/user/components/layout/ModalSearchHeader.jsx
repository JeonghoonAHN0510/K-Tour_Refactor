/**
 * 사용자단(비회원) > 공통레이아웃 > 좌측 상단 검색창 > 검색결과 레이어(모달)
 *
 * @author 
 * @since 2025.10.26
 * @version 0.1.0
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import "@assets/user/css/modalSearchHeader.css";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSearchBox, selectLeftMarker, setSearchLatLng, selectCategory } from "../../store/mapSlice";
import { useEffect } from "react";

export default function ModalSearchHeader(props) {
    // =================== useSelector ===================
    const { activeSearchBox, searchResult } = useSelector((state) => state.relatedMap);
    // =================== useDispatch ===================
    const dispatch = useDispatch();

    const handleSearchBox = () => {
        dispatch(setActiveSearchBox(null));
    } // func end

    const clickSearchPlace = (place) => {
        dispatch(setSearchLatLng({
            lat: place.mapy,
            lng: place.mapx
        }))
        dispatch(selectCategory(place.ctNo));
        dispatch(selectLeftMarker(place.pNo));
    } // func end

    useEffect(() => {

    }, [activeSearchBox, searchResult])

    if (!activeSearchBox || !searchResult) return;
    /** =========================== ★검색창 > 검색결과 레이어(모달)★ modalSearchHeader.jsx ===================================== */
    return (
        <>
            <div className="modalSearchHeader" id="modalSearchHeader">
                {/* 모달 박스 시작 */}
                <div className="modal_box">
                    {/* 콘텐츠 내용 시작 */}
                    <button className="modalClose" onClick={handleSearchBox} ><FontAwesomeIcon icon={faCircleXmark} /></button>
                    {/*  검색결과(플레이스) 시작 */}
                    {searchResult &&
                        searchResult.map((place) => (
                            <dl onClick={() => { clickSearchPlace(place) }} className="searchResult" key={place.pNo}>
                                <dt>
                                    {
                                        place.firstimage2 ?
                                            (<img
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => { e.target.src = "/user/img/no_img.jpg" }}
                                                src={place.firstimage2}
                                                alt={place.name}
                                                width="150"
                                                height="100"
                                            />)
                                            :
                                            (<img src="/user/img/no_img.jpg" alt={place.name} />)
                                    }
                                    <span className="category">{place.lclsSystm3Nm}</span>
                                </dt>
                                <dd>
                                    <ul>
                                        <li className="placeName">{place.title}</li>
                                        <li>
                                            <strong>{Math.floor(place.distance / 100) / 10}KM</strong> {place.addr1} {place.addr1}
                                        </li>
                                        <li>{place.tel}</li>
                                    </ul>
                                </dd>
                            </dl>
                        ))}
                    {/*  검색결과(플레이스) 끝 */}
                </div>
                {/* 모달 박스 끝 */}
            </div>
        </>
    );
} // LeftModalPlace.jsx end
