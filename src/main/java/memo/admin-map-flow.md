# Admin /map 컴포넌트 흐름 개요

본 문서는 관리자 화면의 Place 관리(지도/목록/상세)와 관련된 컴포넌트 간 데이터 흐름과 스토어 연동을 요약합니다.

기준 경로: `src/main/ktour/src/admin/pages/map/place`

- 주요 컴포넌트
  - `PlaceInfo.jsx`: 좌우 분할 레이아웃의 컨테이너(좌: 목록, 우: 상세)
  - `ListSection.jsx`: 검색/필터/페이징 + 목록/행 선택
  - `DetailSection.jsx`: 기본/Intro/반복 정보 편집 패널
    - `DetailCommon1.jsx`: 기본 정보(주소/좌표/이미지/콘텐츠유형 등)
    - `TourIntro2.jsx`: 콘텐츠유형 1(관광지) 세부
    - `FestivalIntro2.jsx`: 콘텐츠유형 3(행사/공연/축제) 세부
    - `RestaurantIntro2.jsx`: 콘텐츠유형 8(음식점) 세부
    - `DetailRepeat3.jsx`: 반복 정보(제목/내용) 편집
- 공용 컴포넌트(일부)
  - `SplitPaneResponsive`, `ResizableTableAtplace`, `CategorySelect`, `RegionSelect`, `Pagination`
- 스토어/유틸
  - `@admin/store/placeSlice.ts`: 목록/상세/저장 thunk + 상태
  - `@admin/store/axios.ts`: axios 인스턴스(baseURL/인터셉터)

---

## 전체 흐름(요약 다이어그램)

```
PlaceInfo
 ├─ left:  ListSection  ── onRowClick → dispatch(fetchPlaceDetail(pno))
 │                                 └→ PlaceInfo.selectedPno 변경
 └─ right: DetailSection ── useSelector(detail, contentType)
                ├─ DetailCommon1  ── onChangeContentType → dispatch(setContentType)
                ├─ TourIntro2     ── dispatch(saveTourIntro)     ↘
                ├─ FestivalIntro2 ── dispatch(saveFestivalIntro)  ↘→ 각 save thunk 내부에서 fetchPlaceDetail 재조회
                ├─ RestaurantIntro2 ─ dispatch(saveRestaurantIntro) ↗
                └─ DetailRepeat3  ── dispatch(saveRepeatInfo)     ↗
```

---

## 컨테이너: PlaceInfo.jsx

- 좌우 분할: `SplitPaneResponsive`에 `left=<ListSection/>`, `right=<DetailSection/>` 제공
- 행 선택: `ListSection`의 `onRowClick` 또는 `onPick` 콜백에서 `fetchPlaceDetail(pno)` 디스패치
- 우측 리셋: 전역 `selectedPno` 변화 감지 → `detailKey` 증가로 `DetailSection` 강제 재마운트(폼 로컬 상태 초기화)

```mermaid
flowchart LR
  A[ListSection
  (onRowClick)] -->|pno| B[dispatch
  fetchPlaceDetail]
  B --> C[store.selectedPno]
  C --> D[PlaceInfo useEffect
  key 증가]
  D --> E[DetailSection
  재마운트]
```

---

## 목록: ListSection.jsx

- 검색 폼: 콘텐츠유형, 노출상태, 카테고리, 지역, 주소 키워드, 장소명, 장소번호
- 조회: `setListFilters(params)` → `setPage(1)` → `fetchPlaceList()`
- 페이징: `onPageChange/onSizeChange`에서 전역 `page/size` 갱신 후 `fetchPlaceList()`
- 목록/행 선택: `ResizableTable`의 `onRowClick`에서 `fetchPlaceDetail(pno)` 디스패치(+ `onPick` 호환 호출)
- 전역 저장: `placeSlice`에 `rows/total/page/size/filters` 보관(페이지 이탈 후 복귀 시 유지)

---

## 상세 패널: DetailSection.jsx

- 데이터 소스: 기본적으로 스토어 `detail`(없으면 prop.detail)
- 콘텐츠유형: `contentType`(스토어) 우선, 없으면 `placeInfo.ctNo`, 둘 다 없으면 기본값 `1`
- 탭/세부 섹션
  - `DetailCommon1`: 기본 정보 편집 + 저장 시 `saveBasic(FormData)`
  - `TourIntro2`: `effectiveCt===1`일 때 노출 + `saveTourIntro(dto)`
  - `FestivalIntro2`: `effectiveCt===3`일 때 노출 + `saveFestivalIntro(dto)`
  - `RestaurantIntro2`: `effectiveCt===8`일 때 노출 + `saveRestaurantIntro(dto)`
  - `DetailRepeat3`: 반복 정보 목록 편집 + `saveRepeatInfo({pNo, rows})`
- 새 등록: `handleNew`에서 로컬 상세 초기화 + `clearDetail()` + `setContentType('1')`

---

## 기본 정보: DetailCommon1.jsx

- 주소/좌표
  - Daum Postcode로 기본 주소/우편번호 선택
  - Kakao Maps 지오코딩으로 좌표 설정(마커 드래그 가능)
- 업로드
  - `FormData`에 JSON Blob(`placeInfo`, `marker`, `imagesMeta`)과 파일(`markerImage`, `mainImage`, `detailImages`) 첨부
- 저장
  - `dispatch(saveBasic(fd))` → 성공 시 thunk 내부에서 `fetchPlaceDetail(pno)` 재디스패치로 상세 갱신
- 콘텐츠유형 변경
  - 셀렉트 변경 시 `onChangeContentType(v)` → 상위에서 `setContentType(v)` 디스패치

---

## Intro 세부: TourIntro2 / FestivalIntro2 / RestaurantIntro2

- 폼 수집: `formRef + FormData` 기반 수집 함수 `collect()`
- 변경 판단: `isChanged(curr)`로 지정 키만 문자열 비교
- DTO 공통 규칙
  - 기본키: `tiNo`/`fiNo`/`riNo` → 없으면 0(신규), 있으면 변경 여부 따라 상태 부여
  - 장소키: `pNo/pno/PNO` 혼재 보정 후 `pno` 숫자 변환
  - 상태: 신규 1, 수정 2, 변경없음 0
- 저장: 각자 `saveTourIntro/saveFestivalIntro/saveRestaurantIntro` 디스패치(성공 시 상세 재조회)

---

## 반복 정보: DetailRepeat3.jsx

- 로컬 상태: `rows`(편집용 목록), `deleted`(삭제 표시된 기존 행), `originalRef`(원본 스냅샷)
- 행 조작: 추가/삭제표시/단일필드 수정
- 상태 규칙(`pirStatus`)
  - 신규 1, 수정 2, 변경없음 0, 삭제 3
  - 서버 payload 키는 `pno`로 통일
- 저장: `saveRepeatInfo({ pNo, rows: payload })` → 성공 시 스냅샷 갱신 + 삭제목록 초기화

---

## 스토어(placeSlice) 및 API

- 상태
  - 목록: `rows, total, listRaw, filters, page, size`
  - 상세: `detail, loading, error, selectedPno, contentType`
- 주요 액션/리듀서
  - `setListFilters, setPage, setSize, setContentType, clearDetail`
- Thunk
  - `fetchPlaceList(params?)` → GET `/placeinfo/search`
  - `fetchPlaceDetail(pno)` → GET `/placeinfo/basic`
  - `saveBasic(FormData)` → POST `/placeinfo/basic` (multipart)
  - `saveTourIntro(dto)` → POST `/placeinfo/tourIntro`
  - `saveFestivalIntro(dto)` → POST `/placeinfo/festivalintro`
  - `saveRestaurantIntro(dto)` → POST `/placeinfo/restaurant`
  - `saveRepeatInfo({pNo, rows})` → POST `/placeinfo/repeatinfo`
- 공통
  - 저장 성공 시, 가능하면 `fetchPlaceDetail(pno)` 재조회로 우측 상세를 최신으로 유지

---

## Axios 인스턴스

- 위치: `src/main/ktour/src/admin/store/axios.ts`
- 설정: `VITE_API_BASE_URL` 기반 `baseURL` + 요청/응답 인터셉터(에러 공통 처리)

---

## 기타 메모

- `pno/pNo/PNO` 키 혼재가 있어, 클릭/저장 시 모두 보정하여 사용합니다.
- 에디터 저장 인코딩을 UTF-8(무 BOM)으로 고정하면 한글 깨짐 재발을 줄일 수 있습니다.
- `copy/` 폴더는 백업용 사본으로 사용 중이며, 본 적용에서는 수정하지 않습니다.

