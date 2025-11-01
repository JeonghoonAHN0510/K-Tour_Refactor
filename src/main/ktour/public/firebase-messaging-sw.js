importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA-zW5DeMa_Q_BtEEJpzdUTkIRHwqbCM1E",
  authDomain: "k-tour-team-projedct.firebaseapp.com",
  projectId: "k-tour-team-projedct",
  storageBucket: "k-tour-team-projedct.firebasestorage.app",
  messagingSenderId: "560943551271",
  appId: "1:560943551271:web:7b2f5769c05b0a211b8f02",
  measurementId: "G-XSF0V65730"
});

const messaging = firebase.messaging();

// ✅ notification이 이미 있으면 자동 표시되므로 무시
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return; // ⚡ 중복 방지 핵심

  const { title, body } = payload.data;
  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png",
  });
});