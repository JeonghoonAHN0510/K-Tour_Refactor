-- ------------------------------------ k_tour_headquarter -------------------------------------------
-- ------------------------------------ DROP TABLE -------------------------------------------
DROP TABLE IF EXISTS k_tour_headquarter.pushPopup;			# 푸시알림/팝업(*자체 테이블)
DROP TABLE IF EXISTS k_tour_headquarter.manager;			# 관리자정보(*자체 테이블)
DROP TABLE IF EXISTS k_tour_headquarter.siteInfo;			# 사이트정보(*자체 테이블)
DROP TABLE IF EXISTS k_tour_headquarter.placeInfoRepeat;   	# 플레이스 반복정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.restaurantIntro;	# 음식점(39) 상세정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.festivalIntro; 		# 축제공연행사(15) 상세정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.tourIntro;			# 관광지(12) 상세정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.detailPetTour;		# 반려동물 동반여행 상세정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.placeImageDetail;	# 플레이스 상세이미지(*api)
DROP TABLE IF EXISTS k_tour_headquarter.markersGPS;			# 지도마커GPS(*api)
DROP TABLE IF EXISTS k_tour_headquarter.placeInfo;			# 플레이스 기본정보(*api)
DROP TABLE IF EXISTS k_tour_headquarter.contentType;		# 콘텐츠타입(*api: 총8개 타입) 1.관광지(12) 2.문화시설(14) 3.행사공연축제(15) 4.여행코스(25) 5.레포츠(28) 6.숙박(32) 7.쇼핑(38) 8.음식점(39)
DROP TABLE IF EXISTS k_tour_headquarter.categoryCode;		# 분류체계코드(*api)
DROP TABLE IF EXISTS k_tour_headquarter.ldongCode;			# 법정동코드(*api)

-- ------------------------------------ 법정동코드( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.ldongCode (
	ldNo SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,		-- 법정동코드번호[PK] *첫글자 주의! L의 소문자 l 임.
    rnum SMALLINT UNSIGNED NOT NULL,						-- 일련번호(#TourAPI 연동컬럼)
    lDongRegnCd CHAR(5) NOT NULL, 							-- 시도코드(#TourAPI 연동컬럼) *36110 : 세종특별자치시 
    lDongRegnNm VARCHAR(20) NOT NULL, 						-- 시도명(#TourAPI 연동컬럼)
    lDongSignguCd CHAR(5) NOT NULL, 						-- 시군구코드(#TourAPI 연동컬럼)
    lDongSignguNm VARCHAR(20) NOT NULL, 					-- 시군구명(#TourAPI 연동컬럼)
    isActivate BOOLEAN DEFAULT FALSE, 						-- 활성화여부(false:비노출, true:노출) ※DB복사시 법정동 코드를 갖는 다른 테이블/데이터 복사설정 : 본사는 모두 true 업체는 부분 true
    mapy DECIMAL(13,10) NOT NULL, 							-- 중심지역위도(시/군/구청 기준 지역중심 좌표)
    mapx DECIMAL(13,10) NOT NULL, 							-- 중심지역경도(시/군/구청 기준 지역중심 좌표)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP				
);

-- ------------------------------------ 분류체계코드( #TourAPI 연동테이블 )  -------------------------------------------
CREATE TABLE k_tour_headquarter.categoryCode (
	ccNo SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 분류체계번호[PK]
    rnum SMALLINT NOT NULL,										-- 일련번호(#TourAPI 연동컬럼)
    lclsSystm1Cd CHAR(9) NOT NULL, 								-- 대분류코드(#TourAPI 연동컬럼)
    lclsSystm1Nm VARCHAR(15) NOT NULL, 							-- 대분류명(#TourAPI 연동컬럼)
    lclsSystm2Cd CHAR(18) NOT NULL,								-- 중분류코드(#TourAPI 연동컬럼)
    lclsSystm2Nm VARCHAR(30) NOT NULL, 							-- 중분류명(#TourAPI 연동컬럼)
    lclsSystm3Cd CHAR(30) NOT NULL,								-- 소분류코드(#TourAPI 연동컬럼)
    lclsSystm3Nm VARCHAR(30) NOT NULL,							-- 소분류명(#TourAPI 연동컬럼)
    isActivate BOOLEAN DEFAULT TRUE, 							-- 활성화여부(FALSE:비노출, TRUE:노출) ※DB복사시 카테고리 코드를 갖는 다른 테이블/데이터 복사설정 : 본사는 모두 true 업체는 부분 true
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,				-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL								-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------ 콘텐츠타입( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.contentType (
    ctNo TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,       -- 콘텐츠타입No[PK]
    contenttypeid VARCHAR(5) NOT NULL,                		-- 콘텐츠타입ID( *TourAPI연동 컬럼* )
    contentTypeName VARCHAR(30) NOT NULL,           		-- 콘텐츠타입명
    defaultMarker VARCHAR(255) NOT NULL,           			-- 기본마커이미지
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,         	-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
    memo TEXT                                       		-- 비고
);

-- ------------------------------------ Place 기본정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.placeInfo (
	pNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- place번호[PK]
    ctNo TINYINT UNSIGNED,									-- 콘텐츠타입번호[FK]
    ldNo SMALLINT UNSIGNED,									-- 법정동코드번호[FK] *첫글자 주의! L의 소문자 l 임.
    ccNo SMALLINT UNSIGNED,									-- 분류체계번호[FK]
    isEditable BOOLEAN DEFAULT TRUE,						-- 수정 가능 여부
    contentid INT,									        -- 콘텐츠ID(#TourAPI 연동컬럼)
    title VARCHAR(255) NOT NULL,							-- 콘텐츠명/제목 (#TourAPI 연동컬럼)
    showflag TINYINT DEFAULT 0,								-- 콘텐츠 표출여부(#TourAPI 연동컬럼)
    firstimage VARCHAR(255),								-- 대표원본이미지(#TourAPI 연동컬럼)
    firstimage2 VARCHAR(255),								-- 대표섬네일이미지(#TourAPI 연동컬럼)
    addr1 VARCHAR(255) NOT NULL,							-- 기본주소(#TourAPI 연동컬럼)
    addr2 VARCHAR(100),										-- 상세주소(#TourAPI 연동컬럼)
    zipcode VARCHAR(10),									-- 우편번호(#TourAPI 연동컬럼)
    homepage TEXT,											-- 홈페이지링크(#TourAPI 연동컬럼)
    tel TEXT,												-- 전화(#TourAPI 연동컬럼)
    telname VARCHAR(30),									-- 전화번호명(#TourAPI 연동컬럼)
    overview TEXT,											-- 개요(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
	CONSTRAINT fk_placeInfo_contentType
		FOREIGN KEY (ctNo) REFERENCES contentType(ctNo)
		ON UPDATE CASCADE
		ON DELETE SET NULL,
      
	CONSTRAINT fk_placeInfo_ldongCode
		FOREIGN KEY (ldNo) REFERENCES ldongCode(ldNo)
		ON UPDATE CASCADE
		ON DELETE SET NULL,
      
	CONSTRAINT fk_placeInfo_categoryCode
		FOREIGN KEY (ccNo) REFERENCES categoryCode(ccNo)
		ON UPDATE CASCADE
		ON DELETE SET NULL
);
CREATE INDEX idx_contentid ON k_tour_headquarter.placeInfo(contentid);

-- ------------------------------------ 지도마커GPS( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.markersGPS (
	mkNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 마커번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    mkURL VARCHAR(255),										-- 마커이미지경로
    mapx DECIMAL(13,10),									-- GPS X좌표(#TourAPI 연동컬럼)
    mapy DECIMAL(13,10),									-- GPS Y좌표(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
                 ON UPDATE CURRENT_TIMESTAMP,
                 
   CONSTRAINT fk_makersGPS_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
CREATE INDEX idx_mapGPS ON k_tour_headquarter.markersGPS(mapx, mapy);
-- ------------------------------------ place 상세이미지( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.placeImageDetail (
	pidNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 상세이미지번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    isEditable BOOLEAN DEFAULT TRUE,						-- 수정 가능 여부
    serialnum VARCHAR(11),									-- 이미지일련번호(#TourAPI 연동컬럼)
    originimgurl VARCHAR(255),								-- 원본이미지(#TourAPI 연동컬럼)
    smallimageurl VARCHAR(255),								-- 썸네일이미지(#TourAPI 연동컬럼)
    imgname VARCHAR(100),									-- 이미지명(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
   CONSTRAINT fk_placeImageDetail_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 반려동물 동반여행 정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.detailPetTour (
	dptNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 반려동물 동반여행 번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    relaAcdntRiskMtr TEXT,									-- 관련 사고 대비사항(#TourAPI 연동컬럼)
    acmpyTypeCd VARCHAR(50),								-- 동반유형코드(동반구분)(#TourAPI 연동컬럼)
    relaPosesFclty TEXT,									-- 관련 구비 시설(#TourAPI 연동컬럼)
    relaFrnshPrdlst VARCHAR(255),							-- 관련 비치 품목(#TourAPI 연동컬럼)
    etcAcmpyInfo TEXT,										-- 기타 동반 정보(#TourAPI 연동컬럼)
    relaPurcPrdlst VARCHAR(255),							-- 관련 구매 품목(#TourAPI 연동컬럼)
    acmpyPsblCpam TEXT,										-- 동반가능동물(#TourAPI 연동컬럼)
    relaRntlPrdlst VARCHAR(255),							-- 관련 렌탈 품목(#TourAPI 연동컬럼)
    acmpyNeedMtr VARCHAR(50),								-- 동반시 필요사항(#TourAPI 연동컬럼)
    petTursmInfo VARCHAR(255),								-- 반려동물 관광정보(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
	CONSTRAINT fk_detailPetTour_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 관광지 소개정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.tourIntro (
	tiNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,		-- 관광지소개번호[PK]
    pNo INT UNSIGNED,									-- place번호[FK]
    accomcount VARCHAR(255),							-- 수용인원(#TourAPI 연동컬럼)
    chkbabycarriage VARCHAR(255),						-- 유모차대여정보(#TourAPI 연동컬럼)
    chkcreditcard VARCHAR(10),							-- 신용카드가능정보(#TourAPI 연동컬럼)
    chkpet VARCHAR(10),									-- 애완동물동반가능정보(#TourAPI 연동컬럼)
    expagerange VARCHAR(255),							-- 체험가능연령(#TourAPI 연동컬럼)
    expguide VARCHAR(255),								-- 체험안내(#TourAPI 연동컬럼)
	heritage1 VARCHAR(255),								-- 세계문화유산유무1(#TourAPI 연동컬럼)
    heritage2 VARCHAR(10),								-- 세계문화유산유무2(#TourAPI 연동컬럼)
    heritage3 VARCHAR(10),								-- 세계문화유산유무3(#TourAPI 연동컬럼)
    infocenter VARCHAR(255),							-- 문의및안내(#TourAPI 연동컬럼)
    opendate VARCHAR(255),								-- 개장일(#TourAPI 연동컬럼)
    parking VARCHAR(255),								-- 주차시설(#TourAPI 연동컬럼)
    restdate VARCHAR(255),								-- 쉬는날(#TourAPI 연동컬럼)
    useseason VARCHAR(255),								-- 이용시기(#TourAPI 연동컬럼)
    usetime VARCHAR(255),								-- 이용시간(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,		-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL						-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
    CONSTRAINT fk_tourIntro_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 축제행사공연 소개정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.festivalIntro (
	fiNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 축제행사번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    eventstartdate VARCHAR(255),							-- 행사시작일(#TourAPI 연동컬럼)
    eventenddate VARCHAR(255),								-- 행사종료일(#TourAPI 연동컬럼)
    progresstype VARCHAR(10),								-- 진행상태정보(#TourAPI 연동컬럼)
    festivaltype VARCHAR(10),								-- 축제유형명(#TourAPI 연동컬럼)
    agelimit VARCHAR(255),									-- 관람가능연령(#TourAPI 연동컬럼)
    bookingplace VARCHAR(255),								-- 예매처(#TourAPI 연동컬럼)
    discountinfofestival VARCHAR(255),						-- 할인정보(#TourAPI 연동컬럼)
    eventhomepage VARCHAR(255),								-- 행사홈페이지(#TourAPI 연동컬럼)
	eventplace VARCHAR(255),								-- 행사장소(#TourAPI 연동컬럼)
    festivalgrade VARCHAR(255),								-- 축제등급(#TourAPI 연동컬럼)
    placeinfo VARCHAR(255),									-- 행사장위치안내(#TourAPI 연동컬럼)
    playtime VARCHAR(100),									-- 공연시간(#TourAPI 연동컬럼)
    program VARCHAR(255),									-- 행사프로그램(#TourAPI 연동컬럼)
    spendtimefestival VARCHAR(255),							-- 관람소요시간(#TourAPI 연동컬럼)
    sponsor1 VARCHAR(30),									-- 주최자정보(#TourAPI 연동컬럼)
    sponsor1tel VARCHAR(50),								-- 주최자연락처(#TourAPI 연동컬럼)
    sponsor2 VARCHAR(100),									-- 주관사정보(#TourAPI 연동컬럼)
    sponsor2tel TEXT,										-- 주관사연락처(#TourAPI 연동컬럼)
    subevent VARCHAR(255),									-- 부대행사(#TourAPI 연동컬럼)
    usetimefestival VARCHAR(100),							-- 이용요금(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
	
	CONSTRAINT fk_festivalIntro_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 음식점 소개정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.restaurantIntro (
	riNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- 음식점소개 번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    chkcreditcardfood VARCHAR(100),							-- 신용카드가능정보(#TourAPI 연동컬럼)
    discountinfofood VARCHAR(255),							-- 할인정보(#TourAPI 연동컬럼)
    firstmenu VARCHAR(100),									-- 대표메뉴(#TourAPI 연동컬럼)
    infocenterfood VARCHAR(255),							-- 문의및안내(#TourAPI 연동컬럼)
    kidsfacility TINYINT UNSIGNED DEFAULT 0,				-- 어린이놀이방여부(#TourAPI 연동컬럼)
    lcnsno VARCHAR(12),										-- 인허가번호(#TourAPI 연동컬럼)
    opendatefood VARCHAR(100),								-- 개업일(#TourAPI 연동컬럼)
    opentimefood VARCHAR(255),								-- 영업시간(#TourAPI 연동컬럼)
    packing VARCHAR(100),									-- 포장가능(#TourAPI 연동컬럼)
    parkingfood VARCHAR(100),								-- 주차시설(#TourAPI 연동컬럼)
    reservationfood VARCHAR(255),							-- 예약안내(#TourAPI 연동컬럼)
    restdatefood VARCHAR(100),								-- 쉬는날(#TourAPI 연동컬럼)
    scalefood VARCHAR(100),									-- 규모(#TourAPI 연동컬럼)
    seat VARCHAR(100),										-- 좌석수(#TourAPI 연동컬럼)
    smoking VARCHAR(100),									-- 금연/흡연여부(#TourAPI 연동컬럼)
    treatmenu TEXT,											-- 취급메뉴(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
	CONSTRAINT fk_restaurantIntro_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ Place 반복정보( #TourAPI 연동테이블 ) -------------------------------------------
CREATE TABLE k_tour_headquarter.placeInfoRepeat (
	pirNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,			-- place반복번호[PK]
    pNo INT UNSIGNED,										-- place번호[FK]
    fldgubun TINYINT UNSIGNED,								-- 구분일련번호(#TourAPI 연동컬럼)
    infoname VARCHAR(30),									-- 제목(#TourAPI 연동컬럼)
    infotext TEXT,											-- 내용(#TourAPI 연동컬럼)
    serialnum TINYINT UNSIGNED NOT NULL,					-- 반복일련번호(#TourAPI 연동컬럼)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,			-- 등록일(최초 DB복사일)
    updatedAt DATETIME DEFAULT NULL							-- 수정일(DB업데이트일/해당 레코드 수정일)
              ON UPDATE CURRENT_TIMESTAMP,
                 
	CONSTRAINT fk_placeInfoRepeat_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 사이트정보(자체 테이블) -------------------------------------------
CREATE TABLE k_tour_headquarter.siteInfo (
	siNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,   -- 사이트번호[PK]
    siName VARCHAR(50) NOT NULL UNIQUE,             -- 사이트명
    siDomain VARCHAR(100) NOT NULL UNIQUE,          -- 도메인(URL)
    siIntro VARCHAR(255),                           -- 사이트소개글
    siLogo VARCHAR(255),                            -- 사이트로고이미지
    siFavicon VARCHAR(255),                         -- 파비콘이미지
    siMarker VARCHAR(255),                          -- 마커이미지
    siTel VARCHAR(20),                              -- 대표전화
    siPrivacyOfficer VARCHAR(30),                   -- 개인정보처리책임자
    siEmail VARCHAR(100),                           -- 대표이메일
    siKeywords VARCHAR(255),                        -- 사이트 검색키워드
    siIsPublic TINYINT NOT NULL DEFAULT 0,       	-- 사이트 공개여부(0 : 비공개, 1 : 공개)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 	-- 생성일시
    updatedAt DATETIME DEFAULT NULL 				-- 수정일시
              ON UPDATE CURRENT_TIMESTAMP,        
    siMemo TEXT                                     -- 메모
);

-- ------------------------------------ 관리자정보(자체 테이블) -------------------------------------------
CREATE TABLE k_tour_headquarter.manager (
	mgNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 					-- 관리자No[PK]
    siNo INT UNSIGNED,												-- 사이트No[FK]
    mId VARCHAR(60) NOT NULL UNIQUE,                              	-- 아이디
    mPwd VARCHAR(60) NOT NULL,                                    	-- 패스워드
    mName VARCHAR(60) NOT NULL,                              		-- 이름
    mNick VARCHAR(60) NOT NULL UNIQUE,                            	-- 닉네임
    mGender ENUM('남', '여') NOT NULL,                      		  	-- 성별
    mPhone VARCHAR(16) NOT NULL UNIQUE,                           	-- 전화번호
    mEmail VARCHAR(255) NOT NULL UNIQUE,                          	-- 이메일
	zipCode VARCHAR(15) NOT NULL,                                   -- 우편번호
    mAddr1 VARCHAR(255) NOT NULL,                                  	-- 도로명 주소
    mAddr2 VARCHAR(255),                                           	-- 상세 주소
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                  	-- 가입일
    updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,	-- 수정일
    deletedAt DATETIME DEFAULT NULL,                             	-- 탈퇴일
    mTermsAgreed BOOLEAN NOT NULL,                                	-- 이용약관 동의
    mLocationAgreed BOOLEAN NOT NULL,                             	-- 위치정보 동의
    mPushAgreed BOOLEAN NOT NULL,                                 	-- 푸시알림 동의
    memo TEXT,                                       				-- 이슈/메모
    mType TINYINT UNSIGNED NOT NULL DEFAULT 1,                      -- 회원유형(0=관리자회원, 1=일반회원, 2=사업자, 3=단체,모임)
    mgAuth TINYINT UNSIGNED NOT NULL DEFAULT 1,                     -- 관리자유형(0=시스템관리자, 1=업체(지자체)관리자)
    
	CONSTRAINT fk_manager_siteInfo
		FOREIGN KEY (siNo) REFERENCES siteInfo(siNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- ------------------------------------ 푸시알림/팝업(자체 테이블) -------------------------------------------
CREATE TABLE k_tour_headquarter.pushPopup (
	ppNo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,		-- 푸시팝업No[PK]
    pNo INT UNSIGNED,					        		-- place번호[FK]
    mgNo INT UNSIGNED,									-- 관리자No[FK]
    ppTitle VARCHAR(150) NOT NULL,						-- 제목
    ppContent VARCHAR(255),								-- 내용
    ppImg VARCHAR(255),									-- 이미지
    ppUse TINYINT NOT NULL,				                -- 사용구분(1.푸시알림+팝업 / 2.푸시알림 / 3.팝업)
    ppType TINYINT NOT NULL,				            -- 카테고리(1.공지 / 2.이벤트)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,		-- 작성일
    updatedAt DATETIME DEFAULT NULL						-- 수정일
			  ON UPDATE CURRENT_TIMESTAMP,
	ppStart DATETIME NOT NULL,							-- 노출시작일
    ppEnd DATETIME NOT NULL,							-- 노출종료일
    ppIterated TIME,									-- 푸시알림 시간(*09~20시 사이 분단위)
    
	CONSTRAINT fk_pushPopup_placeInfo
		FOREIGN KEY (pNo) REFERENCES placeInfo(pNo)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
        
	CONSTRAINT fk_pushPopup_manager
		FOREIGN KEY (mgNo) REFERENCES manager(mgNo)
		ON UPDATE CASCADE
		ON DELETE SET NULL
);
-- -------------------------- 토큰 저장 ----------------------------------------
CREATE TABLE k_tour_headquarter.push_token(
	token      VARCHAR(255) NOT NULL PRIMARY KEY,   -- PK
	createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
				 ON UPDATE CURRENT_TIMESTAMP
);