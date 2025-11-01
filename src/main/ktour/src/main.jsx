/**
 * KTour > 리액트 프로젝트의 최초 진입점(Entry Point) 파일
 *
 * @author kimJS
 * @since 2025.10.16
 * @version 0.1.0
 */

/** ============================= 고정(기본) ================================ */
import { createRoot } from 'react-dom/client'   // 1. 리액트 라이브러리의 최초(ROOT) 생성하는 함수 IMPORT
const root = document.querySelector('#root')    // 2. index.html 에서 root 마크업 가져오기
const create = createRoot( root );              // 3. #root 마크업 > createRoot 함수 매개변수 전달

/**  ======================== 최초 렌더링 컴포넌트 ======================= */
import App from './App.jsx'                     // 4. 렌더링 컴포넌트 import 

/**  5. App 컴포넌트 렌더링  */             
//import { Provider } from 'react-redux';
//import store, { persistor } from './admin/store/store.js';
//import { PersistGate } from 'redux-persist/integration/react';
create.render( 
    //<Provider store={ store }>
        //<PersistGate loading = { null } persistor={ persistor }>
            <App /> 
        //</PersistGate>
    //</Provider>
);