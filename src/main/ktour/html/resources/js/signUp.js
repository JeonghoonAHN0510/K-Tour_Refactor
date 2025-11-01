// 1. 회원 등록 
// 회원유형 버튼 선택값 가져오기
const buttons = document.querySelectorAll('#userTypeInput button');
buttons.forEach(button => {
  button.addEventListener('click', function() {
    buttons.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
  });
});

function userAdd(){  console.log( '회원등록(사용자단)' ); 

    let memberList = getUsers(); // 회원목록 로컬스토리지 호출

    // DOM 변수 연결
    const userTypeInput = document.querySelector( '#userTypeInput .selected' ); 
    const loginIdInput = document.querySelector( '#loginIdInput' ); 
    const pwdInput = document.querySelector( '#pwdInput' ); 
    const emailInput = document.querySelector( '#emailInput' ); 
    const nameInput = document.querySelector( '#nameInput' ); 
    const birthInput = document.querySelector( '#birthInput' ); 
    const genderSelect = document.querySelector( 'input[name="gender"]:checked' ); 
    const nationalitySelect = document.querySelector( 'input[name="nationality"]:checked' );
    const phoneInput = document.querySelector( '#phoneInput' ); 
    const agreeTerms = document.querySelector( '#agreeTerms' ); 

    console.log( userTypeInput ); 

    const userType = userTypeInput.value; console.log( userType );
    const loginId = loginIdInput.value; console.log( loginId );
    const pwd = pwdInput.value; console.log( pwd );
    const email = emailInput.value; console.log( email );
    const name = nameInput.value; console.log( name ); 
    const birth = birthInput.value; console.log( birth ); 
    const gender = genderSelect.value; console.log( gender ); 
    const nationality = nationalitySelect.value; console.log( nationality ); 
    const phone = phoneInput.value; console.log( phone ); 
    const agree = agreeTerms.value; console.log( agree ); 


    // 객체 생성
    let uIDAuto = memberList.length;
    uIDAuto++;
    let noimg ='//placehold.co/100x100';
    // 회원ID(PK*) uID, 테넌트ID(FK) tenantId, 로그인ID loginId, 사업자ID companyId, 
    // 회원등급ID roleId, 회원그룹ID groupId, 부서ID deptId, 회원명 userName, 비밀번호 userPwd, 
    // 회원유형 userType, 생년월일 birth, 성별 gender, 국적 nationality, 휴대폰번호 phone, 
    // 이메일 email, 프로필이미지 userImg, 약관동의 agree, 
    // 최종로그인일시 lastLoginDate,  가입일시 signUpDate, 탈퇴일시 withdrawalDate
    // pimg : pimg ? URL.createObjectURL(pimg) : noimg }; 
    const obj ={ uID : uIDAuto ,  tenantId : "" , loginId : loginId , companyId : "" ,
        roleId : "" , groupId : "" , deptId : "" , userName : name , userPwd : pwd , 
        userType : userType , birth :  birth, gender : gender, nationality : nationality, phone : phone , 
        email : email , userImg : noimg  , agree : agree, 
        lastLoginDate: "" , signUpDate : new Date(), withdrawalDate : ""
    }; 

    console.log( obj ); 

    // memberList 배열 객체 추가
    memberList.push( obj );  console.log( memberList );  

    // 입력값 초기화 
    userTypeInput.value = '';
    loginIdInput.value = '';
    pwdInput.value = '';
    emailInput.value = '';
    nameInput.value = '';   
    birthInput.value = '';
    genderSelect.value
    nationalitySelect.value = '';
    phoneInput.value = '';
    agreeTerms.value = '';
    

    // localStorage 배열 저장
    setUsers( memberList ); 

    // 회원가입 성공 메시지
    confirm( '회원가입이 완료되었습니다. 로그인 페이지로 이동하겠습니까?' );
    location.href = '../member/login.html';

    // 목록 반영
    // productPrint();

} //  회원등록(사용자단) : usersAdd() end.
