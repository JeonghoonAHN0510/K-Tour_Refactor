/**
 * 사용자단(비회원) > 공통레이아웃 > 헤더(좌측 상단) 컴포넌트
 *
 * @author kimJS, AhnJH
 * @since 2025.10.17
 * @version 0.1.3
 */
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLocationArrow, faBars } from "@fortawesome/free-solid-svg-icons";
import "@assets/user/css/header.css"; // 헤더 header.css
import { useEffect, useState } from "react";
import axios from "axios";
import { selectedSigngu, ByLdongCode, setActiveLnbMenu, setRegionSignguList, setSearchResult, setActiveSearchBox } from "../../store/mapSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Header(props) {
    // =================== useSelector ===================
    const { axiosOption, centeredLDong, currentPosition } = useSelector((state) => state.relatedMap);
    // =================== useDispatch ===================
    const dispatch = useDispatch();
    // =================== useState 선언부 ===================
    const [lDongRegnCd, SetLDongRegnCd] = useState([]);
    const [lDongSignguCd, SetLDongSigngu] = useState([]);
    const [selectedRegnCd, SetSelectedRegnCd] = useState("");
    const [selectedLdNo, SetSelectedLdNo] = useState("");
    const [searchBoxInput, SetSearchBoxInput] = useState("");

    // =================== useEffect - [] : 마운트될 때 1번만 실행 ===================
    useEffect(() => {
        getLDongRegnCdByAxios();        // 시도코드를 얻어오는 함수 실행
    }, []); // useEffect end
    // =================== LDongRegnCd Axios GET ===================
    const getLDongRegnCdByAxios = async () => {
        try {
            const response = await axios.get("http://localhost:8080/ldongcode/getregn", axiosOption);
            dispatch(ByLdongCode(response.data));
            SetLDongRegnCd(response.data);
        } catch (error) {
            console.log('getLDongCodeByAxios 오류 발생');
            console.log(error);
        } // try-catch end
    } // func end
    // =================== LDongSignguCd Axios GET ===================
    const getLDongSignguCdByAxios = async () => {
        if (selectedRegnCd == "") {
            SetLDongSigngu([]);
            dispatch(setRegionSignguList([]));
            return;
        } // if end
        try {
            const response = await axios.get(`http://localhost:8080/ldongcode/getsigngu?lDongRegnCd=${selectedRegnCd}`, axiosOption);
            SetLDongSigngu(response.data);
            dispatch(setRegionSignguList(response.data));
        } catch (error) {
            console.log('getLDongSignguCdByAxios 오류 발생');
            console.log(error);
        } // try-catch end
    } // func end
    // =================== useEffect - [selectedRegnCd] : 시군구 정보 가져오기 ===================
    useEffect(() => {
        getLDongSignguCdByAxios();
    }, [selectedRegnCd]);
    // =================== Select Markup Change ===================
    const changeRegnCd = (e) => {
        SetSelectedRegnCd(e.target.value);
        dispatch(setActiveLnbMenu('regionSelect'));
    } // func end
    const changeLdNo = (e) => {
        SetSelectedLdNo(e.target.value);
        dispatch(selectedSigngu(e.target.value));
        dispatch(setActiveLnbMenu('regionSelect'))
    } // func end
    const activeEnter = (e) => {
        if (e.key === "Enter") searchingPlace();
    } // func end

    // =================== Search Axios GET ===================
    const searchingPlace = async () => {
        if (!searchBoxInput || !currentPosition) return;
        try {
            const response = await axios.get(`http://localhost:8080/placeinfo/searchbyusers?keyword=${searchBoxInput}&lat=${currentPosition.lat}&lng=${currentPosition.lng}`, axiosOption);
            dispatch(setSearchResult(response.data));
            dispatch(setActiveSearchBox("active"));
        } catch (error) {
            console.log(error);
        } // try-catch end
    } // func end

    if (!centeredLDong) return;
    /** ========================= 사용자단(비회원) > 공통레이아웃 > 헤더(header).jsx영역 ================================== */
    return (
        <>
            <div className="headerWrap">
                <header>
                    <h1 className="logo">
                        <Link to="/">
                            K-TOUR
                            <span>{centeredLDong && centeredLDong.split(" ")[0]}</span>
                        </Link>
                        <FontAwesomeIcon icon={faBars} />
                    </h1>
                </header>
                <div className="placeSearch">
                    <button onClick={searchingPlace}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    <input type="search" placeholder="관광지/상호명 검색" autoFocus="" value={searchBoxInput} onChange={(e) => { SetSearchBoxInput(e.target.value) }} onKeyDown={(e) => activeEnter(e)} />
                </div>
                <div className="promotionText">우리동네 <b>AI추천</b> 플레이스</div>
                <div className="ldongSelect">
                    <select onChange={changeRegnCd} value={selectedRegnCd}>
                        <option value=""> 도/광역시 선택</option>
                        {
                            lDongRegnCd.map((regn) => {
                                return <option key={regn.ldongregncd} value={regn.ldongregncd}>
                                    {regn.ldongregnnm}
                                </option>
                            })
                        }
                    </select>
                    <select onChange={changeLdNo} value={selectedLdNo}>
                        <option value=""> 시/군/구 선택</option>
                        {
                            lDongSignguCd.map((signgu) => {
                                return <option key={signgu.ldNo} value={signgu.ldNo}>
                                    {signgu.ldongsigngunm}
                                </option>
                            })
                        }
                    </select>
                </div>
            </div>
        </>
    );
}//Header.jsx end