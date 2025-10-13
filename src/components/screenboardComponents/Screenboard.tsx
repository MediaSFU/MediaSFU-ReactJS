import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faPencilAlt,
  faPaintBrush,
  faShapes,
  faEraser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./Screenboard.css";
import { ShowAlert, SleepType } from "../../@types/types";

export interface ScreenboardParameters {
  updateCanvasScreenboard: (canvas: HTMLCanvasElement | null) => void;
  annotateScreenStream: boolean;
  updateIsScreenboardModalVisible: (visible: boolean) => void;
  showAlert?: ShowAlert;
  sleep: SleepType;
  updateAnnotateScreenStream: (annotate: boolean) => void;

  [key: string]: any;
}

export interface ScreenboardOptions {
  customWidth: number;
  customHeight: number;
  parameters: ScreenboardParameters;
  showAspect: boolean;
}

export type ScreenboardType = (options: ScreenboardOptions) => React.JSX.Element;

/**
 * Screenboard - Lightweight annotation overlay for screen sharing
 * 
 * A streamlined drawing canvas designed specifically for annotating shared screens during presentations.
 * Provides essential drawing tools (pen, shapes, eraser) with minimal UI footprint to avoid obscuring
 * shared content. Perfect for highlighting key points, circling important areas, and adding visual
 * emphasis during screen shares.
 * 
 * Features:
 * - Freehand drawing with customizable brush
 * - Shape tools (rectangle, circle, line)
 * - Eraser with adjustable size
 * - Color selection palette
 * - Line type options (solid, dashed, dotted, dash-dot)
 * - Thickness controls for brush and eraser
 * - Minimal toolbar design
 * - Transparent canvas overlay
 * - Real-time drawing synchronization
 * - Touch and mouse input support
 * - Collapsible toolbar
 * - Clear canvas functionality
 * 
 * @component
 * @param {ScreenboardOptions} options - Configuration options
 * @param {number} options.customWidth - Canvas width in pixels
 * @param {number} options.customHeight - Canvas height in pixels
 * @param {ScreenboardParameters} options.parameters - Screenboard state parameters
 * @param {Function} options.parameters.updateCanvasScreenboard - Update canvas reference
 * @param {boolean} options.parameters.annotateScreenStream - Screen annotation enabled state
 * @param {Function} options.parameters.updateIsScreenboardModalVisible - Update modal visibility
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {Function} options.parameters.sleep - Async delay utility
 * @param {Function} options.parameters.updateAnnotateScreenStream - Update annotation state
 * @param {boolean} options.showAspect - Show aspect ratio indicator
 * 
 * @returns {React.JSX.Element} Rendered annotation canvas overlay
 * 
 * @example
 * // Basic screen annotation overlay
 * ```tsx
 * import React from 'react';
 * import { Screenboard } from 'mediasfu-reactjs';
 * 
 * function ScreenAnnotation({ parameters }) {
 *   return (
 *     <Screenboard
 *       customWidth={1920}
 *       customHeight={1080}
 *       parameters={parameters}
 *       showAspect={false}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Screenboard with analytics tracking
 * ```tsx
 * import { Screenboard } from 'mediasfu-reactjs';
 * 
 * function AnalyticsScreenboard({ parameters }) {
 *   return (
 *     <Screenboard
 *       customWidth={1920}
 *       customHeight={1080}
 *       parameters={{
 *         ...parameters,
 *         updateAnnotateScreenStream: (annotate) => {
 *           analytics.track('screen_annotation_toggled', {
 *             enabled: annotate,
 *             timestamp: Date.now(),
 *           });
 *           parameters.updateAnnotateScreenStream(annotate);
 *         },
 *       }}
 *       showAspect={true}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Screenboard with custom dimensions for presentation
 * ```tsx
 * import { Screenboard } from 'mediasfu-reactjs';
 * 
 * function PresentationAnnotation({ parameters }) {
 *   return (
 *     <div style={{ position: 'relative' }}>
 *       {parameters.annotateScreenStream && (
 *         <div style={{
 *           position: 'absolute',
 *           top: 16,
 *           left: 16,
 *           padding: '8px 16px',
 *           background: 'rgba(0, 0, 0, 0.7)',
 *           color: 'white',
 *           borderRadius: 8,
 *           fontSize: 14,
 *           zIndex: 1000,
 *         }}>
 *           Annotation Mode Active
 *         </div>
 *       )}
 *       <Screenboard
 *         customWidth={1600}
 *         customHeight={900}
 *         parameters={parameters}
 *         showAspect={false}
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, Screenboard } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   screenboard: {
 *     component: (props) => (
 *       <Screenboard
 *         {...props}
 *         customWidth={1920}
 *         customHeight={1080}
 *         showAspect={false}
 *       />
 *     ),
 *   },
 * };
 * 
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */

const Screenboard: React.FC<ScreenboardOptions> = ({
  parameters,
  showAspect,
}) => {
  const {
    updateCanvasScreenboard,
    annotateScreenStream,
    updateIsScreenboardModalVisible,
    showAlert,
    sleep,
    updateAnnotateScreenStream,
  } = parameters;

  const mode = useRef<"draw" | "freehand" | "shape" | "erase">("draw");
  const isDrawing = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const freehandDrawing = useRef<{ x: number; y: number; color: string; thickness: number }[]>([]);
  const shapes = useRef<any[]>([]);
  const eraserThickness = useRef<number>(10);
  const brushThickness = useRef<number>(6);
  const lineThickness = useRef<number>(6);
  const lineType = useRef<"solid" | "dashed" | "dotted" | "dashDot">("solid");
  const color = useRef<string>("#000000");
  const shape = useRef<string | null>(null);
  const toolbarVisible = useRef<boolean>(false);
  const dropdownOpen = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenboardRef = useRef<HTMLDivElement | null>(null);
  const screenboardContentRef = useRef<HTMLDivElement | null>(null);

  let canvas: HTMLCanvasElement | null = canvasRef.current;
  let ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext("2d") : null;

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvas.getContext("2d");

      updateCanvasScreenboard(canvas);
    }

    const handleMouseDown = (e: MouseEvent) => startDrawing(e, ctx);
    const handleMouseMove = (e: MouseEvent) => draw(e, ctx);
    const handleMouseUp = () => stopDrawing(ctx);

    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseout", handleMouseUp);

      // Touch events
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove);
      canvas.addEventListener("touchend", handleTouchEnd);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseout", handleMouseUp);

        // Touch events
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shapes.current]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownOpen.current && !(event.target as HTMLElement).closest(".btn-group")) {
      dropdownOpen.current = null;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleDropdownClick = (id: string) => {
    dropdownOpen.current = dropdownOpen.current === id ? null : id;
  };

  const handleItemClick = (
    callback: (value: any) => void,
    name: string,
    value: any
  ) => {
    callback(value);
    dropdownOpen.current = null;
    if (["draw", "freehand", "shape", "erase"].includes(name)) {
      mode.current = name as "draw" | "freehand" | "shape" | "erase";
    }
  };

  const dropdownItems = (
    items: { label: string | React.JSX.Element; value: any }[],
    name: string,
    callback: (value: any) => void
  ) => (
    <div className={`dropdown-menu ${dropdownOpen.current ? "show" : ""}`}>
      {items.map((item, index) => (
        <button
          key={index}
          className="dropdown-item"
          onClick={() => handleItemClick(callback, name, item.value)}
          style={{ padding: "5px" }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  const startDrawing = (e: MouseEvent, ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;
    isDrawing.current = true;
    startX.current = e.offsetX;
    startY.current = e.offsetY;

    if (mode.current === "erase") {
      erase(e.offsetX, e.offsetY, ctx);
    } else if (mode.current === "draw" || mode.current === "freehand") {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      if (mode.current === "freehand") {
        freehandDrawing.current = [{ x: e.offsetX, y: e.offsetY, color: color.current, thickness: brushThickness.current }];
      }
    }
  };

  const draw = (e: MouseEvent, ctx: CanvasRenderingContext2D | null) => {
    if (!ctx || !isDrawing.current) return;

    currentX.current = e.offsetX;
    currentY.current = e.offsetY;

    if (mode.current === "erase") {
      erase(e.offsetX, e.offsetY, ctx);
    } else if (mode.current === "draw") {
      ctx.clearRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
      drawShapes(ctx);
      drawLine(
        startX.current,
        startY.current,
        e.offsetX,
        e.offsetY,
        color.current,
        lineThickness.current,
        lineType.current,
        ctx
      );
    } else if (mode.current === "freehand") {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = color.current;
      ctx.lineWidth = brushThickness.current;
      ctx.stroke();
      freehandDrawing.current.push({
        x: e.offsetX,
        y: e.offsetY,
        color: color.current,
        thickness: brushThickness.current,
      });
    } else if (mode.current === "shape") {
      ctx.clearRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
      drawShapes(ctx);
      if (shape.current) {
        drawShape(
          shape.current,
          startX.current,
          startY.current,
          e.offsetX,
          e.offsetY,
          color.current,
          lineThickness.current,
          lineType.current,
          ctx
        );
      }
    }
  };

  const stopDrawing = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;

    isDrawing.current = false;

    if (mode.current === "draw") {
      shapes.current.push({
        type: "line",
        x1: startX.current,
        y1: startY.current,
        x2: currentX.current,
        y2: currentY.current,
        color: color.current,
        thickness: lineThickness.current,
        lineType: lineType.current,
      });
    } else if (mode.current === "freehand") {
      shapes.current.push({
        type: "freehand",
        points: freehandDrawing.current,
        color: color.current,
        thickness: brushThickness.current,
      });
      freehandDrawing.current = [];
    } else if (mode.current === "shape") {
      shapes.current.push({
        type: shape.current,
        x1: startX.current,
        y1: startY.current,
        x2: currentX.current,
        y2: currentY.current,
        color: color.current,
        thickness: lineThickness.current,
        lineType: lineType.current,
      });
    }

    setTimeout(() => removeShape(ctx), 15000);
  };

  const isPointNearLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dot = ((px - x1) * dx + (py - y1) * dy) / (length * length);
    const closestX = x1 + dot * dx;
    const closestY = y1 + dot * dy;
    const distance = Math.sqrt(
      Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2)
    );
    return distance <= threshold;
  };

  const removeShape = (ctx: CanvasRenderingContext2D) => {
    try {
      shapes.current.shift();
      drawShapes(ctx);
    } catch {
      // Do nothing
    }
  };

  const erase = (x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, eraserThickness.current / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    shapes.current = shapes.current
      .map((shape) => {
        if (shape.type === "freehand") {
          return {
            ...shape,
            points: shape.points.filter((point: { x: number; y: number }) => {
              const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
              return distance > eraserThickness.current / 2;
            }),
          };
        } else if (shape.type === "line") {
          if (isPointNearLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2, eraserThickness.current / 2)) {
            return null;
          }
        } else if (shape.type === "text") {
          const textWidth = ctx.measureText(shape.text).width;
          if (
            x > shape.x &&
            x < shape.x + textWidth &&
            y > shape.y - shape.fontSize &&
            y < shape.y
          ) {
            return null;
          }
        } else {
          if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
            return null;
          }
        }
        return shape;
      })
      .filter((shape) => shape && (shape.type !== "freehand" || shape.points.length > 0));
  };

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
    shapes.current.forEach((shape) => {
      if (shape.type === "line") {
        drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, ctx);
      } else if (shape.type === "freehand") {
        drawFreehand(shape.points, shape.color, shape.thickness, ctx);
      } else {
        drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, ctx);
      }
    });
  };

  const drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    thickness: number,
    lineType: "solid" | "dashed" | "dotted" | "dashDot",
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    if (lineType === "dashed") {
      ctx.setLineDash([10, 10]);
    } else if (lineType === "dotted") {
      ctx.setLineDash([2, 10]);
    } else if (lineType === "dashDot") {
      ctx.setLineDash([10, 5, 2, 5]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawFreehand = (
    points: { x: number; y: number }[],
    color: string,
    thickness: number,
    ctx: CanvasRenderingContext2D
  ) => {
    if (points.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const drawShape = (
    type: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    thickness: number,
    lineType: "solid" | "dashed" | "dotted" | "dashDot",
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    if (lineType === "dashed") {
      ctx.setLineDash([10, 10]);
    } else if (lineType === "dotted") {
      ctx.setLineDash([2, 10]);
    } else if (lineType === "dashDot") {
      ctx.setLineDash([10, 5, 2, 5]);
    } else {
      ctx.setLineDash([]);
    }
    if (type === "rectangle") {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (type === "circle") {
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (type === "rhombus") {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.moveTo(centerX, y1);
      ctx.lineTo(x2, centerY);
      ctx.lineTo(centerX, y2);
      ctx.lineTo(x1, centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (type === "pentagon") {
      drawPolygon(ctx, 5, x1, y1, x2, y2);
    } else if (type === "hexagon") {
      drawPolygon(ctx, 6, x1, y1, x2, y2);
    } else if (type === "triangle") {
      const centerXTriangle = (x1 + x2) / 2;
      ctx.moveTo(centerXTriangle, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x1, y2);
      ctx.closePath();
      ctx.stroke();
    } else if (type === "square") {
      ctx.strokeRect(x1, y1, x2 - x1, x2 - x1);
    } else if (type === "octagon") {
      drawPolygon(ctx, 8, x1, y1, x2, y2);
    } else if (type === "oval") {
      const radiusX = Math.abs(x2 - x1) / 2;
      const radiusY = Math.abs(y2 - y1) / 2;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (type === "parallelogram") {
      const centerX = (x1 + x2) / 2;
      ctx.moveTo(centerX, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(centerX, y2);
      ctx.lineTo(x1, y1);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    sides: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
    const angle = (2 * Math.PI) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const x = centerX + radius * Math.cos(i * angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(i * angle - Math.PI / 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  const toggleToolbar = () => {
    toolbarVisible.current = !toolbarVisible.current;
  };

  const toggleAnnotate = async () => {
    const newAnnotateState = !annotateScreenStream;
    updateAnnotateScreenStream(newAnnotateState);
    if (newAnnotateState) {
      toolbarVisible.current = true;
      showAlert?.(
        {message:`You can now annotate the screen. If you cannot see your annotation controls (on top), try minimizing your screen by using 'Cmd' + '-' (on Mac) or 'Ctrl' + '-' (on Windows).`, 
        type:'success', 
        duration: 
        9000
      });
    } else {
      toolbarVisible.current = false;
    }

    updateIsScreenboardModalVisible(true);
    await sleep({ms:500})
    updateIsScreenboardModalVisible(false);
  };

  return (
    <div
      id="screenboard-interface"
      style={{
        position: "relative",
        display: showAspect ? "block" : "none",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 1000,
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "auto",
      }}
      ref={screenboardRef}
    >
      <div
        id="screenboardContent"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          top: 0,
          left: 0,
        }}
        ref={screenboardContentRef}
      >
        <button
          id="annotateScreen"
          className="btn btn-primary btnBoardScreen annotateScreenBtn"
          style={{
            position: "absolute",
            top: "5px",
            right: "10px",
            zIndex: 1000,
          }}
          onClick={toggleAnnotate}
        >
          <FontAwesomeIcon
            icon={faPencilAlt}
            color={annotateScreenStream ? "red" : "green"}
          />
        </button>

        {annotateScreenStream && (
          <button
            id="toolbarToggleScreen"
            className="btn btnBoardScreen btn-primary"
            style={{
              position: "absolute",
              top: "5px",
              right: "55px",
              zIndex: 1000,
            }}
            onClick={toggleToolbar}
          >
            <FontAwesomeIcon
              icon={toolbarVisible.current ? faChevronRight : faChevronLeft}
            />
          </button>
        )}

        <div
          className="toolbarScreen mb-3"
          id="toolbarScreen"
          style={{
            position: "absolute",
            top: "5px",
            right: "105px",
            zIndex: 1000,
            backgroundColor: "transparent",
            display: toolbarVisible.current ? "block" : "none",
          }}
        >
          <div className="btn-group" role="group">
            <button
              className="btn btnBoardScreen btn-secondary dropdown-toggle"
              id="drawModeScreen"
              onClick={() => handleDropdownClick("drawModeScreen")}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            {dropdownOpen.current === "drawModeScreen" &&
              dropdownItems(
                [
                  { label: "XX-Small (3px)", value: 3 },
                  { label: "X-Small (6px)", value: 6 },
                  { label: "Small (12px)", value: 12 },
                  { label: "Medium (18px)", value: 18 },
                  { label: "Large (24px)", value: 24 },
                  { label: "X-Large (36px)", value: 36 },
                ],
                "draw",
                (value) => (lineThickness.current = value)
              )}
          </div>
          <div className="btn-group" role="group">
            <button
              className="btn btnBoardScreen btn-dark dropdown-toggle"
              id="freehandModeScreen"
              onClick={() => handleDropdownClick("freehandModeScreen")}
            >
              <FontAwesomeIcon icon={faPaintBrush} />
            </button>
            {dropdownOpen.current === "freehandModeScreen" &&
              dropdownItems(
                [
                  { label: "X-Small (5px)", value: 5 },
                  { label: "Small (10px)", value: 10 },
                  { label: "Medium (20px)", value: 20 },
                  { label: "Large (40px)", value: 40 },
                  { label: "X-Large (60px)", value: 60 },
                ],
                "freehand",
                (value) => (brushThickness.current = value)
              )}
          </div>
          <div className="btn-group" role="group">
            <button
              className="btn btnBoardScreen btn-dark dropdown-toggle"
              id="shapeModeScreen"
              onClick={() => handleDropdownClick("shapeModeScreen")}
            >
              <FontAwesomeIcon icon={faShapes} />
            </button>
            {dropdownOpen.current === "shapeModeScreen" &&
              dropdownItems(
                [
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/square.svg"
                        alt="Square"
                        className="shape-icon"
                      />
                    ),
                    value: "square",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/rectangle.svg"
                        alt="Rectangle"
                        className="shape-icon"
                      />
                    ),
                    value: "rectangle",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/circle.svg"
                        alt="Circle"
                        className="shape-icon"
                      />
                    ),
                    value: "circle",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/triangle.svg"
                        alt="Triangle"
                        className="shape-icon"
                      />
                    ),
                    value: "triangle",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/hexagon.svg"
                        alt="Hexagon"
                        className="shape-icon"
                      />
                    ),
                    value: "hexagon",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/pentagon.svg"
                        alt="Pentagon"
                        className="shape-icon"
                      />
                    ),
                    value: "pentagon",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/rhombus.svg"
                        alt="Rhombus"
                        className="shape-icon"
                      />
                    ),
                    value: "rhombus",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/octagon.svg"
                        alt="Octagon"
                        className="shape-icon"
                      />
                    ),
                    value: "octagon",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/parallelogram.svg"
                        alt="Parallelogram"
                        className="shape-icon"
                      />
                    ),
                    value: "parallelogram",
                  },
                  {
                    label: (
                      <img
                        src="https://mediasfu.com/images/svg/oval.svg"
                        alt="Oval"
                        className="shape-icon"
                      />
                    ),
                    value: "oval",
                  },
                ],
                "shape",
                (value) => (shape.current = value)
              )}
          </div>
          <div className="btn-group" role="group">
            <button
              className="btn btnBoardScreen btn-danger dropdown-toggle"
              id="eraseModeScreen"
              onClick={() => handleDropdownClick("eraseModeScreen")}
            >
              <FontAwesomeIcon icon={faEraser} />
            </button>
            {dropdownOpen.current === "eraseModeScreen" &&
              dropdownItems(
                [
                  { label: "X-Small (5px)", value: 5 },
                  { label: "Small (10px)", value: 10 },
                  { label: "Medium (20px)", value: 20 },
                  { label: "Large (30px)", value: 30 },
                  { label: "X-Large (60px)", value: 60 },
                ],
                "erase",
                (value) => (eraserThickness.current = value)
              )}
          </div>
          <button
            className="btn btnBoard btn-success"
            id="zoomResetScreen"
            style={{ display: "none" }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <label htmlFor="colorPickerScreen"></label>
          <input
            type="color"
            className="btn"
            id="colorPickerScreen"
            value={color.current}
            onChange={(e) => (color.current = e.target.value)}
          />
          <label htmlFor="lineTypePickerScreen"></label>
          <select
            id="lineTypePickerScreen"
            className="custom-select"
            style={{ width: "auto" }}
            onChange={(e) => (lineType.current = e.target.value as "solid" | "dashed" | "dotted" | "dashDot")}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="dashDot">Dash-Dot</option>
          </select>
        </div>

        <canvas
          id="screenboardCanvas"
          width="1280"
          height="720"
          style={{
            padding: 0,
            margin: 0,
            display: annotateScreenStream ? "block" : "none",
          }}
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
};

export default Screenboard;
