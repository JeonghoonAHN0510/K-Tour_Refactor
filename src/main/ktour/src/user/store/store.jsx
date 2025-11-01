import mapSlice from './mapSlice';
import placeReducer from '@admin/store/placeSlice';
import { configureStore } from "@reduxjs/toolkit";

// 1. Store 만들기
const store = configureStore({
    reducer : {
        // 2. Slice 등록
        relatedMap : mapSlice,
        // Admin: 장소 관리 전용 전역 상태
        place: placeReducer,
    }
});

// 3. export
export default store;
