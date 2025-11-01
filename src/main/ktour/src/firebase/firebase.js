// ✅ Firebase 모듈 임포트
import { initializeApp } from "firebase/app"; // Firebase 초기화
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging"; // 메시징 관련 함수

// ✅ Firebase 설정값
const firebaseConfig = {
   apiKey: "AIzaSyA-zW5DeMa_Q_BtEEJpzdUTkIRHwqbCM1E",
  authDomain: "k-tour-team-projedct.firebaseapp.com",
  projectId: "k-tour-team-projedct",
  storageBucket: "k-tour-team-projedct.firebasestorage.app",
  messagingSenderId: "560943551271",
  appId: "1:560943551271:web:7b2f5769c05b0a211b8f02",
  measurementId: "G-XSF0V65730"
};

// ✅ Firebase 앱 초기화
const app = initializeApp(firebaseConfig); // Firebase 앱 실행
let messaging = null; // 메시징 객체 (지원여부 확인 후 초기화)

// ✅ 브라우저에서 FCM 지원 여부 확인
isSupported().then((supported) => {
  if (supported) messaging = getMessaging(app); // 지원 시 메시징 객체 생성
});

// ✅ 알림 권한 요청 및 토큰 발급 함수
export const requestPermission = async () => {
  const permission = await Notification.requestPermission(); // 사용자에게 알림 권한 요청
  if (permission !== "granted") return null; // 거부 시 중단

  // 토큰 발급 시도
  try {
    const token = await getToken(messaging, {
      vapidKey: "BEovcxshLoUqpXusEy_LBcu7YFdXdfquQnQXrOdI-GXYX0JTbOX1UCPiauaUCctUTk-0Um3vUra9mlYpbocevY0", // 공개키
      serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"), // SW 등록
    });
    console.log("✅ FCM 토큰:", token); // 콘솔 확인용
    return token; // 토큰 반환
  } catch (err) {
    console.error("❌ 토큰 발급 실패:", err); // 오류 로그
    return null; // 실패 시 null 반환
  }
};

// ✅ 포그라운드(브라우저 활성 상태) 알림 수신 처리
export const onForegroundMessage = async () => {
  const supported = await isSupported(); // 지원 여부 확인
  if (!supported) return; // 미지원 브라우저는 중단

  const messaging = getMessaging(app); // 메시징 객체 가져오기
  onMessage(messaging, (payload) => {
    // 현재 창이 활성 상태일 때만 알림 표시
    if (document.hidden) return; // 비활성화 상태면 무시
    alert(`🔔 ${payload.notification.title}\n${payload.notification.body}`); // 알림 팝업
  });
};
