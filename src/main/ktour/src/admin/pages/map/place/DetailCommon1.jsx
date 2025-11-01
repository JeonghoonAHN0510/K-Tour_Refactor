/**
 * DetailCommon1: PlaceInfo 공통 기본 정보 폼
*
 * 역할
 * - 장소 기본 메타 입력/수정: 노출 여부, 제목, 주소/좌표, 연락처, 홈페이지, 개요, 카테고리, 콘텐츠 유형
 * - 이미지 업로드: 마커 이미지, 대표 이미지, 상세 이미지들 + 이미지 설명 메타
 * - 좌표 획득: Daum 우편번호로 주소 선택 → Kakao 지도 지오코딩으로 좌표 설정, 마커 드래그로 미세 조정
 *
 * 데이터 흐름
 * - props.placeInfo로부터 초기값을 로컬 상태에 반영
 * - 저장 시 FormData(placeInfo/marker/imagesMeta/markerImage/mainImage/detailImages)로 saveBasic thunk 전송
 * - 콘텐츠 유형 변경 시 onChangeContentType 콜백으로 상위/스토어 contentType 동기화
 *
 * 외부 스크립트
 * - Daum Postcode: 우편번호/기본주소 선택 UI 로더
 * - Kakao Maps SDK(services 포함): 지도 표시, 지오코딩, 마커 드래그 이벤트 처리
 */
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import CategorySelect from "../../../components/admin/place/CategorySelect";
import { saveBasic } from "@admin/store/placeSlice";
import ImgPreview from "../../../components/admin/place/ImgPreview";
import { setMainTemp, setDetailTemp } from "../../../store/placeSlice";

const DetailCommon1 = forwardRef(function DetailCommon1({
    placeInfo: placeInfoProp,
    markers,
    images,
    contentType,
    onChangeContentType,
    ...rest
}, ref) {
    const dispatch = useDispatch();

    // 입력 폼 로컬 상태
    // - category: 분류 1/2/3단계 + ccNo
    // - region: 행정 구역(시/군/구) 선택 결과  // 遺꾨쪟/吏??  const [category, setCategory] = useState({
    const [category, setCategory] = useState({
        ccNo: null, l1Cd: null, l2Cd: null, l3Cd: null,
        l1Nm: null, l2Nm: null, l3Nm: null,
    });
    const [region, setRegion] = useState({
        ldNo: null, regnCd: null, signguCd: null, regnNm: null, signguNm: null,
    });

    // 콘텐츠 타입(상위 탭과 동기화)
    const [contentTypeLocal, setContentTypeLocal] = useState(String(contentType || "1"));
    useEffect(() => { setContentTypeLocal(String(contentType || "1")); }, [contentType]);

    const placeInfo = placeInfoProp || {};

    // 입력값
    const [showFlag, setShowFlag] = useState(true);         // 노출 여부
    const [title, setTitle] = useState("");                 // 장소명
    const [phone, setPhone] = useState("");                 // 전화번호
    const [phoneDesc, setPhoneDesc] = useState("");         // 전화 설명
    const [homepage, setHomepage] = useState("");           // 홈페이지
    const [overview, setOverview] = useState("");           // 개요
    const [placeNo, setPlaceNo] = useState("");             // 장소번호

    const createdAt = placeInfo?.createdAt || "";
    const updatedAt = placeInfo?.updatedAt || "";
    const displayUpdated = updatedAt || createdAt;

    // 주소/좌표
    const [zipCode, setZipCode] = useState("");
    const [roadAddr, setRoadAddr] = useState("");
    const [detailAddr, setDetailAddr] = useState("");
    const [coord, setCoord] = useState({ x: null, y: null }); // x:경도, y:위도

    // 파일/참고 ref
    const markerImgRef = useRef(null);
    const mainImgRef = useRef(null);
    const detailImgsRef = useRef(null);
    const imageDescRef = useRef(null);
    const detailAddrRef = useRef(null);
    const markerTempUrlRef = useRef(null);

    // Kakao Map
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const geocoderRef = useRef(null);
    const [mapObj, setMapObj] = useState(null);

    // 상세 진입 시 placeInfo 값을 입력에 반영
    useEffect(() => {
        const p = placeInfo || {};
        setZipCode(p.zipcode ?? "");
        setRoadAddr(p.addr1 ?? "");
        const sf = p?.showflag;
        setShowFlag(sf == null ? true : (Number(sf) === 1 || sf === true));
        setTitle(p.title ?? "");
        setPhone(p.tel ?? "");
        setPhoneDesc(p.telname ?? "");
        setHomepage(p.homepage ?? "");
        setOverview(p.overview ?? "");
        setPlaceNo(p.pNo ?? p.pno ?? "");
        setCategory({
            ccNo: p?.ccNo ?? null,
            l1Cd: p?.lclsSystm1Cd ?? null,
            l2Cd: p?.lclsSystm2Cd ?? null,
            l3Cd: p?.lclsSystm3Cd ?? null,
            l1Nm: p?.lclsSystm1Nm ?? null,
            l2Nm: p?.lclsSystm2Nm ?? null,
            l3Nm: p?.lclsSystm3Nm ?? null,
        });
    }, [placeInfoProp]);

    // Daum 우편번호 스크립트 로드
    useEffect(() => {
        if (window.daum?.Postcode) return;
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    /**
   * 우편번호 검색창 열기
   * - 선택 완료 시 zonecode/주소 반영 후 상세주소 입력으로 포커스 이동
   */
    const openPostcode = () => {
        if (!window.daum?.Postcode) {
            alert("우편번호 스크립트가 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.");
            return;
        }
        new window.daum.Postcode({
            oncomplete: (data) => {
                const zone = data.zonecode || "";
                const addr = data.userSelectedType === "R" ? (data.roadAddress || "") : (data.jibunAddress || "");
                setZipCode(zone);
                setRoadAddr(addr);
                setTimeout(() => detailAddrRef.current?.focus(), 0);
            },
        }).open();
    };

    // Kakao 지도 초기화
    // - SDK 로드 여부에 따라 maps.load 또는 스크립트 추가
    // - services 라이브러리를 포함해 geocoder 사용
    // - 마커 드래그 종료 시 좌표(coord) 갱신
    useEffect(() => {
        const initMap = () => {
            const container = mapRef.current;
            if (!container || !window.kakao?.maps) return;
            const center = new window.kakao.maps.LatLng(37.5665, 126.9780);
            const map = new window.kakao.maps.Map(container, { center, level: 3 });
            setMapObj(map);
            const marker = new window.kakao.maps.Marker({
                position: center,
                draggable: true
            });
            markerRef.current = marker;
            marker.setMap(map);
            geocoderRef.current = new window.kakao.maps.services.Geocoder();
            window.kakao.maps.event.addListener(marker, 'dragend', function () {
                const pos = marker.getPosition();
                setCoord({ x: String(pos.getLng()), y: String(pos.getLat()) });
            });
        };
        if (window.kakao?.maps) {
            window.kakao.maps.load(initMap);
            return;
        }
        const script = document.createElement("script");
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=29ac2fc1e2229c89c0cdf197740abcb5&autoload=false&libraries=services";
        script.async = true;
        script.onload = () => window.kakao.maps.load(initMap);
        document.body.appendChild(script);
    }, []);

    // 주소 변경 → geocoder.addressSearch로 좌표 갱신
    // - 성공 시 마커/지도 중심 이동, coord(x:경도, y:위도) 업데이트    const addr = (roadAddr || "").trim();
    useEffect(() => {
        const addr = (roadAddr || "").trim();
        if (!addr || !mapObj || !geocoderRef.current) return;
        geocoderRef.current.addressSearch(addr, (result, status) => {
            if (status !== window.kakao.maps.services.Status.OK || !result?.length) return;
            const { x, y } = result[0];
            const latlng = new window.kakao.maps.LatLng(Number(y), Number(x));
            if (markers && markers.mkURL) {
                const src = markers.mkURL ?
                    '/public/uploads/1/marker/' + markers.mkURL
                    :
                    markers.defaultMarker || "/user/img/no_img.jpg";
                const imageSize = new kakao.maps.Size(120, 90);
                const markerImage = new kakao.maps.MarkerImage(src, imageSize);
                markerRef.current = new window.kakao.maps.Marker({
                    position: latlng,
                    draggable: true,
                    image: markerImage,
                    zIndex: 50
                });
            } else {
                markerRef.current = new window.kakao.maps.Marker({
                    position: latlng,
                    draggable: true
                });
            } // if end
            markerRef.current.setMap(mapObj);
            mapObj.setCenter(latlng);
            setCoord({ x, y });
        });
        // 주소가 바뀔 때, 임시 URL 해제
        URL.revokeObjectURL(markerTempUrlRef.current);
    }, [roadAddr, mapObj]);

    const handleMarkerImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            // URL.createObjectURL()로 임시 파일경로 생성하기
            const tempUrl = URL.createObjectURL(file);
            // '미리보기'에서 사용하기 위해 저장
            markerTempUrlRef.current = tempUrl;
            // 마커이미지 만들기
            const image = new kakao.maps.MarkerImage(
                tempUrl,
                new kakao.maps.Size(120, 90)
            );
            // 마커에 적용하기
            markerRef.current.setImage(image);
        } // if end
    } // func end

    const handleMainImage = (e) => {
        const file = e.target.files[0];
        if (file){
            const tempUrl = URL.createObjectURL(file);
            dispatch(setMainTemp(tempUrl));
        } // if end
    } // func end

    const handleDetailImage = (e) => {
        const files = e.target.files;
        if (files){
            const tempUrl = [];
            for (let i = 0; i < files.length; i++){
                const temp = URL.createObjectURL(files[i]);
                tempUrl.push(temp);
            } // for end
            dispatch(setDetailTemp(tempUrl));
        }
    } // func end

    /**
     * 저장 핸들러
     * - 필수값 검증: 콘텐츠 유형, 카테고리, 주소
     * - 페이로드 구성:
     *   - placeInfo(JSON Blob), marker(JSON Blob), imagesMeta(JSON Blob, 옵션),
     *     markerImage/mainImage/detailImages(파일)
     */
    const handleSave = async () => {
        try {
            if (!contentTypeLocal) { alert("콘텐츠 유형을 선택해 주세요."); return; }
            if (!category?.ccNo) { alert("카테고리를 (최소 1단계) 선택해 주세요."); return; }
            if (!roadAddr) { alert("주소를 입력해 주세요."); return; }
            if (!zipCode) {alert("우편번호를 입력해 주세요."); return;}
            if (!title) {alert("제목을 입력해주세요."); return;}

            const pNoFromDetail = (placeInfo?.pno ?? placeInfo?.pNo ?? (placeNo ? Number(placeNo) : null));
            const ctNoVal = Number(String(contentTypeLocal || "1"));
            const ccNoVal = category.ccNo;
            const showflag = showFlag ? 1 : 0;
            const titleVal = title.trim();
            const homepageVal = homepage.trim() || null;
            const telVal = phone.trim() || null;
            const telNameVal = phoneDesc.trim() || null;
            const overviewVal = overview.trim() || null;

            const placeInfoDto = {
                pno: pNoFromDetail ?? 0,
                ctNo: ctNoVal,
                ldNo: region?.ldNo ?? null,
                ccNo: ccNoVal,
                editable: true,
                contentid: null,
                title: titleVal,
                showflag,
                firtimage: null,
                firstimage2: null,
                addr1: roadAddr || null,
                addr2: detailAddr || null,
                zipcode: zipCode || null,
                homepage: homepageVal,
                tel: telVal,
                telname: telNameVal,
                overview: overviewVal,
            };

            const markerDto = {
                mkNo: 0,
                pNo: pNoFromDetail ?? 0,
                mkURL: null,
                mapx: coord.x ? Number(coord.x) : null,
                mapy: coord.y ? Number(coord.y) : null,
            };

            const imagesMeta = [];
            const imgDesc1 = imageDescRef.current?.value?.trim();
            if (imgDesc1) imagesMeta.push({ imgname: imgDesc1 });

            const fd = new FormData();
            fd.append("placeInfo", new Blob([JSON.stringify(placeInfoDto)], { type: "application/json" }));
            fd.append("marker", new Blob([JSON.stringify(markerDto)], { type: "application/json" }));
            if (imagesMeta.length) fd.append("imagesMeta", new Blob([JSON.stringify(imagesMeta)], { type: "application/json" }));
            if (markerImgRef.current?.files?.[0]) fd.append("markerImage", markerImgRef.current.files[0]);
            if (mainImgRef.current?.files?.[0]) fd.append("mainImage", mainImgRef.current.files[0]);
            if (detailImgsRef.current?.files?.length) [...detailImgsRef.current.files].forEach((f) => fd.append("detailImages", f));

            await dispatch(saveBasic(fd)).unwrap();
            alert("저장되었습니다.");
        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // 일괄 저장(부모)에서 사용할 FormData 생성 유틸
    const buildFormDataForAll = () => {
        try {
            const pNoFromDetail = (placeInfo?.pno ?? placeInfo?.pNo ?? (placeNo ? Number(placeNo) : null));
            const ctNoVal = Number(String(contentTypeLocal || "1"));
            const ccNoVal = category.ccNo;
            const showflag = showFlag ? 1 : 0;
            const titleVal = title.trim();
            const homepageVal = homepage.trim() || null;
            const telVal = phone.trim() || null;
            const telNameVal = phoneDesc.trim() || null;
            const overviewVal = overview.trim() || null;

            const placeInfoDto = {
                pno: pNoFromDetail ?? 0,
                ctNo: ctNoVal,
                ldNo: region?.ldNo ?? null,
                ccNo: ccNoVal,
                editable: true,
                contentid: null,
                title: titleVal,
                showflag,
                firtimage: null,
                firstimage2: null,
                addr1: roadAddr || null,
                addr2: detailAddr || null,
                zipcode: zipCode || null,
                homepage: homepageVal,
                tel: telVal,
                telname: telNameVal,
                overview: overviewVal,
            };

            const markerDto = {
                mkNo: Number(markers?.mkNo ?? markers?.mkno ?? 0),
                pNo: pNoFromDetail ?? 0,
                mkURL: null,
                mapx: coord.x ? Number(coord.x) : null,
                mapy: coord.y ? Number(coord.y) : null,
            };

            const imagesMeta = [];
            const imgDesc1 = imageDescRef.current?.value?.trim();
            if (imgDesc1) imagesMeta.push({ imgname: imgDesc1 });

            const fd = new FormData();
            fd.append("placeInfo", new Blob([JSON.stringify(placeInfoDto)], { type: "application/json" }));
            fd.append("marker", new Blob([JSON.stringify(markerDto)], { type: "application/json" }));
            if (imagesMeta.length) fd.append("imagesMeta", new Blob([JSON.stringify(imagesMeta)], { type: "application/json" }));
            if (markerImgRef.current?.files?.[0]) fd.append("markerImage", markerImgRef.current.files[0]);
            if (mainImgRef.current?.files?.[0]) fd.append("mainImage", mainImgRef.current.files[0]);
            if (detailImgsRef.current?.files?.length) [...detailImgsRef.current.files].forEach((f) => fd.append("detailImages", f));

            return { fd, placeInfoDto };
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useImperativeHandle(ref, () => ({ buildFormDataForAll }));

    return (
        <div className="placeCommonWrap" {...rest}>
            <form aria-label="기본정보 입력">
                <fieldset>
                    <legend>{title || "기본정보"}</legend>

                    {/* 1. 지도 미리보기 */}
                    <div ref={mapRef} className="previewMap" id="previewMap" aria-hidden="true" />

                    {/* 2. 콘텐츠 유형 */}
                    <div className="form-group">
                        <label htmlFor="content-type-detail">콘텐츠 유형</label>
                        <select
                            id="content-type-detail"
                            name="contentTypeDetail"
                            value={contentTypeLocal}
                            onChange={(e) => { const v = e.target.value; setContentTypeLocal(v); onChangeContentType?.(v); }}
                        >
                            <option value="1">관광지</option>
                            <option value="3">행사/공연/축제</option>
                            <option value="8">음식점</option>
                        </select>
                    </div>

                    {/* 3. 노출 여부 */}
                    <div className="form-group">
                        <span>노출 여부</span>
                        <span className="radio-group">
                            <input type="radio" id="exposure-on" name="exposure" value="Y" checked={showFlag} onChange={() => setShowFlag(true)} />
                            <label htmlFor="exposure-on">노출</label>
                            <input type="radio" id="exposure-off" name="exposure" value="N" checked={!showFlag} onChange={() => setShowFlag(false)} />
                            <label htmlFor="exposure-off">비노출</label>
                        </span>
                    </div>

                    {/* 4. 카테고리 */}
                    <div className="form-group category-group">
                        <CategorySelect idSuffix="detail" namePrefix="detail" value={category} onChange={setCategory} />
                    </div>

                    {/* 5. 장소명/번호 */}
                    <div className="form-group">
                        <label htmlFor="place-name">장소명</label>
                        <input type="text" id="place-name" name="placeName" required value={title} onChange={(e) => setTitle(e.target.value)} />
                        <span className="form-group">
                            <label htmlFor="place-number">장소 번호</label>
                            <input type="text" id="place-number" name="placeNumber" value={placeNo} readOnly placeholder="자동 발급" />
                        </span>
                    </div>

                    {/* 6. 기본 주소 */}
                    <div className="form-group">
                        <label htmlFor="zip-code">기본 주소</label>
                        <button type="button" aria-label="우편번호 검색" onClick={openPostcode}>우편번호</button>
                        <input type="text" id="zip-code" name="zipCodeInput" placeholder="우편번호" aria-label="우편번호" value={zipCode} readOnly />
                        <input type="text" id="base-addr" name="addrInput" placeholder="도로명주소" aria-label="도로명주소" value={roadAddr} readOnly />
                    </div>

                    {/* 7. 상세 주소 */}
                    <div className="form-group">
                        <label htmlFor="detail-addr">상세 주소</label>
                        <input type="text" id="detail-addr" ref={detailAddrRef} value={detailAddr} onChange={(e) => setDetailAddr(e.target.value)} />
                    </div>

                    {/* 8. 좌표(hidden) */}
                    <input type="hidden" name="mapx" value={coord.x ?? ""} />
                    <input type="hidden" name="mapy" value={coord.y ?? ""} />

                    {/* 9. 연락처 */}
                    <div className="form-group phone-group">
                        <label htmlFor="main-phone">전화번호</label>
                        <input type="text" id="main-phone" name="mainPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <label htmlFor="phone-desc" className="sr-only">전화 설명</label>
                        <input type="text" id="phone-desc" name="phoneDesc" placeholder="전화 설명" value={phoneDesc} onChange={(e) => setPhoneDesc(e.target.value)} />
                    </div>

                    {/* 10. 홈페이지 */}
                    <div className="form-group">
                        <label htmlFor="homepage">홈페이지</label>
                        <input type="text" id="homepage" name="homepage" value={homepage} onChange={(e) => setHomepage(e.target.value)} />
                    </div>

                    {/* 11. 개요 */}
                    <div className="form-group">
                        <label htmlFor="summary-desc">개요 설명</label>
                        <textarea id="summary-desc" name="summaryDesc" className="memoInput" placeholder="개요를 입력해 주세요" rows="5" value={overview} onChange={(e) => setOverview(e.target.value)} />
                    </div>

                    {/* 12. 이미지 */}
                    <div className="form-group">
                        <label htmlFor="marker-img">마커 이미지</label>
                        <input type="file" id="marker-img" name="markerImage" onChange={handleMarkerImage} ref={markerImgRef} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="main-img">대표 이미지</label>
                        <input type="file" id="main-img" name="mainImage" onChange={handleMainImage} ref={mainImgRef} />
                        <ImgPreview title={'대표 이미지'}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="detail-img-1">상세 이미지</label>
                        <input type="file" id="detail-img-1" name="detailImages" multiple onChange={handleDetailImage} ref={detailImgsRef} />
                        <ImgPreview title={'상세 이미지'}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="img-desc-1">이미지 설명</label>
                        <input type="text" id="img-desc-1" name="imageDesc1" ref={imageDescRef} />
                    </div>

                    <div className="info_date">
                        <b>등록일</b> {createdAt || "-"} &nbsp; <b>수정일</b> {displayUpdated || "-"}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleSave}>저장</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
});

export default DetailCommon1;

