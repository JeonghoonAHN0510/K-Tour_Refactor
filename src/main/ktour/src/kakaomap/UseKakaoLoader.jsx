import { useState, useEffect } from 'react';

export default function UseKakaoLoader(props) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);    // true : 로딩완료 || false : 로딩 전 또는 실패
    // ================================= useEffect , [] : 컴포넌트가 최초 마운트될 때 1회 실행 =================================
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setIsScriptLoaded(true);        // 지도가 이미 로드되어있다면, 로딩 완료로 변경
            return;                         // 뒤에서 로드할 필요가 없으니 함수 종료
        } // if end

        const script = document.createElement('script');    // HTML 문서에 script 태그를 동적으로 생성
        // autoload=false : 순차적으로 로드하기 위해 autoload 비활성화
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=53b4906ec9f493e1dc366039f8462f0b&libraries=services,clusterer&autoload=false`;
        script.async = true;                // 지도의 마커, 클러스터러를 생성하기 위해, 비동기적으로 로드 설정

        // 스크립트가 성공적으로 로드되고 실행되었을 때(onload) 호출될 콜백 함수를 정의
        script.onload = () => {
            window.kakao.maps.load(() => {
                // 모든 라이브러리가 준비되면, 지도 로드
                setIsScriptLoaded(true);
            });
        }; // script.onload end

        // 스크립트 로딩에 실패했을 때(onerror) 호출될 콜백 함수를 정의
        script.onerror = () => {
            console.error("Kakao Maps 스크립트를 로드하는 데 실패했습니다.");
            setIsScriptLoaded(false);       // 로드에 실패했으므로 false 
        };

        // HTML 문서의 head에 해당 스크립트를 추가
        document.head.appendChild(script)

    }, []); // useEffect end

    return isScriptLoaded;
}; // func end