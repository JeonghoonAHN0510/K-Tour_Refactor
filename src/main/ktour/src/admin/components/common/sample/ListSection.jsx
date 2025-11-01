/**
 * 관리자단 > 공통컴포넌트(레이어, 테이블 등) > 샘플사용(Sample) > (좌측)목록조회ListSection.jsx
 *
 * @author kimJS
 * @since 2025.10.26
 * @version 0.1.0
 */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import DragResizeLayer from "@admin/components/common/DragResizeLayer";
import ResizableTable from "@admin/components/common/ResizableTable";


export default function ListSection(props) {

    const { layerContainerRef } = useOutletContext();   // 상위 LayoutAdmin에서 전달받음
    const [showList, setShowList] = useState(false);     // 1번 레이어(목록조회) 표시(노출) 여부 상태
    const [showDetail, setShowDetail] = useState(false); // 2번 레이어(상세조회) 표시(노출) 여부 상태

    const columns = [
        { id: "no", title: "No", width: 70 },
        { id: "pid", title: "플레이스번호", width: 110 },
        { id: "name", title: "플레이스명", width: 220 },
        { id: "ctype", title: "콘텐츠타입", width: 120 },
        { id: "cat", title: "카테고리", width: 140 },
        { id: "addr", title: "주소", width: 260 },
        { id: "tel", title: "전화번호", width: 120 },
    ];

    const data = [
        { no: 50, pid: 901250, name: "고성 해돋이 축제", ctype: "행사/공연/축제", cat: "문화관광축제", addr: "강원 고성군 아야진해변 일원", tel: "033-681-1001" },
        { no: 49, pid: 901249, name: "삼포해수욕장 여름 음악회", ctype: "공연", cat: "야외음악", addr: "강원 고성군 삼포해변", tel: "033-681-1002" },
        { no: 48, pid: 901248, name: "고성 명태마을 체험행사", ctype: "체험", cat: "수산체험", addr: "강원 고성군 거진항", tel: "033-681-1003" },
        { no: 47, pid: 901247, name: "화진포 벚꽃축제", ctype: "행사/공연/축제", cat: "봄꽃축제", addr: "강원 고성군 화진포호 일원", tel: "033-681-1004" },
        { no: 46, pid: 901246, name: "고성 해안 자전거 투어", ctype: "체험", cat: "스포츠체험", addr: "강원 고성군 죽왕면", tel: "033-681-1005" },
        { no: 45, pid: 901245, name: "송지호 철새 탐조축제", ctype: "행사", cat: "자연생태", addr: "강원 고성군 송지호 철새관망대", tel: "033-681-1006" },
        { no: 44, pid: 901244, name: "거진항 수산시장 먹거리전", ctype: "행사", cat: "지역특산", addr: "강원 고성군 거진항", tel: "033-681-1007" },
        { no: 43, pid: 901243, name: "설악해변 모래조각 페스티벌", ctype: "행사", cat: "가족체험", addr: "강원 고성군 설악해변", tel: "033-681-1008" },
        { no: 42, pid: 901242, name: "해양심층수 홍보관 전시", ctype: "전시", cat: "산업홍보", addr: "강원 고성군 토성면", tel: "033-681-1009" },
        { no: 41, pid: 901241, name: "바다열차 여행 패키지", ctype: "체험", cat: "관광상품", addr: "강원 고성군 간성역", tel: "033-681-1010" },
        { no: 40, pid: 901240, name: "고성 한우 먹거리 축제", ctype: "행사", cat: "지역특산", addr: "강원 고성군 간성읍 체육공원", tel: "033-681-1011" },
        { no: 39, pid: 901239, name: "청간정 문화공연", ctype: "공연", cat: "전통음악", addr: "강원 고성군 청간정 일원", tel: "033-681-1012" },
        { no: 38, pid: 901238, name: "봉포항 야시장", ctype: "행사", cat: "야시장", addr: "강원 고성군 봉포항", tel: "033-681-1013" },
        { no: 37, pid: 901237, name: "고성 DMZ 평화걷기", ctype: "체험", cat: "평화체험", addr: "강원 고성군 현내면", tel: "033-681-1014" },
        { no: 36, pid: 901236, name: "공현진 포토존 페스티벌", ctype: "행사", cat: "관광홍보", addr: "강원 고성군 공현진항", tel: "033-681-1015" },
        { no: 35, pid: 901235, name: "속초~고성 해안 드라이브 데이", ctype: "행사", cat: "자동차투어", addr: "강원 고성군 해안도로", tel: "033-681-1016" },
        { no: 34, pid: 901234, name: "고성 해양스포츠 체험캠프", ctype: "체험", cat: "스포츠", addr: "강원 고성군 송지호해변", tel: "033-681-1017" },
        { no: 33, pid: 901233, name: "DMZ 생태사진전", ctype: "전시", cat: "자연생태", addr: "강원 고성군 DMZ박물관", tel: "033-681-1018" },
        { no: 32, pid: 901232, name: "청간정 달빛음악회", ctype: "공연", cat: "야외공연", addr: "강원 고성군 청간정", tel: "033-681-1019" },
        { no: 31, pid: 901231, name: "삼포 해변 요가 클래스", ctype: "체험", cat: "웰니스", addr: "강원 고성군 삼포해변", tel: "033-681-1020" },
        { no: 30, pid: 901230, name: "간성 도서관 북페어", ctype: "행사", cat: "문화행사", addr: "강원 고성군 간성읍 도서관", tel: "033-681-1021" },
        { no: 29, pid: 901229, name: "고성 오션투유 불꽃쇼", ctype: "공연", cat: "야간축제", addr: "강원 고성군 삼포해변길 9", tel: "033-681-1022" },
        { no: 28, pid: 901228, name: "송지호 풍등축제", ctype: "행사", cat: "야간행사", addr: "강원 고성군 송지호 해변", tel: "033-681-1023" },
        { no: 27, pid: 901227, name: "거진항 명태축제", ctype: "행사", cat: "수산축제", addr: "강원 고성군 거진읍 대대리", tel: "033-681-1024" },
        { no: 26, pid: 901226, name: "토성면 주민 한마당", ctype: "행사", cat: "주민축제", addr: "강원 고성군 토성면사무소", tel: "033-681-1025" },
        { no: 25, pid: 901225, name: "고성 청소년 밴드경연대회", ctype: "공연", cat: "음악경연", addr: "강원 고성군 문화센터", tel: "033-681-1026" },
        { no: 24, pid: 901224, name: "간성읍 플리마켓", ctype: "행사", cat: "플리마켓", addr: "강원 고성군 간성읍 공원", tel: "033-681-1027" },
        { no: 23, pid: 901223, name: "고성 해안길 마라톤", ctype: "체험", cat: "스포츠", addr: "강원 고성군 해안도로", tel: "033-681-1028" },
        { no: 22, pid: 901222, name: "DMZ 평화음악회", ctype: "공연", cat: "문화행사", addr: "강원 고성군 통일전망대", tel: "033-681-1029" },
        { no: 21, pid: 901221, name: "삼포 여름 수영대회", ctype: "체험", cat: "스포츠", addr: "강원 고성군 삼포해변", tel: "033-681-1030" },
        { no: 20, pid: 901220, name: "화진포 해변 영화제", ctype: "공연", cat: "야외영화", addr: "강원 고성군 화진포", tel: "033-681-1031" },
        { no: 19, pid: 901219, name: "DMZ 평화 트래킹", ctype: "체험", cat: "평화체험", addr: "강원 고성군 현내면", tel: "033-681-1032" },
        { no: 18, pid: 901218, name: "거진 수산물 나눔행사", ctype: "행사", cat: "지역행사", addr: "강원 고성군 거진항", tel: "033-681-1033" },
        { no: 17, pid: 901217, name: "고성 생태탐방", ctype: "체험", cat: "생태", addr: "강원 고성군 화진포호", tel: "033-681-1034" },
        { no: 16, pid: 901216, name: "고성 지역작가 전시회", ctype: "전시", cat: "문화전시", addr: "강원 고성군 예술회관", tel: "033-681-1035" },
        { no: 15, pid: 901215, name: "간성읍 음악회", ctype: "공연", cat: "음악공연", addr: "강원 고성군 간성읍 문화회관", tel: "033-681-1036" },
        { no: 14, pid: 901214, name: "고성 커피축제", ctype: "행사", cat: "푸드페스티벌", addr: "강원 고성군 간성읍 광장", tel: "033-681-1037" },
        { no: 13, pid: 901213, name: "삼포 요트 체험", ctype: "체험", cat: "해양레저", addr: "강원 고성군 삼포항", tel: "033-681-1038" },
        { no: 12, pid: 901212, name: "고성 불빛축제", ctype: "행사", cat: "야간행사", addr: "강원 고성군 봉포해변", tel: "033-681-1039" },
        { no: 11, pid: 901211, name: "고성 스케이트 페스티벌", ctype: "행사", cat: "겨울축제", addr: "강원 고성군 체육공원", tel: "033-681-1040" },
        { no: 10, pid: 901210, name: "봉포항 해양사진전", ctype: "전시", cat: "사진전", addr: "강원 고성군 봉포항", tel: "033-681-1041" },
        { no: 9, pid: 901209, name: "고성 해수욕장 플로깅", ctype: "체험", cat: "환경행사", addr: "강원 고성군 해수욕장", tel: "033-681-1042" },
        { no: 8, pid: 901208, name: "청간정 국악공연", ctype: "공연", cat: "전통음악", addr: "강원 고성군 청간정", tel: "033-681-1043" },
        { no: 7, pid: 901207, name: "거진 항구 불꽃축제", ctype: "공연", cat: "야간행사", addr: "강원 고성군 거진항", tel: "033-681-1044" },
        { no: 6, pid: 901206, name: "송지호 낚시체험", ctype: "체험", cat: "레저", addr: "강원 고성군 송지호", tel: "033-681-1045" },
        { no: 5, pid: 901205, name: "고성 여름 캠핑축제", ctype: "행사", cat: "캠핑", addr: "강원 고성군 해안가 캠핑장", tel: "033-681-1046" },
        { no: 4, pid: 901204, name: "화진포 호수 걷기대회", ctype: "체험", cat: "건강걷기", addr: "강원 고성군 화진포호", tel: "033-681-1047" },
        { no: 3, pid: 901203, name: "DMZ 생태탐방전", ctype: "전시", cat: "생태전시", addr: "강원 고성군 DMZ박물관", tel: "033-681-1048" },
        { no: 2, pid: 901202, name: "고성 관광의 날 기념행사", ctype: "행사", cat: "관광행사", addr: "강원 고성군 간성읍", tel: "033-681-1049" },
        { no: 1, pid: 901201, name: "삼포 불꽃쇼", ctype: "공연", cat: "야간행사", addr: "강원 고성군 삼포해변길 9", tel: "033-681-1050" },
    ];

    /** ======================================================================================================================================== */
    return (
        <>

            {/* <!-- [좌측] 검색/리스트 시작 --> */}
            <section className="listWrap">
                {/* <!-- 조건검색창 시작 --> */}
                <div className="detailSearch">
                    <form aria-label="플레이스 조건 검색">
                        {/* 1. 카테고리 (다중 Select) */}
                        <div className="form-group category-group">
                            <label htmlFor="category-large">카테고리</label>
                            {/* 대분류 */}
                            <select id="category-large" name="categoryLarge">
                                <option value="">대분류</option>
                            </select>
                            {/* 중분류*/}
                            <select aria-label="카테고리 중분류" name="categoryMedium">
                                <option value="">중분류</option>
                            </select>
                            {/* 소분류 */}
                            <select aria-label="카테고리 소분류" name="categorySmall">
                                <option value="">소분류</option>
                            </select>
                        </div>
                        <span>
                            {/* 2. 1차 지역 */}
                            <span className="form-group">
                                <label htmlFor="region-primary">1차 지역</label>
                                <select id="region-primary" name="regionPrimary">
                                    <option value="">전체</option>
                                    <option value="seoul">서울</option>
                                    <option value="gyeonggi">경기도</option>
                                </select>
                            </span>
                            {/* 2. 2차 지역 */}
                            <span className="form-group">
                                <label htmlFor="region-secondary">2차 지역</label>
                                <select id="region-secondary" name="regionSecondary">
                                    <option value="">전체</option>
                                    <option value="gangnam">강남구</option>
                                    <option value="dongjak">동작구</option>
                                </select>
                            </span>
                        </span>
                        {/* 3. 플레이스명 */}
                        <span className="form-group">
                            <label htmlFor="place-name">플레이스명</label>
                            <input type="text" id="place-name" name="placeName" />
                        </span>

                        {/* 4. 검색 버튼*/}
                        <span className="form-actions">
                            <button type="button" className="searchBtn">검색</button>
                            <button type="button" className="btn line">초기화</button>
                        </span>
                    </form>
                </div>
                {/* <!-- 조건검색창 끝 --> */}

                {/* <!-- 목록(리스트) 테이블 시작 --> */}
                <ul className="titleBox">
                    <li className="result">검색결과 : @@개</li>
                    <li className="btnBox">
                        <select className="baseDateInput">
                            <option value="10">10개 보기</option>
                            <option value="30">30개 보기</option>
                            <option value="50">50개 보기</option>
                        </select>
                        <button type="button" className="btn line">엑셀 다운로드</button>
                        <button className="btn full" onClick={() => setShowList(true)}>레이어1</button>
                        <button className="btn full" onClick={() => setShowDetail(true)}>레이어2</button>
                    </li>
                </ul>
                {/* =============================== 1.ResizableTable(리사이징/드래그  테이블) 시작 ===================================================== */}
                <div className="tableWrap">
                    <ResizableTable
                        columns={columns}
                        data={data}
                        rememberKey="PlaceInfo.columns"
                        minColWidth={80}
                        stickyFirst={false}
                        sortable={true}
                    />
                </div>
                  {/* =============================== 1.ResizableTable(리사이징/드래그  테이블) 끝 ===================================================== */}
            </section>
            {/* <!-- [좌측] 검색/리스트 끝 --> */}
            {/* =============================== 1.DragResizeLayer(리사이징/드래그 레이어) 시작 ===================================================== */}

            {/* 조건부 렌더링(conditional rendering) : {showList && ( ... )} --> showList가 true일 때만 <DragResizeLayer> 출력 */}
            {/* 1) 목록조회 레이어 */}
            {showList && (
                <DragResizeLayer
                    layerContainerRef={layerContainerRef}
                    titleText="레이어1. 목록"
                    initialOffset={{ x: -100, y: -50 }}   // 중앙 기준 오른쪽으로 220px
                    onClose={() => setShowList(false)}
                    onCancel={() => setShowList(false)}
                    onSave={() => { alert("목록 저장 완료!"); setShowList(false); }}
                >
                    <div style={{ padding: 8 }}>
                        <p>11111 관리자 목록 데이터를 여기에 표시할 수 있습니다.관리자 목록 데이터를 여기에 표시할 수 있습니다.</p>
                        <ul>
                            <li>홍길동 - 최고관리자</li>
                            <li>김민수 - 운영자</li>
                            <li>이정은 - 콘텐츠 담당자</li>
                        </ul>
                    </div>
                </DragResizeLayer>
            )}

            {/* 2) 상세조회 레이어 (겹칠 수 있어 z-index만 살짝 높임) */}
            {showDetail && (
                <DragResizeLayer
                    layerContainerRef={layerContainerRef}
                    titleText="레이어2. 상세조회"
                    initialOffset={{ x: 100, y: 0 }}   // 중앙 기준 오른쪽으로 220px
                    onClose={() => setShowDetail(false)}
                    onCancel={() => setShowDetail(false)}
                    onSave={() => { alert("상세 저장 완료!"); setShowDetail(false); }}
                >
                    <div style={{ padding: 8 }}>
                        <p>22222 관리자 상세 정보를 여기에 표시할 수 있습니다.</p>
                        <div style={{ display: "grid", gap: 8 }}>
                            <div><strong>이름</strong> : 홍길동</div>
                            <div><strong>권한</strong> : 최고관리자</div>
                            <div><strong>상태</strong> : 활성</div>
                        </div>
                    </div>
                </DragResizeLayer>
            )}
            {/* =============================== 1.DragResizeLayer(리사이징/드래그 레이어) 끝 ===================================================== */}
        </>
    );
}// ListSection.jsx end
