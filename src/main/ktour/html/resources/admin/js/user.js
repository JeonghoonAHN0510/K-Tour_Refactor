// 관리자 > 회원목록
usersList();
function usersList(){  console.log( '관리자 > 회원목록' ); 

    let memberList = getUsers(); // 회원목록 로컬스토리지 호출

    // 변수
    const tbody = document.querySelector( '#membersStatus .listWrap table tbody' );
    let html ='';

    // 배열 순회
    for( let i = 0; i <= memberList.length - 1; i++ ){
        let member = memberList[i];
        console.log( member ); 
        html += `<tr>
                        <td>${ member.uID }</td>
                        <td>${ member.userType }</td>
                        <td><a href="#">${ member.userName }</a></td>
                        <td>${ member.loginId }</td>
                        <td>${ member.uID }</td>
                        <td>${ member.phone }</td>
                        <td>${ member.signUpDate }</td>
                        <td>${ member.lastLoginDate }</td>
                    </tr>`
     }
     tbody.innerHTML = html; 
} //usersList(); end
