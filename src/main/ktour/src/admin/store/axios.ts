import axios from 'axios';

/**
 * Axios 공용 인스턴스
 * - 모든 API 호출에서 공유되는 기본 설정과 인터셉터를 정의합니다.
 * - baseURL은 Vite 환경변수 `VITE_API_BASE_URL`을 우선 사용하며,
 *   없으면 로컬 백엔드(`http://localhost:8080`)로 폴백합니다.
 */
const api = axios.create({
  // 서버의 기본 URL. 상대 경로 요청 시 이 값이 앞에 자동으로 붙습니다.
  baseURL: (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8080',
  // 인증 쿠키 등을 자동 전송할지 여부. 필요한 경우 true로 변경하세요.
  withCredentials: false,
});

// 요청 인터셉터: 공통 헤더나 토큰을 삽입하고, 로깅/추적 등을 처리할 수 있습니다.
api.interceptors.request.use((config) => {
  // 예) 인증 토큰 추가
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터: 성공은 그대로 반환, 실패는 공통 에러 처리 후 거부합니다.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 공통 에러 로깅/메시지 변환 지점
    // console.error('[API ERROR]', error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export default api;

