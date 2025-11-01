-- --------------------------------------
-- tour_api_origin
-- API 원본 DB 
-- --------------------------------------

use tour_api_origin;

select * from areabasedsynclist2;
select * from detailcommon2;
select * from detailimage2;
select * from detailinfo2_12;
select * from detailinfo2_39;
select * from detailintro2_12;
select * from detailintro2_39;
select * from detailpettour2;
select * from lclssystmcode2;
select * from ldongcode2;
select * from searchfestival2;
select * from searchstay2;

-- --------------------------------------
-- k-tour_headquater
-- 본사 정규화 DB 
-- --------------------------------------
use k_tour_headquarter;

select * from categorycode;
select * from contenttype;
select * from ldongcode;

select * from placeinfo;
select * from detailpettour;
select * from festivalintro;
select * from manager;
select * from markersgps;
select * from placeimagedetail;
select * from placeinforepeat;
select * from restaurantintro;
select * from siteinfo;
select * from tourintro;
select * from push;

-- ---------------------------------------------------------
-- ldongCode : 법정동
-- ---------------------------------------------------------
select * from ldongcode;

select * from ldongcode where ldongregnnm like '%강원%' and ldongsigngunm like '%고성%';


-- ---------------------------------------------------------
-- PlaceInfo : 플레이스 정보
-- 관광, 플레이스 관련 기본 공통 정보
-- ---------------------------------------------------------

select * from placeInfo where ldNo = 247;
select * from placeInfo order by pno desc;
-- select * from placeInfo where ;

select count(*) from placeinfo;
select * from placeinfo where pno = 65545;

update placeinfo set showflag = 1 where pno=65540; 
-- ---------------------------------------------------------
-- TourIntro
-- 관광지(contentTypeID 12 . ctNo1) 정보
-- ---------------------------------------------------------
select * from tourIntro where pno = 65545;
delete from tourIntro where tiNo=128;


-- ---------------------------------------------------------
-- festivalintro 
-- 행사/축제 (contentTypeID 15 . ctNo3) 정보
-- ---------------------------------------------------------
select * from festivalintro where pno=65545;




-- ---------------------------------------------------------
-- RestaurantIntro 
-- 음식점 (contentTypeID 39 . ctNo 8) 정보
-- ---------------------------------------------------------
select * from RestaurantIntro where pno = 740;
delete from RestaurantIntro where riNo = 64;
select * from placeinfo where ctNo = 8 and ldNo = 247;


-- ---------------------------------------------------------
-- PlaceInfoRepeat : 반복정보 관련
-- ---------------------------------------------------------

SELECT * FROM PLACEINFOREPEAT;
insert into placeInfoRepeat( pNo, infoName , infoText, serialnum ) values (125183, "화장실","비밀번호 뭐게요", 0);
select * from placeinforepeat where pNo = "125183";
update placeinforepeat set infoname = "화장실수정11", infotext = "비밀번호 수정" where pirNo = "2";
alter table placeinforepeat change infoname infoname varchar(30); 
desc placeinforepeat;

-- ---------------------------------------------------------
-- placeimagedetail
-- 플레이스 사진 정보
-- ---------------------------------------------------------
select * from placeimagedetail where pno = 6881;


-- ---------------------------------------------------------
-- MarkerGPS
-- 마커 이미지 관리 table
-- ---------------------------------------------------------
select * from markersgps where pno = 6881;
select * from markersgps order by pNo desc;
