import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MapResizeLayer from "@admin/components/common/MapResizeLayer";
import { useSelector } from 'react-redux';

export default function ImgPreview({ title }) {

    const { layerContainerRef } = useOutletContext();               // 레이어 관련 상속
    const [activePreview, setActivePreview] = useState(false);      // 레이어 표시(노출)여부 상태
    const { mainImgTempUrl, detailImgTempUrl } = useSelector((state) => state.place);

    return (
        <>
            <button type="button" id="activePreviewBtn" onClick={() => setActivePreview(true)}>미리보기</button>
            {/* ============== 1.DragResizeLayer(리사이징/드래그 레이어) 시작 =================== */}
            {/* 조건부 렌더링(conditional rendering) : {showList && ( ... )} --> showList가 true일 때만 <DragResizeLayer> 출력 */}
            {activePreview && (
                <MapResizeLayer
                    layerContainerRef={layerContainerRef}
                    titleText={title + " 미리보기"}
                    initialOffset={{ x: 0, y: 0 }}
                    onClose={() => setActivePreview(false)}
                    onCancel={() => setActivePreview(false)}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f0f0f0',
                            flexDirection: 'column'
                        }}
                    >
                        {
                            title == '대표 이미지' ?
                                <img
                                    src={mainImgTempUrl || "/user/img/no_img.jpg"}
                                    alt={title + " 미리보기"}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                                :
                                detailImgTempUrl.map((url) => {
                                    return <img
                                        src={url || "/user/img/no_img.jpg"}
                                        alt={title + " 미리보기"}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            paddingBottom: '20px'
                                        }}
                                    />
                                })
                        }
                    </div>
                </MapResizeLayer>
            )}
        </>
    );
}