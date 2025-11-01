// ✅ React 및 의존성 임포트
import React, { useEffect, useState } from "react"; // React 훅
import axios from "axios"; // 서버통신용
import { requestPermission, onForegroundMessage } from "../../../firebase/firebase"; // Firebase 함수 불러오기

// ✅ 푸시 알림 테스트 컴포넌트
export default function PushNotification() {
  const [token, setToken] = useState(""); // 토큰 상태 관리

  // ✅ [1] 알림 활성화 버튼 클릭 시 실행
  const registerToken = async () => {
    const token = await requestPermission(); // 토큰 요청
    if (!token) return alert("토큰 발급 실패"); // 실패 시 알림
    setToken(token); // 상태에 저장

    // 발급받은 토큰을 서버에 등록
    await axios.post("http://localhost:8080/api/fcm/register", null, {
      params: { newToken: token }, // 파라미터 전달
    });

    alert("✅ 토큰 등록 완료 및 테스트 메시지 전송!"); // 성공 알림
  };

  // ✅ [2] 컴포넌트 마운트 시 포그라운드 메시지 리스너 등록
  useEffect(() => {
    onForegroundMessage(); // 포그라운드 알림 수신 등록
  }, []); // 최초 한 번만 실행

  // ✅ [3] 화면 렌더링
  return (
      <button onClick={registerToken}>알림 활성화</button>
  );
}