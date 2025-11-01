-- ------------------------------------ 사이트정보(자체 테이블) -------------------------------------------
INSERT INTO SiteInfo
    (siName, siDomain, siIntro, siLogo, siFavicon, siMarker, siTel, siPrivacyOfficer, siEmail, siKeywords, siIsPublic)
VALUES
	('본사 사이트', 'ktour.kr', '본사의 메인 사이트입니다.', 'headquarterLogo.png', 'headquarterFavicon.png',
     'headquarterMarker.jpg', '032-521-8889', '김진숙', 'ktour@tjoeun.com', 'ktour, 여행지도, SaaS', 1),
	('고성군 놀러가자!', 'goseong.rootlab.kr', 'DMZ와 맞닿은 침복단의 청정 자연, 에메랄드빛 동해 바다와 금강산의 수려한 산세가 어우러진 평화와 힐링의 땅입니다.<이하 생략···>', 'goseongLogo.png', 'goseongFavicon.png',
     'goseongMarker.jpg', '033-680-3114', '이상근', 'goseong@tjoeun.com', '해수욕장, 전망대, 강원도, 동해, 바다, 여행, 명소', 1);

-- ------------------------------------ 관리자정보(자체 테이블) -------------------------------------------
INSERT INTO manager 
    (siNo, mId, mPwd, mName, mNick, mGender, mPhone, mEmail, 
     mAdd1, mAdd2, mTermsAgreed, mLocationAgreed, mPushAgreed, memo, mgAuth)
VALUES
-- 1. 시스템 관리자
	(1,'admin','admin', '김진숙', 'admin', '여', '032-111-2222', 'root.kjs82@gmail.com',
     '인천광역시 부평구 경원대로 1368', NULL, TRUE, TRUE, TRUE, '본사(시스템관리자)입니다.', 1),
-- 2. 지자체 관리자
	(2, 'goseong', 'goseong', '고길동', 'goseong', '남', '033-880-3114', 'goseong@tjeoun.com',
     '강원도 고성군 간성읍 간성중앙길 7', NULL, TRUE, TRUE, TRUE, '251014 고성관리자 입니다.', 2);

-- ------------------------------------ 콘텐츠타입( #TourAPI 연동테이블 ) -------------------------------------------
INSERT INTO contentType 
    (contenttypeid, contentTypeName, defaultMarker)
VALUES
    ('12', '관광지', 'tourSpot.png'),
    ('14', '문화시설', 'culturalFacilities.png'),
    ('15', '행사/공연/축제', 'festival.png'),
    ('25', '여행코스', 'travelCourse.png'),
    ('28', '레포츠', 'leports.png'),
    ('32', '숙박', 'stay.png'),
    ('38', '쇼핑', 'shopping.png'),
    ('39', '음식점', 'food.png');

-- ------------------------------------ 푸시 알람 (+배너) -------------------------------------------
INSERT INTO pushPopup
	(pNo, mgNo, ppTitle, ppContent, ppImg, ppUse, ppType, ppStart, ppEnd, ppIterated)
VALUES
-- 송지호 해수욕장 페스티벌
	('20543', 1, '송지호 해수욕장 페스티벌', '9월 6일(토) 송지호 해수욕장에서 휴스테이와 함께합니다! 초대가수: 센턴, 우즈',
	 "songjihoFestival.jpg", 1, 2, '2025-09-25 12:00:00', '2025-10-5 21:00:00', '12:00:00'),
-- 공방 스테이 박보검 사인회
	('30033', null, '공방 스테이 박보검 사인회', '9월 21일(일) 공방 스테이에서 배우 박보검 사인회가 열립니다! 선착순 100명!',
	 'gongbangStay.png', 2, 2, '2025-10-08 12:00:00', '2025-10-21 21:00:00', '18:00:00'),
-- 화암사 주차장 공사 안내
	('54311', 2, '화암사 주차장 공사 안내', '9월 20일(금)~10월 13일(일) 화암사 주차장 공사로 인해 사용이 불가합니다.',
	 'hwaamsa.jpg', 3, 1, '2025-10-25 12:00:00', '2025-11-13 12:00:00', '12:00:00');