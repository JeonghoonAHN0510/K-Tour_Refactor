/**
 * DragResizeLayer (드래그 & 리사이즈 가능한 React 레이어)
 *  - 마우스로 레이어 이동(드래그), 8방향 리사이즈 핸들 (n, s, e, w, ne, nw, se, sw)
 *  - 레이어 닫기, 저장, 취소, 부모 영역(layerContainerRef) 내부 이동제한 & 위치조정, z-index
 * @author kimJS
 * @since 2025.10.26
 * @version 0.1.0   
 */

import { useRef, useState, useCallback, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import "@assets/admin/css/dragResizeLayer.css";

/**  리사이즈 핸들 방향 상수 : 변 "n/s/e/w" , 모서리 "ne/nw/se/sw" */
const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

// 모든 인스턴스 공용 z-index 시드 (최근 클릭 레이어가 위로)
let zSeed = 1000;

export default function DragResizeLayer({
    layerContainerRef,
    portalRef, //레이어를 실제로 그릴 DOM 위치를 지정해주는 참조(ref) : 실제 렌더링 위치 (DOM 루트)
    id = "layer",
    initial = { w: 360, h: 300 },
    minSize = { w: 180, h: 200 },
    initialOffset = { x: 0, y: 0 },
    titleHtml = "",
    titleText = "",
    onClose,
    onSave,
    onCancel,
    children,
    className,
    style
}) {
    const layerRef = useRef(null);

    // x,y: 중앙 기준 오프셋(px), w,h: 크기, z: 쌓임
    const [state, setState] = useState({
        x: 0, y: 0, w: initial.w, h: initial.h, z: ++zSeed
    });

    // 드래그/리사이즈 스냅샷 + 포인터캡처 + rAF 배치
    const dragRef = useRef({
        type: null, sx: 0, sy: 0, ox: 0, oy: 0, ow: 0, oh: 0,
        pointerId: null,
        rafId: null,
        lastEvent: null
    });

    /** 기준 엘리먼트(포털 → 컨테이너 → body) */
    const getHostEl = useCallback(() => {
        return (portalRef?.current) || (layerContainerRef?.current) || document.body;
    }, [portalRef, layerContainerRef]);

    /** 호스트 크기 (중앙/클램프 계산용) */
    const getBounds = useCallback(() => {
        const host = getHostEl();
        const rect = host?.getBoundingClientRect?.();
        const W = rect?.width ?? window.innerWidth;
        const H = rect?.height ?? window.innerHeight;
        return { W, H };
    }, [getHostEl]);

    /** 중앙 기준 경계 클램프 */
    const clampOffset = useCallback((x, y, w, h) => {
        const { W, H } = getBounds();
        const maxX = Math.max(0, (W - w) / 2);
        const maxY = Math.max(0, (H - h) / 2);
        return {
            x: Math.min(Math.max(-maxX, x), maxX),
            y: Math.min(Math.max(-maxY, y), maxY),
            w, h
        };
    }, [getBounds]);

    /** 중앙 정렬(초기/리사이즈 시) */
    const centerLayer = useCallback(() => {
        setState(prev => clampOffset(initialOffset.x, initialOffset.y, prev.w, prev.h));
    }, [clampOffset, initialOffset.x, initialOffset.y]);

    // 마운트 직후 중앙 + 1프레임 보정(깜빡임 최소화)
    useLayoutEffect(() => {
        centerLayer();
        const raf = requestAnimationFrame(centerLayer);
        return () => cancelAnimationFrame(raf);
    }, [centerLayer]);

    // 호스트 리사이즈 대응(레이어 경계 유지)
    useEffect(() => {
        const host = getHostEl();
        if (!host || !("ResizeObserver" in window)) return;
        const ro = new ResizeObserver(() => {
            setState(prev => clampOffset(prev.x, prev.y, prev.w, prev.h));
        });
        ro.observe(host);
        return () => ro.disconnect();
    }, [getHostEl, clampOffset]);

    /** 클릭 시 맨 앞으로 */
    const bringToFront = useCallback(() => {
        setState(prev => ({ ...prev, z: ++zSeed }));
    }, []);

    /** 액션 시작(드래그/리사이즈) */
    const startAction = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        bringToFront();

        // 포인터 캡처(끊김 방지)
        try {
            layerRef.current?.setPointerCapture?.(e.pointerId);
            dragRef.current.pointerId = e.pointerId;
        } catch { }

        dragRef.current.type = type;
        dragRef.current.sx = e.clientX;
        dragRef.current.sy = e.clientY;
        dragRef.current.ox = state.x;
        dragRef.current.oy = state.y;
        dragRef.current.ow = state.w;
        dragRef.current.oh = state.h;

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", stopAction, { once: true });
    };

    /** rAF로 배치 처리되는 실제 계산 함수 */
    const handleMove = useCallback(() => {
        const evt = dragRef.current.lastEvent;
        dragRef.current.rafId = null;
        if (!evt) return;

        const { type, sx, sy, ox, oy, ow, oh } = dragRef.current;
        if (!type) return;

        const dx = evt.clientX - sx;
        const dy = evt.clientY - sy;

        let x = ox, y = oy, w = ow, h = oh;

        if (type === "move") {
            x = ox + dx;
            y = oy + dy;
        } else {
            // 드래그한 변/모서리만 크기 변경(반대쪽 고정)
            let nextW = ow;
            let nextH = oh;
            if (type.includes("e")) nextW = ow + dx;
            if (type.includes("w")) nextW = ow - dx;
            if (type.includes("s")) nextH = oh + dy;
            if (type.includes("n")) nextH = oh - dy;

            // 최소 크기 보장
            nextW = Math.max(minSize.w, nextW);
            nextH = Math.max(minSize.h, nextH);

            // 변화량(최종 크기 기준)
            const dW = nextW - ow;
            const dH = nextH - oh;

            // 중심 보정: 드래그한 쪽만 움직이도록
            if (type.includes("e")) x = ox + (dW / 2);
            if (type.includes("w")) x = ox + (-dW / 2);
            if (type.includes("s")) y = oy + (dH / 2);
            if (type.includes("n")) y = oy + (-dH / 2);

            w = nextW;
            h = nextH;
        }

        setState(prev => ({ ...prev, ...clampOffset(x, y, w, h) }));
    }, [clampOffset, minSize.w, minSize.h]);

    /** 포인터 무브: rAF 스로틀링 */
    const onMove = (e) => {
        dragRef.current.lastEvent = e;
        if (dragRef.current.rafId == null) {
            dragRef.current.rafId = requestAnimationFrame(handleMove);
        }
    };

    /** 액션 종료 */
    const stopAction = () => {
        dragRef.current.type = null;
        dragRef.current.lastEvent = null;
        if (dragRef.current.rafId != null) {
            cancelAnimationFrame(dragRef.current.rafId);
            dragRef.current.rafId = null;
        }
        // 포인터 캡처 해제
        try {
            if (dragRef.current.pointerId != null) {
                layerRef.current?.releasePointerCapture?.(dragRef.current.pointerId);
            }
        } catch { }
        dragRef.current.pointerId = null;

        window.removeEventListener("pointermove", onMove);
    };

    // 안전장치: 언마운트 시 전역 리스너/raf 해제
    useEffect(() => {
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (dragRef.current.rafId != null) {
                cancelAnimationFrame(dragRef.current.rafId);
            }
        };
    }, []);

    /** 레이어 노드 */
    const layerNode = (
        <div
            ref={layerRef}
            className={`drzlLayer${className ? ` ${className}` : ""}`}
            style={{
                "--x": `${state.x}px`,
                "--y": `${state.y}px`,
                "--w": `${state.w}px`,
                "--h": `${state.h}px`,
                "--z": state.z,
                position: "absolute",
                zIndex: state.z,
                ...style
            }}
            onPointerDown={bringToFront}
        >
            {/* 헤더(드래그 핸들) */}
            <div className="drzlHeader" onPointerDown={(e) => startAction(e, "move")} aria-label={id}>
                {titleHtml
                    ? <div className="drzlTitle" dangerouslySetInnerHTML={{ __html: titleHtml }} />
                    : <div className="drzlTitle">{titleText || "제목 입력하세요."}</div>
                }
                <button
                    className="drzlBtnClose"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={onClose}
                    title="닫기"
                    aria-label="닫기"
                >×</button>
            </div>

            {/* 본문(커스텀) + 액션 */}
            <div className="drzlContent">
                <div className="drzlContentBody">
                    {children ? children : <p className="drzlText">이 영역에 원하는 내용을 배치하세요.</p>}
                </div>
                <div className="drzlActions">
                    <button className="drzlBtn" onPointerDown={(e) => e.stopPropagation()} onClick={onCancel}>취소</button>
                    <button className="drzlBtn drzlBtnPrimary" onPointerDown={(e) => e.stopPropagation()} onClick={() => onSave?.()}>저장</button>
                </div>
            </div>

            {/* 8방향 리사이즈 핸들 */}
            {HANDLES.map((dir) => (
                <div
                    key={dir}
                    className={`drzlHandle drzlHandle${dir.toUpperCase()}`}
                    onPointerDown={(e) => startAction(e, dir)}
                    title={`크기 조정: ${dir.toUpperCase()}`}
                />
            ))}
        </div>
    );

    // 포털이 있으면 그쪽으로 렌더, 없으면 일반 렌더
    return portalRef?.current
        ? createPortal(layerNode, portalRef.current)
        : layerNode;
}