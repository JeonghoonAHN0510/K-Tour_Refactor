/**
 * DragResizeLayer (부모 div 내부 전용)
 * - 중앙에서 시작, 드래그 이동, 8방향 리사이즈(n, s, e, w, ne, nw, se, sw), 클릭한 레이어가 항상 맨 위(z-index)로
 * - 부모 경계 안에서만 이동/리사이즈 (overflow 허용 X)
 */

import { useRef, useState, useCallback, useLayoutEffect, useEffect } from "react";
import "@assets/admin/css/dragResizeLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCircleXmark  } from "@fortawesome/free-solid-svg-icons";

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
let zSeed = 1000; // 모든 인스턴스 공유: 마지막으로 클릭한 레이어가 위로

export default function MapResizeLayer({
  layerContainerRef,                      // 부모 컨테이너(ref, position:relative 권장)
  id = "layer",
  initial = { w: 360, h: 300 },      // 초기 크기
  minSize = { w: 180, h: 200 },      // 최소 크기
  initialOffset = { x: 0, y: 0 },    // 중앙 기준 오프셋(px)
  titleHtml = "",
  titleText = "",
  onClose,
  onSave,
  onCancel,
  children,
}) {
  const layerRef = useRef(null);
  const [state, setState] = useState({
    x: 0, y: 0, w: initial.w, h: initial.h, z: ++zSeed,
  });

  // 드래그/리사이즈 시작 시점 스냅샷(리렌더 없이 보관)
  const dragRef = useRef({ type: null, sx: 0, sy: 0, ox: 0, oy: 0, ow: 0, oh: 0 });

  // 부모 크기(없으면 viewport) 가져오기
  const getBounds = useCallback(() => {
    const rect = layerContainerRef?.current?.getBoundingClientRect();
    return {
      W: rect?.width || window.innerWidth,
      H: rect?.height || window.innerHeight,
    };
  }, [layerContainerRef]);

  // 중앙 기준 오프셋/크기 제한(부모 밖으로 못 나가게)
  const clampOffset = useCallback((x, y, w, h) => {
    const { W, H } = getBounds();
    const maxX = Math.max(0, (W - w) / 2);
    const maxY = Math.max(0, (H - h) / 2);
    return {
      x: Math.min(Math.max(-maxX, x), maxX),
      y: Math.min(Math.max(-maxY, y), maxY),
      w, h,
    };
  }, [getBounds]);

  // 최초 중앙 배치(초기 오프셋 적용)
  const centerLayer = useCallback(() => {
    setState(prev => clampOffset(initialOffset.x, initialOffset.y, prev.w, prev.h));
  }, [clampOffset, initialOffset.x, initialOffset.y]);

  // 마운트 직후 중앙 + 한 프레임 더 보정(깜빡임 최소화)
  useLayoutEffect(() => {
    centerLayer();
    const raf = requestAnimationFrame(centerLayer);
    return () => cancelAnimationFrame(raf);
  }, [centerLayer]);

  // 부모 사이즈 변경에도 위치/크기 재클램프
  useEffect(() => {
    const parent = layerContainerRef?.current;
    if (!parent || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      setState(prev => clampOffset(prev.x, prev.y, prev.w, prev.h));
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [layerContainerRef, clampOffset]);

  // 클릭하면 해당 레이어를 맨 앞으로
  const bringToFront = useCallback(() => {
    setState(prev => ({ ...prev, z: ++zSeed }));
  }, []);

  // 포인터 다운(드래그/리사이즈 시작)
  const startAction = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    bringToFront();
    dragRef.current = {
      type,
      sx: e.clientX, sy: e.clientY,
      ox: state.x, oy: state.y, ow: state.w, oh: state.h,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stopAction, { once: true });
  };

  // 진행 중(이동/리사이즈)
  const onMove = (e) => {
    const { type, sx, sy, ox, oy, ow, oh } = dragRef.current;
    if (!type) return;

    const dx = e.clientX - sx;
    const dy = e.clientY - sy;

    let x = ox, y = oy, w = ow, h = oh;

    if (type === "move") {
      x = ox + dx;
      y = oy + dy;
    } else {
      // 드래그한 변/모서리만 크기 변경 (반대 변은 고정)
      let nextW = ow;
      let nextH = oh;
      if (type.includes("e")) nextW = ow + dx;
      if (type.includes("w")) nextW = ow - dx;
      if (type.includes("s")) nextH = oh + dy;
      if (type.includes("n")) nextH = oh - dy;

      // 최소 크기 보장
      nextW = Math.max(minSize.w, nextW);
      nextH = Math.max(minSize.h, nextH);

      // 실제 변화량
      const dW = nextW - ow;
      const dH = nextH - oh;

      // 중심 보정(드래그한 쪽만 움직인 것처럼 보이게)
      if (type.includes("e")) x = ox + ( dW / 2);
      if (type.includes("w")) x = ox + (-dW / 2);
      if (type.includes("s")) y = oy + ( dH / 2);
      if (type.includes("n")) y = oy + (-dH / 2);

      w = nextW; h = nextH;
    }

    setState(prev => ({ ...prev, ...clampOffset(x, y, w, h) }));
  };

  // 종료(리스너 해제)
  const stopAction = () => {
    dragRef.current.type = null;
    window.removeEventListener("pointermove", onMove);
  };

  // 언마운트 안전장치
  useEffect(() => () => {
    window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={layerRef}
      className="drzlLayer"
      style={{
        "--x": `${state.x}px`,
        "--y": `${state.y}px`,
        "--w": `${state.w}px`,
        "--h": `${state.h}px`,
        "--z": state.z,
      }}
      onPointerDown={bringToFront} // 레이어 아무 곳이나 클릭해도 맨 위로
    >
      {/* 헤더(드래그 핸들) */}
      <div className="drzlHeader" onPointerDown={(e) => startAction(e, "move")} aria-label={id}>
        {titleHtml
          ? <div className="drzlTitle" dangerouslySetInnerHTML={{ __html: titleHtml }} />
          : <div className="drzlTitle">{titleText || "제목"}</div>
        }
        <button className="drzlBtnClose" onPointerDown={(e) => e.stopPropagation()} onClick={onClose} title="닫기" aria-label="닫기"><FontAwesomeIcon icon={faCircleXmark} /></button>
      </div>

      {/* 본문 + 액션 */}
      <div className="drzlContent">
        <div className="drzlContentBody">
          {children ?? <p className="drzlText">이 영역에 원하는 내용을 배치하세요.</p>}
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
}