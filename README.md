# 🌏 K.TOUR – SaaS 기반 테마형 관광지도 플랫폼
> **공공데이터 기반 구독자별 맞춤형 DB 제공 & 자체 CRUD 가능한 웹/앱 서비스**

[🔗 GitHub Repository](https://github.com/JeonghoonAHN0510/K-Tour_Refactor)  

---

## 🧭 프로젝트 개요

**K.TOUR**는 공공데이터를 활용하여 지자체·기관·소상공인을 위한  
**SaaS 기반 테마형 관광지도 플랫폼**을 구축한 프로젝트입니다.  

기존 지도 서비스(Naver, Kakao 등)의 과다한 정보와 복잡한 UI를 개선하고,  
**지역별 특화 관광정보**만을 선별하여, **사용자 맞춤형 관광지도 서비스**를 제공합니다.

- **개발기간:** 2025.09.26 ~ 2025.10.31 (4주)  
- **팀명:** K.TOUR (2조)  
- **인원:** 4명  
  - **옹태경** – PM / API DB 정규화 / Git 관리 / 관광정보관리(CRUD)
  - **안정훈** – 백엔드 총괄 / 발표  / SaaS 기반 멀티테넌시 설계  
  - **정은주** – API 명세 정의 / 푸시·팝업 관리(CRUD) / FireBase
  - **김진숙** – 프로젝트 기획 / 공통 컴포넌트 / UI 최적화  / UI/UX

---


## 🚀 핵심 목표

| 구분 | 설명 |
|------|------|
| 🎯 **공공데이터 기반 맞춤형 DB 구축** | 관광공사 API를 ETL → 정규화 → SaaS 구조로 제공 |
| 🏛️ **지자체별 커스터마이징 지원** | 구독자(도메인)별 전용 DB 제공 및 CRUD 기능 |
| 🧩 **멀티테넌시 구조 설계** | Root.Lab(본사) → 구독자 DB 자동 생성·복사 |
| 💬 **사용자 친화적 인터페이스** | 반응형 웹 + 접근성 강화 + 다국어 UI |
| 📱 **모바일·PWA 확장성 확보** | 푸시 알림, 위치 기반 이벤트, NFC/비콘 연동 |

---

## ⚙️ 개발환경

| 분류 | 기술 스택 |
|------|-------------|
| **Frontend** | React, JavaScript, CSS |
| **Backend** | Java, Spring Boot, MyBatis |
| **Database** | MySQL (멀티테넌시 기반) |
| **Infra / Tooling** | GitHub, JIRA, Google Sheets, Firebase |
| **API 연동** | 한국관광공사 TourAPI 4.0, Kakao Map API |
| **Version Control** | Git / GitHub |

---

## 🧱 아키텍처 개요

### 🗂 멀티테넌시 구조
본사 Root.Lab DB

├─ 표준화/정규화된 공공데이터 저장

├─ 구독자 요청 시 DB 자동 복사·생성

└─ 테넌트별 CRUD 및 API 독립 운영


- DB 품질 보증 및 정규화
- 각 도메인(고성·보성·부여 등)별 개별 DB 관리
- SaaS 기반 구독형 구조 → B2G/B2B/B2C 확장 가능

### 💡 주요 기술 포인트
- **CommonRepository** 패턴:  
  페이징·검색 공통 인터페이스(`PageRequest`, `Criteria`, `Page<T>`)
- **Dynamic DB Routing**:  
  URL에서 테넌트 ID 추출 → 동적 DB 연결
- **Lazy Loading / Async Decoding**:  
  지도 이미지 및 마커 성능 최적화
- **Multipart/FormData 업로드 처리**:  
  `PushPopupController` 내 이미지 CRUD 구현
- **React 공통 컴포넌트화**:  
  모달, 리사이징 테이블, Sticky Header 등 재사용 모듈 구성

---

## 🧩 주요 기능

### 👩‍💼 관리자단 (Admin)
- 관광정보 관리 (CRUD)
- 회원/사이트 현황 조회
- 푸시·팝업 배너 관리 (이미지 업로드 포함)

### 🙋 사용자단 (User)
- 지역별/테마별 관광정보 지도 조회
- KakaoMap API 기반 마커 출력
- 관광코스 커스텀 및 일정 추천
- 다국어 번역(추가 예정)
- Firebase 기반 알림 및 배너 슬라이드

---

## 🗃️ 데이터 모델링

- **TourAPI 원본 데이터 10종 분석**
- **정규화된 11개 테이블 설계 (관광지·행사·숙박·지역코드 등)**
- **ERD 기반 구조**
  - `placeInfo`, `categoryCode`, `ldongCode`, `detailCommon2`, `detailIntro2` 등
- **DB Migration Logic**
  - Origin → Headquarter(본사) → Subscriber(구독자)

---

## 🔍 코드 구조 (주요 경로)

RootLab/

├─ src/

│ ├─ main/java/rootLab/

│ │ ├─ controller/

│ │ │ └─ PushPopupController.java

│ │ ├─ model/

│ │ │ ├─ repository/CommonRepository.java

│ │ │ └─ dto, mapper 등

│ │ └─ service/

│ └─ main/ktour/src/

│ ├─ admin/

│ │ ├─ pages/site/push_popup/PushPopup.jsx

│ │ └─ components/common/ (모달·테이블 공통 UI)

│ └─ user/

│ ├─ pages/

│ └─ components/

└─ resources/

└─ sql/

---

## 🧰 트러블슈팅 요약

| 문제 | 원인 | 해결 |
|------|------|------|
| 카테고리 검색 SQL 오류 | 그룹 분류코드 미정규화 | 코드 길이별 LIKE 조건 처리 |
| 지도 로딩 지연 | 이미지·마커 과다 | `loading="lazy"`, `decoding="async"` 적용 |
| Multipart 업로드 시 DTO 바인딩 실패 | `@RequestBody`와 `multipart/form-data` 충돌 | `@ModelAttribute`로 전환 및 `FormData.append()` 처리 |
| 관리자 CSS 충돌 | React SPA 구조로 인한 스타일 오염 | 페이지별 CSS 스코프 분리 및 전역 스타일 정리 |

---

## 🧭 향후 개발 계획

| 구분 | 내용 |
|------|------|
| 🌐 **다국어(영문) 버전** | AI 실시간 번역 연동 |
| 📶 **IoT 기반 서비스** | NFC/비콘 기반 관광 이벤트 (발도장·포인트·쿠폰) |
| 🤖 **AI 큐레이션 고도화** | 관광데이터 기반 추천 알고리즘 강화 |
| 🔒 **보안 강화** | Spring Security 기반 회원 인증·암호화 |
| 🗺 **공공데이터 자동 갱신 로직** | API 주기적 동기화 (전국 관광정보 반영) |

---

## 📈 기대효과

- 지역 축제 및 관광 데이터의 **통합·시각화**
- 공공데이터의 **민간 활용 촉진**
- **소외지역 관광 활성화 및 경제효과 창출**
- 구독형 SaaS 공급을 통한 **지속 가능한 수익 모델**
- 장애인·노령층 등 **관광약자 접근성 강화**

---

## 🏁 프로젝트 후기

> “**데이터 구조와 API 이해, 상태관리, 코드 일관성의 중요성**을 체감한 프로젝트였습니다.”  
> - K.TOUR Team Members

---
