userInfo(  );

//1. JASON호출_localStorage
function getLoginUser(){  console.log( 'JASON호출_localStorage' );
    let loginUser = sessionStorage.getItem( 'loginUser' )

    if( loginUser == null ){
        loginUser = [];
    }else{
        loginUser = JSON.parse( loginUser ); 
    }
    return loginUser;
}

// 2. JASON저장_localStorage
function setLoginUser( loginUser ){  console.log( ' JASON저장_localStorage' ); 
    sessionStorage.setItem('loginUser', JSON.stringify( loginUser ) )
}


function userInfo(  ){   console.log( '!회원정보 출력함수 >>> userInfo( loginId ) exe' ); 
   
    let loginUser = getLoginInfo(); // 세션스토리지 로그인 회원정보 가져오기
    console.log( loginUser.loginId );

    if( loginUser.loginId == undefined ){
            let mainText =document.querySelector('.mainText .green');
    let loginUserName = document.querySelector('.memberMenu li:nth-child(1)');
    let loginUserOut = document.querySelector('.memberMenu li:nth-child(2)');

    mainText.innerHTML = ` <  더조은 수강생님, R&D 협력자 모집중  > `;
    loginUserName.innerHTML = `<a href="./member/login.html">로그인</a>`;
    loginUserOut.innerHTML = `<a href="./member/signUp.html">회원가입</a>`;
    }else{
    let mainText =document.querySelector('.mainText .green');
    let loginUserName = document.querySelector('.memberMenu li:nth-child(1)');
    let loginUserOut = document.querySelector('.memberMenu li:nth-child(2)');

    mainText.innerHTML = `<span style="text-decoration:underline"> ${ loginUser.userName } 님</span> <br/> 요즘 사업은 어떠신가요? `;
    loginUserName.innerHTML = `<a href="#">${ loginUser.userName }( ${ loginUser.loginId } )</a>`;
    loginUserOut.innerHTML = ` <a href="#" onclick="logOut()">로그아웃</a> `;

    }


       

} // userInfo( loginId ) end.


function logOut(){   console.log( '로그아웃' ); 

    sessionStorage.removeItem('loginUser');

    let mainText =document.querySelector('.mainText .green');
    let loginUserName = document.querySelector('.memberMenu li:nth-child(1)');
    let loginUserOut = document.querySelector('.memberMenu li:nth-child(2)');

    mainText.innerHTML = ` <  더조은 수강생님, R&D 협력자 모집중  > `;
    loginUserName.innerHTML = `<a href="./member/login.html">로그인</a>`;
    loginUserOut.innerHTML = `<a href="./member/signUp.html">회원가입</a>`;

} // userInfo( loginId ) end.
