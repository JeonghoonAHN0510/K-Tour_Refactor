function userLogin(){  console.log( '회원로그인(사용자단)' ); 

    let memberList = getUsers(); // 회원목록 로컬스토리지 호출

    // DOM 변수 연결
    const loginIdInput = document.querySelector( '#loginIDInput' );
    const pwdInput = document.querySelector( '#pwdInput' );
    const loginId = loginIdInput.value; console.log( loginId );
    const pwd = pwdInput.value; console.log( pwd );
    
    // 유효성 검사
    if( loginId == '' || pwd == '' ){
        alert( '아이디와 비밀번호를 입력해주세요.' );
        return;
    }

    // 로그인 처리
    
    console.log( memberList );
    for( let i = 0; i < memberList.length ; i++ ){
        let member = memberList[i];
        // console.log( member );
        // console.log( member.loginId );
        // console.log( member.userPwd );
        if( member.loginId === loginId && member.userPwd === pwd ){
            alert( '로그인 성공!' );
            console.log( memberList[i].userPwd );
            memberList[i].lastLoginDate = new Date();

            // 로컬 스토리지에 업데이트된 회원 목록 저장
            setUsers( memberList );

             // 로그인 사용자 정보 임시 저장 (세션 스토리지)
            let loginUser = member;
            
            setLoginUser( loginUser );
            //sessionStorage.setItem('loginUser', JSON.stringify( loginUser ));
            //localStorage.setItem('loginUser', JSON.stringify( loginUser ) );

            // 메인 페이지로 이동
            location.href = '../index.html';

            return;
        } 
    } // for end
} // userLogin() end