"use client";
import React, { useRef, useState } from "react";

export default function Pane({ pane, ownId }) {
  const containerRef = useRef();

  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [topPaneHeight, setTopPaneHeight] = useState(50);

  const ComponentToRender = pane.component;

  //   mouse movement to resize the pane
  const startResizing = (mouseDownEvent) => {
    console.log("Resizing");
    mouseDownEvent.preventDefault();

    //    check horizontal or vertical
    const isHorizontal = pane.direction === "horizontal";
    const start = isHorizontal
      ? mouseDownEvent.clientX
      : mouseDownEvent.clientY;
    const containerSize = isHorizontal
      ? containerRef.current.offsetWidth
      : containerRef.current.offsetHeight;

    const handleMouseMove = (mouseMoveEvent) => {
      const current = isHorizontal
        ? mouseMoveEvent.clientX
        : mouseMoveEvent.clientY;
      const delta = current - start;
      const deltaPercent = (delta / containerSize) * 100;

      if (isHorizontal) {
        const newWidthPercent = Math.max(
          0,
          Math.min(100, leftPaneWidth + deltaPercent)
        );
        setLeftPaneWidth(newWidthPercent);
      } else {
        const newHeightPercent = Math.max(
          0,
          Math.min(100, topPaneHeight + deltaPercent)
        );
        setTopPaneHeight(newHeightPercent);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      key={Math.random()}
      ref={containerRef}
      className={`flex ${
        pane.direction === "horizontal" ? "flex-row" : "flex-col"
      } w-full border ${ownId == "root" ? "h-screen" : "h-full"}`}
    >
      {pane.children.length > 0 ? (
        pane.children.map((childPane, index) => (
          <React.Fragment key={`pane-fragment-${index}`}>
            {/* this div is used for resize purpose */}
            <div
              className={`${index === 0 || index === 1 ? "flex-grow" : ""} ${
                pane.direction === "horizontal" ? "w-full" : "h-full"
              }`}
              style={
                pane.direction === "horizontal"
                  ? index === 0
                    ? { width: `${leftPaneWidth}%` }
                    : index === 1
                    ? { width: `${100 - leftPaneWidth}%` }
                    : {}
                  : index === 0
                  ? { height: `${topPaneHeight}%` }
                  : index === 1
                  ? { height: `${100 - topPaneHeight}%` }
                  : {}
              }
            >
              <Pane
                key={`11${index}`}
                ownId={childPane.id ?? ownId}
                pane={childPane}
              />
            </div>
            {/* horizonal resizer */}
            {pane.direction === "horizontal" &&
              index < pane.children.length - 1 && (
                <div
                  key={`12${index}`}
                  onMouseDown={startResizing}
                  className='w-2 bg-gray-400 cursor-col-resize'
                />
              )}
            {/* vertical resizer */}
            {pane.direction === "vertical" &&
              index < pane.children.length - 1 && (
                <div
                  key={`13${index}`}
                  onMouseDown={startResizing}
                  className='h-2 bg-gray-400 cursor-row-resize'
                />
              )}
          </React.Fragment>
        ))
      ) : ComponentToRender ? (
        // TabSystem render
        <ComponentToRender prevTabs={pane.data} key={ownId} ownId={ownId} />
      ) : (
        <div className='flex items-center justify-center p-4'>
          Pane {pane.id}
        </div>
      )}
    </div>
  );
}
