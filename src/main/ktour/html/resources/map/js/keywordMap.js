/* [키워드 검색 조회] searchKeyword2 */
// https://apis.data.go.kr/B551011/KorService2/searchKeyword2?serviceKey=DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D&numOfRows=2&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=Q&keyword=%EC%8B%9C%EC%9E%A5&lDongRegnCd=50&lDongSignguCd=&lclsSystm1=


// 해더 검색창 > 엔터키 이벤트 리스너
document.querySelector('#keywordInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        processValue(); // 값 처리 함수 호출
    }
});

// 해더 검색창 > 검색 입력값을 처리하는 함수
function searchValue() {
    const keywordInput = document.querySelector('#keywordInput')
    const keyword = input.value.trim();

    if (keyword === '') {
        alert('검색어를 입력하세요.');
        return;
    }

    // 값을 결과 영역에 추가
    addValueToResult(value);

    // 입력창 초기화
    keywordInput.value = '';
    keywordInput.focus();
}// func end


export const keywordMapSearch = async( value, marker ) =>{
     // 해더 상단 검색창 입력값 가져오기
    const keywordInput = document.querySelector("#keywordInput");
    const keyword = keywordInput.value;
    console.log( keyword );

    const serviceKey = `DOpLI7EuzXtbDtCQ40p5sHOuJ9NW89eB%2Fd7hUs3CQsVoZ6d6q2HZiDViRsYqCJuabArktqa8tJcOmldsY5A7eg%3D%3D`; // 서비스키

    const URL = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?&numOfRows=2&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=Q&keyword=${keyword}&lDongRegnCd=${value.lDongRegnCd}&lDongSignguCd=&lclsSystm1=&serviceKey=`;
    const response = await fetch( URL+serviceKey );
    const data = await response.json();
    keywordMapData = data.response.body.items.item[0];

    console.log( keywordMapData );
    return keywordMapData;

}// func end



