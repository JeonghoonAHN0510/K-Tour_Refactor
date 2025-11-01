/*
1. MySQL Connections > 설정 > Connection > Advanced > Others에 OPT_LOCAL_INFILE=1 추가
2. LOAD DATA LOCAL INFILE "절대경로"
	-> 절대경로는 각자 다른 경로를 갖기에 본인 경로에 맞게 커스텀해야함.
    -> 경로 작성 시, \ -> \\로 변경 요망
3. 경로를 모두 변경했다면, 전체 실행을 함으로써 모든 CSV 데이터를 DB에 추가

** 기본적으로 VARCHAR(255)로 진행하였으나, 크기가 큰 데이터가 있어 일부는 TEXT로 진행. -> 추후 자동화할 때는 어떻게 진행할 지 논의 필요
*/
DROP DATABASE IF EXISTS tour_api_origin;
CREATE DATABASE tour_api_origin;
USE tour_api_origin;
SET SQL_SAFE_UPDATES = 0;
SET GLOBAL local_infile=TRUE;	# 로컬 파일을 읽을 수 있도록 설정

CREATE TABLE areaBasedSyncList2(addr1 VARCHAR(255),addr2 VARCHAR(255),areacode VARCHAR(255),cat1 VARCHAR(255),cat2 VARCHAR(255),cat3 VARCHAR(255),contentid VARCHAR(255),contenttypeid VARCHAR(255),createdtime VARCHAR(255),firstimage VARCHAR(255),firstimage2 VARCHAR(255),cpyrhtDivCd VARCHAR(255),mapx VARCHAR(255),mapy VARCHAR(255),mlevel VARCHAR(255),modifiedtime VARCHAR(255),sigungucode VARCHAR(255),tel TEXT,title VARCHAR(255),zipcode VARCHAR(255),showflag VARCHAR(255),lDongRegnCd VARCHAR(255),lDongSignguCd VARCHAR(255),lclsSystm1 VARCHAR(255),lclsSystm2 VARCHAR(255),lclsSystm3 VARCHAR(255));
CREATE TABLE detailCommon2(contentid VARCHAR(255),contenttypeid VARCHAR(255),title VARCHAR(255),createdtime VARCHAR(255),modifiedtime VARCHAR(255),tel VARCHAR(255),telname VARCHAR(255),homepage TEXT,firstimage VARCHAR(255),firstimage2 VARCHAR(255),cpyrhtDivCd VARCHAR(255),areacode VARCHAR(255),sigungucode VARCHAR(255),lDongRegnCd VARCHAR(255),lDongSignguCd VARCHAR(255),lclsSystm1 VARCHAR(255),lclsSystm2 VARCHAR(255),lclsSystm3 VARCHAR(255),cat1 VARCHAR(255),cat2 VARCHAR(255),cat3 VARCHAR(255),addr1 VARCHAR(255),addr2 VARCHAR(255),zipcode VARCHAR(255),mapx VARCHAR(255),mapy VARCHAR(255),mlevel VARCHAR(255),overview TEXT);
CREATE TABLE detailImage2(contentid VARCHAR(255),originimgurl VARCHAR(255),imgname VARCHAR(255),smallimageurl VARCHAR(255),cpyrhtDivCd VARCHAR(255),serialnum VARCHAR(255));
CREATE TABLE detailInfo2_12(contentid VARCHAR(255),contenttypeid VARCHAR(255),serialnum VARCHAR(255),infoname VARCHAR(255),infoTEXT VARCHAR(255),fldgubun VARCHAR(255));
CREATE TABLE detailInfo2_15(contentid VARCHAR(255),contenttypeid VARCHAR(255),serialnum VARCHAR(255),infoname VARCHAR(255),infoTEXT VARCHAR(255),fldgubun VARCHAR(255));
CREATE TABLE detailInfo2_39(contentid VARCHAR(255),contenttypeid VARCHAR(255),serialnum VARCHAR(255),infoname VARCHAR(255),infoTEXT VARCHAR(255),fldgubun VARCHAR(255));
CREATE TABLE detailIntro2_12(contentid VARCHAR(255),contenttypeid VARCHAR(255),heritage1 VARCHAR(255),heritage2 VARCHAR(255),heritage3 VARCHAR(255),infocenter VARCHAR(255),opendate VARCHAR(255),restdate VARCHAR(255),expguide VARCHAR(255),expagerange VARCHAR(255),accomcount VARCHAR(255),useseason VARCHAR(255),usetime VARCHAR(255),parking VARCHAR(255),chkbabycarriage VARCHAR(255),chkpet VARCHAR(255),chkcreditcard VARCHAR(255));
CREATE TABLE detailIntro2_15(contentid VARCHAR(255),contenttypeid VARCHAR(255),agelimit VARCHAR(255),bookingplace VARCHAR(255),discountinfofestival VARCHAR(255),eventenddate VARCHAR(255),eventhomepage VARCHAR(255),eventplace VARCHAR(255),eventstartdate VARCHAR(255),festivalgrade VARCHAR(255),festivaltype VARCHAR(255),placeinfo VARCHAR(255),playtime VARCHAR(255),program VARCHAR(255),progresstype VARCHAR(255),spendtimefestival VARCHAR(255),sponsor1 VARCHAR(255),sponsor1tel VARCHAR(255),sponsor2 VARCHAR(255),sponsor2tel VARCHAR(255),subevent VARCHAR(255),usetimefestival VARCHAR(255));
CREATE TABLE detailIntro2_39(contentid VARCHAR(255),contenttypeid VARCHAR(255),seat VARCHAR(255),kidsfacility VARCHAR(255),firstmenu VARCHAR(255),treatmenu TEXT,smoking VARCHAR(255),packing VARCHAR(255),infocenterfood VARCHAR(255),scalefood VARCHAR(255),parkingfood VARCHAR(255),opendatefood VARCHAR(255),opentimefood VARCHAR(255),restdatefood VARCHAR(255),discountinfofood VARCHAR(255),chkcreditcardfood VARCHAR(255),reservationfood VARCHAR(255),lcnsno VARCHAR(255));
CREATE TABLE detailPetTour2(contentid VARCHAR(255),relaAcdntRiskMtr TEXT,acmpyTypeCd VARCHAR(255),relaPosesFclty TEXT,relaFrnshPrdlst VARCHAR(255),etcAcmpyInfo TEXT,relaPurcPrdlst VARCHAR(255),acmpyPsblCpam TEXT,relaRntlPrdlst VARCHAR(255),acmpyNeedMtr VARCHAR(255));
CREATE TABLE lclsSystmCode2(lclsSystm1Cd VARCHAR(255),lclsSystm1Nm VARCHAR(255),lclsSystm2Cd VARCHAR(255),lclsSystm2Nm VARCHAR(255),lclsSystm3Cd VARCHAR(255),lclsSystm3Nm VARCHAR(255),rnum VARCHAR(255));
CREATE TABLE ldongCode2(lDongRegnCd VARCHAR(255),lDongRegnNm VARCHAR(255),lDongSignguCd VARCHAR(255),lDongSignguNm VARCHAR(255),rnum VARCHAR(255));
CREATE TABLE searchFestival2(addr1 VARCHAR(255),addr2 VARCHAR(255),zipcode VARCHAR(255),cat1 VARCHAR(255),cat2 VARCHAR(255),cat3 VARCHAR(255),contentid VARCHAR(255),contenttypeid VARCHAR(255),createdtime VARCHAR(255),eventstartdate VARCHAR(255),eventenddate VARCHAR(255),firstimage VARCHAR(255),firstimage2 VARCHAR(255),cpyrhtDivCd VARCHAR(255),mapx VARCHAR(255),mapy VARCHAR(255),mlevel VARCHAR(255),modifiedtime VARCHAR(255),areacode VARCHAR(255),sigungucode VARCHAR(255),tel TEXT,title VARCHAR(255),lDongRegnCd VARCHAR(255),lDongSignguCd VARCHAR(255),lclsSystm1 VARCHAR(255),lclsSystm2 VARCHAR(255),lclsSystm3 VARCHAR(255),progresstype VARCHAR(255),festivaltype VARCHAR(255));
CREATE TABLE searchStay2(addr1 VARCHAR(255),addr2 VARCHAR(255),areacode VARCHAR(255),sigungucode VARCHAR(255),cat1 VARCHAR(255),cat2 VARCHAR(255),cat3 VARCHAR(255),contentid VARCHAR(255),contenttypeid VARCHAR(255),createdtime VARCHAR(255),firstimage VARCHAR(255),firstimage2 VARCHAR(255),cpyrhtDivCd VARCHAR(255),mapx VARCHAR(255),mapy VARCHAR(255),mlevel VARCHAR(255),modifiedtime VARCHAR(255),tel VARCHAR(255),title VARCHAR(255),zipcode VARCHAR(255),lDongRegnCd VARCHAR(255),lDongSignguCd VARCHAR(255),lclsSystm1 VARCHAR(255),lclsSystm2 VARCHAR(255),lclsSystm3 VARCHAR(255));

LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\areaBasedSyncList2.csv"
INTO TABLE tour_api_origin.areaBasedSyncList2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailCommon2.csv"
INTO TABLE tour_api_origin.detailCommon2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailImage2.csv"
INTO TABLE tour_api_origin.detailImage2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailInfo2_12.csv"
INTO TABLE tour_api_origin.detailInfo2_12
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailInfo2_39.csv"
INTO TABLE tour_api_origin.detailInfo2_39
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailIntro2_12.csv"
INTO TABLE tour_api_origin.detailIntro2_12
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailIntro2_15.csv"
INTO TABLE tour_api_origin.detailIntro2_15
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailIntro2_39.csv"
INTO TABLE tour_api_origin.detailIntro2_39
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\detailPetTour2.csv"
INTO TABLE tour_api_origin.detailPetTour2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\lclsSystmCode2.csv"
INTO TABLE tour_api_origin.lclsSystmCode2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\ldongCode2.csv"
INTO TABLE tour_api_origin.ldongCode2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\searchFestival2.csv"
INTO TABLE tour_api_origin.searchFestival2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE "C:\\Users\\Public\\Downloads\\251012\\searchStay2.csv"
INTO TABLE tour_api_origin.searchStay2
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 ROWS;