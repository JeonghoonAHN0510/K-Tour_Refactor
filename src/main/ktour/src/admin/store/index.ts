// 전역 Redux 스토어 설정 파일
// - 각 슬라이스 리듀서를 모아 스토어를 생성합니다.
// - 타입(EX: RootState, AppDispatch)도 함께 노출합니다.
import { configureStore } from '@reduxjs/toolkit';
import place from './placeSlice';

// Redux Toolkit의 기본 미들웨어/개선 사항이 포함된 스토어 생성
export const store = configureStore({
  // 루트 리듀서 매핑: state.place -> place 슬라이스
  reducer: { place },
});

// 루트 상태 타입: useSelector에서 상태 타입 유추에 사용
export type RootState = ReturnType<typeof store.getState>;
// 디스패치 타입: useDispatch에 제네릭으로 주입하여 thunk/액션 타입 안정성 확보
export type AppDispatch = typeof store.dispatch;
