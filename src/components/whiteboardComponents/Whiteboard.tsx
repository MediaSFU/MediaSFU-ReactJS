import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faUndo, faRedo, faEraser, faShapes, faMousePointer, faHandPaper, faTextHeight,
  faFont, faPencilAlt, faPaintBrush, faTrash, faSave, faSearch, faSearchMinus, faSearchPlus,
  faChevronLeft, faUpload, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Whiteboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CaptureCanvasStreamParameters, CaptureCanvasStreamType, OnScreenChangesParameters, OnScreenChangesType, Participant, ShowAlert, WhiteboardUser } from '../../@types/types';
import { Socket } from 'socket.io-client';

export interface Shape {
  type: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  text?: string;
  color?: string;
  font?: string;
  fontSize?: number;
  thickness?: number;
  lineType?: string;
  points?: Array<{ x: number, y: number }>;
  img?: HTMLImageElement;
  src?: string;
}

export interface WhiteboardParameters extends OnScreenChangesParameters, CaptureCanvasStreamParameters {
  socket: Socket;
  showAlert?: ShowAlert;
  islevel: string;
  roomName: string;
  shapes: Shape[];
  useImageBackground: boolean;
  redoStack: Shape[];
  undoStack: string[];
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  whiteboardUsers: WhiteboardUser[];
  participants: Participant[];
  participantsAll: Participant[];
  screenId: string;
  recordStarted: boolean;
  recordStopped: boolean;
  recordPaused: boolean;
  recordResumed: boolean;
  recordingMediaOptions: string;
  member: string;
  shareScreenStarted: boolean;
  targetResolution?: string;
  targetResolutionHost?: string;

  updateShapes: (shapes: Shape[]) => void;
  updateUseImageBackground: (useImageBackground: boolean) => void;
  updateRedoStack: (redoStack: Shape[]) => void;
  updateUndoStack: (undoStack: string[]) => void;
  updateWhiteboardStarted: (whiteboardStarted: boolean) => void;
  updateWhiteboardEnded: (whiteboardEnded: boolean) => void;
  updateWhiteboardUsers: (whiteboardUsers: WhiteboardUser[]) => void;
  updateParticipants: (participants: Participant[]) => void;
  updateScreenId: (screenId: string) => void;
  updateShareScreenStarted: (shareScreenStarted: boolean) => void;
  updateCanvasWhiteboard: (canvasWhiteboard: HTMLCanvasElement | null) => void;
  
  // mediasfu functions
  onScreenChanges: OnScreenChangesType;
  captureCanvasStream: CaptureCanvasStreamType;
  
  getUpdatedAllParams: () => WhiteboardParameters;
  [key: string]: any;
}

export interface WhiteboardOptions {
  customWidth: number;
  customHeight: number;
  parameters: WhiteboardParameters;
  showAspect: boolean;
}

export type WhiteboardType = (props: WhiteboardOptions) => React.JSX.Element;

/**
 * Whiteboard component provides a collaborative drawing interface with features such as
 * freehand drawing, erasing, shapes, and undo/redo functionality.
 * 
 * @component
 * @param {WhiteboardOptions} props - Properties for configuring the Whiteboard.
 * @param {number} props.customWidth - Custom width for the whiteboard.
 * @param {number} props.customHeight - Custom height for the whiteboard.
 * @param {WhiteboardParameters} props.parameters - Parameters and state management functions for whiteboard features.
 * @param {boolean} props.showAspect - Flag to show the aspect ratio.
 *
 * @returns {React.JSX.Element} The rendered Whiteboard component.
 *
 * @example
 * ```tsx
 * import { Whiteboard } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const parameters = {
 *   socket: io("http://localhost:3000"),
 *   showAlert: (alert) => console.log(alert),
 *   islevel: "2",
 *   roomName: "Room 1",
 *   shapes: [],
 *   useImageBackground: false,
 *   redoStack: [],
 *   undoStack: [],
 *   whiteboardStarted: true,
 *   whiteboardEnded: false,
 *   whiteboardUsers: [{ id: "user1", name: "John" }],
 *   participants: [{ id: "user1", name: "John", islevel: "1" }],
 *   screenId: "screen1",
 *   recordStarted: false,
 *   recordStopped: false,
 *   recordPaused: false,
 *   recordResumed: false,
 *   recordingMediaOptions: "video",
 *   member: "John",
 *   shareScreenStarted: false,
 *   updateShapes: (newShapes) => console.log("Shapes updated:", newShapes),
 *   updateUseImageBackground: (useImageBackground) => console.log("Background updated:", useImageBackground),
 *   updateRedoStack: (redoStack) => console.log("Redo stack updated:", redoStack),
 *   updateUndoStack: (undoStack) => console.log("Undo stack updated:", undoStack),
 *   updateWhiteboardStarted: (started) => console.log("Whiteboard started:", started),
 *   updateWhiteboardEnded: (ended) => console.log("Whiteboard ended:", ended),
 *   updateWhiteboardUsers: (users) => console.log("Whiteboard users updated:", users),
 *   updateParticipants: (participants) => console.log("Participants updated:", participants),
 *   updateScreenId: (screenId) => console.log("Screen ID updated:", screenId),
 *   updateShareScreenStarted: (shareStarted) => console.log("Screen sharing started:", shareStarted),
 *   updateCanvasWhiteboard: (canvas) => console.log("Canvas updated:", canvas),
 *   onScreenChanges: ({ changed }) => console.log("Screen changed:", changed),
 *   captureCanvasStream: () => console.log("Canvas stream captured"),
 * };
 *
 * <Whiteboard
 *   customWidth={800}
 *   customHeight={600}
 *   parameters={parameters}
 *   showAspect={true}
 * />
 * ```
 *
 * @remarks
 * This component supports multiple drawing modes (pen, eraser, shapes) and manages complex state interactions.
 * It leverages HTML5 Canvas for drawing operations and supports touch events for mobile devices.
 * Various `useEffect` hooks initialize and set up event listeners, while methods handle drawing,
 * erasing, zooming, and shape manipulation.
 */

 

const Whiteboard: React.FC<WhiteboardOptions> = ({ customWidth, customHeight, parameters, showAspect }) => {
  let {
    socket,
    showAlert,
    islevel,
    roomName,
    shapes,
    useImageBackground,
    redoStack,
    undoStack,
    whiteboardStarted,
    whiteboardEnded,
    whiteboardUsers,
    participants,
    screenId,
    recordStarted,
    recordStopped,
    recordPaused,
    recordResumed,
    recordingMediaOptions,
    member,
    shareScreenStarted,
    canvasWhiteboard,
    targetResolution,
    targetResolutionHost,

    updateShapes,
    updateUseImageBackground,
    updateRedoStack,
    updateUndoStack,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateParticipants,
    updateScreenId,
    updateShareScreenStarted,
    updateCanvasWhiteboard,

    //mediasfu functions
    onScreenChanges,
    captureCanvasStream,
  } = parameters;

  const mode = useRef<string>('pan');
  const isDrawing = useRef<boolean>(false);
  const isPanning = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const freehandDrawing = useRef<Array<{ x: number; y: number }>>([]);
  const selectedShape = useRef<Shape | null>(null);
  const selectedHandle = useRef<{ x: number; y: number; isCenter?: boolean } | null>(null);
  const movingShape = useRef<boolean>(false);
  const panX = useRef<number>(0);
  const panY = useRef<number>(0);
  const scale = useRef<number>(1);
  const minScale = useRef<number>(0.25);
  const maxScale = useRef<number>(1.75);
  const eraserThickness = useRef<number>(10);
  const brushThickness = useRef<number>(6);
  const lineThickness = useRef<number>(6);
  const lineType = useRef<string>('solid');
  const color = useRef<string>('#000000');
  const font = useRef<string>('Arial');
  const fontSize = useRef<number>(20);
  const shape = useRef<string | null>(null);
  const backgroundImage = useRef<HTMLImageElement>(new Image());
  const toolbarVisible = useRef<boolean>(true);
  const dropdownOpen = useRef<string | null>(null);
  const isValidShape = useRef<boolean>(true);

  const updateFont = (newFont: string) => {
    font.current = newFont;
  };

  const updateFontSize = (newFontSize: number) => {
    fontSize.current = newFontSize;
  };

  const updateShape = (newShape: string) => {
    shape.current = newShape;
  };

  const updateLineThickness = (newThickness: number) => {
    lineThickness.current = newThickness;
  }

  const updateBrushThickness = (newThickness: number) => {
    brushThickness.current = newThickness;
  };

  const updateEraserThickness = (newThickness: number) => {
    eraserThickness.current = newThickness;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const toggleBackgroundRef = useRef<HTMLButtonElement | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageBackgroundUrl = 'https://mediasfu.com/images/svg/graph_paper.jpg';

  const maxWidth = useRef<number>(1280);
  const maxHeight = useRef<number>(720);
  const dimensionsFixed = useRef<boolean>(false);

  let canvas = canvasRef.current;
  let ctx = canvas ? canvas.getContext('2d') : null;

  useEffect(() => {
    const img = new Image();
    img.src = imageBackgroundUrl;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      backgroundImage.current = img;
      drawShapes();
    };


    if (canvasRef.current) {
      canvas = canvasRef.current;

    try {
        if (targetResolution == 'qhd' || targetResolutionHost == 'qhd') {
          maxWidth.current = 1920;
          maxHeight.current = 1080;
        } else if (targetResolution == 'fhd' || targetResolutionHost == 'fhd') {
          maxWidth.current = 1920;
          maxHeight.current = 1080;
        }
        canvas.width = maxWidth.current;
        canvas.height = maxHeight.current;
        dimensionsFixed.current = true;
      } catch{
         // handle error
      }

      ctx = canvas.getContext('2d');
      canvasWhiteboard = canvas;
      updateCanvasWhiteboard(canvasWhiteboard);
    }

    canvas?.addEventListener('mousedown', startDrawing);
    canvas?.addEventListener('mousemove', draw);
    canvas?.addEventListener('mouseup', stopDrawing);
    canvas?.addEventListener('wheel', handleZoom);
    canvas?.addEventListener('click', handleCanvasClick);

    // touch events
    canvas?.addEventListener('touchstart', handleTouchStart);
    canvas?.addEventListener('touchmove', handleTouchMove);
    canvas?.addEventListener('touchend', handleTouchEnd);

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      canvas?.removeEventListener('mousedown', startDrawing);
      canvas?.removeEventListener('mousemove', draw);
      canvas?.removeEventListener('mouseup', stopDrawing);
      canvas?.removeEventListener('wheel', handleZoom);
      canvas?.removeEventListener('click', handleCanvasClick);

      // touch events
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('touchmove', handleTouchMove);
      canvas?.removeEventListener('touchend', handleTouchEnd);

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shapes, panX.current, panY.current, scale.current]);

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas?.dispatchEvent(mouseEvent);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownOpen.current && !(event.target as HTMLElement).closest('.btn-group')) {
      dropdownOpen.current = null;
    }
  };

  const handleCanvasClick = (e: MouseEvent) => {
    if (mode.current === 'text') {
      const textInput = textInputRef.current!;
      textInput.style.left = e.clientX + 'px';
      textInput.style.top = e.clientY + 'px';
      textInput.style.display = 'block';
      textInput.focus();
      textInput.addEventListener('keypress', function onEnter(event) {
        if (event.key === 'Enter') {
          const text = textInput.value;
          textInput.style.display = 'none';
          textInput.value = '';
          shapes.push({
            type: 'text',
            text,
            x: (e.offsetX - panX.current) / scale.current,
            y: (e.offsetY - panY.current) / scale.current,
            color: color.current,
            font: font.current,
            fontSize: fontSize.current
          });
          drawShapes();
          updateShapes(shapes);
          textInput.removeEventListener('keypress', onEnter);
          socket.emit('updateBoardAction', {
            action: 'text',
            payload: {
              type: 'text',
              text,
              x: (e.offsetX - panX.current) / scale.current,
              y: (e.offsetY - panY.current) / scale.current,
              color: color.current,
              font: font.current,
              fontSize: fontSize.current
            }
          }, handleServerResponse);
        }
      });
    }
  };

  const startDrawing = (e: MouseEvent) => {
    try {
      isDrawing.current = true;
      startX.current = (e.offsetX - panX.current) / scale.current;
      startY.current = (e.offsetY - panY.current) / scale.current;

      if (mode.current === 'erase') {
        erase(startX.current, startY.current);
      } else if (mode.current === 'draw' || mode.current === 'freehand') {
        ctx!.beginPath();
        ctx!.moveTo(startX.current, startY.current);
        if (mode.current === 'freehand') {
          freehandDrawing.current = [{ x: startX.current, y: startY.current }];
        }
      } else if (mode.current === 'pan') {
        isPanning.current = true;
        isDragging.current = false;
      } else if (mode.current === 'select') {
        selectedHandle.current = getHandleAtPosition(startX.current, startY.current) ?? null;
        if (selectedHandle.current) {
          isDragging.current = true;
          movingShape.current = selectedHandle.current.isCenter || false;
        } else {
          selectedShape.current = findShape(startX.current, startY.current) ?? null;
          if (selectedShape.current) {
            drawShapes();
            drawSelection(selectedShape.current);
          }
        }
      }
    } catch (error) {
      console.error('Error in startDrawing:', error);
    }
  };

  const checkBoardAccess = () => {
    if (whiteboardStarted && !whiteboardEnded) {
      const user = whiteboardUsers.find(user => user.name === member);
      if ((!user || !user.useBoard) && islevel != "2") {
        showAlert?.({ message: 'You are not allowed to use the whiteboard. Please ask the host to assign you.', type: 'danger' });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const changeMode = (newMode: string) => {
    if (newMode !== 'pan' && !checkBoardAccess()) return;
    mode.current = newMode;

    if (!canvas && canvasRef.current) {
      canvas = canvasRef.current;
    } else if (!canvas) {
      return;
    }

    if (newMode === 'pan') {
      canvas!.style.cursor = 'grab';
    } else if (newMode === 'select') {
      canvas!.style.cursor = 'pointer';
    } else if (newMode === 'erase') {
      canvas!.style.cursor = 'crosshair';
    } else {
      canvas!.style.cursor = 'crosshair';
    }
    if (newMode !== 'freehand' && freehandDrawing.current.length > 0) {
      shapes.push({
        type: 'freehand',
        points: freehandDrawing.current,
        color: color.current,
        thickness: brushThickness.current
      });
      updateShapes(shapes);
      freehandDrawing.current = [];
      saveState();
    }
  };

  const draw = (e: MouseEvent) => {
    if (!dimensionsFixed.current) {
      try {
        if (targetResolution == 'qhd' || targetResolutionHost == 'qhd') {
          maxWidth.current = 1920;
          maxHeight.current = 1080;
        } else if (targetResolution == 'fhd' || targetResolutionHost == 'fhd') {
          maxWidth.current = 1920;
          maxHeight.current = 1080;
        }
        canvas!.width = maxWidth.current;
        canvas!.height = maxHeight.current;
        dimensionsFixed.current = true;
        updateCanvasWhiteboard(canvas);
      } catch {
        // handle error
      }
    }
    if (!isDrawing.current) return;
    currentX.current = (e.offsetX - panX.current) / scale.current;
    currentY.current = (e.offsetY - panY.current) / scale.current;

    if (mode.current === 'draw' || mode.current === 'freehand' || mode.current === 'shape') {
      if (currentX.current > maxWidth.current || currentY.current > maxHeight.current) {
        isValidShape.current = false;
        return;
      } else {
        isValidShape.current = true
      }
    }

    if (mode.current === 'erase') {
      erase(currentX.current, currentY.current);
    } else if (mode.current === 'draw') {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawShapes();
      drawLine(startX.current, startY.current, currentX.current, currentY.current, color.current, lineThickness.current, lineType.current);
    } else if (mode.current === 'freehand') {
      ctx!.lineTo(currentX.current, currentY.current);
      ctx!.strokeStyle = color.current;
      ctx!.lineWidth = brushThickness.current;
      ctx!.stroke();
      freehandDrawing.current.push({ x: currentX.current, y: currentY.current });
    } else if (mode.current === 'shape') {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawShapes();
      drawShape(shape.current!, startX.current, startY.current, currentX.current, currentY.current, color.current, lineThickness.current, lineType.current);
    } else if (mode.current === 'pan' && isPanning.current) {
      isDragging.current = true;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      panX.current += dx;
      panY.current += dy;
      startX.current = e.clientX;
      startY.current = e.clientY;

      ctx!.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
      drawShapes();
    } else if (mode.current === 'select' && selectedShape.current) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      if (movingShape.current) {
        const dx = currentX.current - startX.current;
        const dy = currentY.current - startY.current;
        moveShape(selectedShape.current, dx, dy);
        startX.current = currentX.current;
        startY.current = currentY.current;
      } else if (isDragging.current) {
        resizeShape(selectedShape.current, selectedHandle.current!, currentX.current, currentY.current);
      }
      drawShapes();
      drawSelection(selectedShape.current);
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    isPanning.current = false;
    isDragging.current = false;
    ctx!.closePath();

    if (mode.current === 'draw' && isValidShape.current) {
      shapes.push({
        type: 'line',
        x1: startX.current,
        y1: startY.current,
        x2: currentX.current,
        y2: currentY.current,
        color: color.current,
        thickness: lineThickness.current,
        lineType: lineType.current
      });
      updateShapes(shapes);
      saveState();
      socket.emit('updateBoardAction', {
        action: 'draw',
        payload: {
          type: 'line',
          x1: startX.current,
          y1: startY.current,
          x2: currentX.current,
          y2: currentY.current,
          color: color.current,
          thickness: lineThickness.current,
          lineType: lineType.current
        }
      }, handleServerResponse);
    } else if (mode.current === 'freehand' && isValidShape.current) {
      shapes.push({
        type: 'freehand',
        points: freehandDrawing.current,
        color: color.current,
        thickness: brushThickness.current
      });
      updateShapes(shapes);
      socket.emit('updateBoardAction', {
        action: 'draw',
        payload: {
          type: 'freehand',
          points: freehandDrawing.current,
          color: color.current,
          thickness: brushThickness.current
        }
      }, handleServerResponse);
      freehandDrawing.current = [];
      saveState();
    } else if (mode.current === 'shape' && isValidShape.current) {
      shapes.push({
        type: shape.current!,
        x1: startX.current,
        y1: startY.current,
        x2: currentX.current,
        y2: currentY.current,
        color: color.current,
        thickness: lineThickness.current,
        lineType: lineType.current
      });
      updateShapes(shapes);
      saveState();
      socket.emit('updateBoardAction', {
        action: 'shape',
        payload: {
          type: shape.current!,
          x1: startX.current,
          y1: startY.current,
          x2: currentX.current,
          y2: currentY.current,
          color: color.current,
          thickness: lineThickness.current,
          lineType: lineType.current
        }
      }, handleServerResponse);
    } else if (mode.current === 'select') {
      if (selectedShape.current && !movingShape.current && !isDragging.current) {
        const shapeFound = findShape(currentX.current, currentY.current);
        if (shapeFound) {
          selectedShape.current = shapeFound;
          drawShapes();
          drawSelection(shapeFound);
        }
      }
      if (selectedShape.current) {
        socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
      }
      saveState();
    }
  };

  const erase = (x: number, y: number) => {
    ctx!.save();
    ctx!.globalCompositeOperation = 'destination-out';
    ctx!.beginPath();
    ctx!.arc(x, y, eraserThickness.current / 2, 0, Math.PI * 2, false);
    ctx!.fill();
    ctx!.restore();

    let changeOccurred = false;
    shapes = shapes.map(shape => {
      if (shape.type === 'freehand') {
        return {
          ...shape,
          points: shape.points!.filter(point => {
            const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
            if (distance <= eraserThickness.current / 2) {
              changeOccurred = true;
              return false;
            }
            return distance > eraserThickness.current / 2;
          })
        };
      } else if (shape.type === 'line') {
        if (isPointNearLine(x, y, shape.x1!, shape.y1!, shape.x2!, shape.y2!, eraserThickness.current / 2)) {
          changeOccurred = true;
          return null;
        }
      } else if (shape.type === 'text') {
        const textWidth = ctx!.measureText(shape.text!).width;
        if (x > shape.x! && x < shape.x! + textWidth && y > shape.y! - shape.fontSize! && y < shape.y!) {
          changeOccurred = true;
          return null;
        }
      } else if (shape.type === 'image') {
        if (x > shape.x1! && x < shape.x2! && y > shape.y1! && y < shape.y2!) {
          changeOccurred = true;
          return null;
        }
      } else {
        if (x > shape.x1! && x < shape.x2! && y > shape.y1! && y < shape.y2!) {
          changeOccurred = true;
          return null;
        }
      }
      return shape;
    }).filter(shape => shape && (shape.type !== 'freehand' || shape.points!.length > 0)) as Shape[];
    updateShapes(shapes);
    drawShapes();
    if (changeOccurred) {
      socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
    }
  };

  const isPointNearLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold: number): boolean => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dot = ((px - x1) * dx + (py - y1) * dy) / (length * length);
    const closestX = x1 + dot * dx;
    const closestY = y1 + dot * dy;
    const distance = Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
    return distance <= threshold;
  };

  const zoomCanvas = (scaleFactor: number, event: MouseEvent | { clientX: number, clientY: number } = { clientX: canvas!.width / 2, clientY: canvas!.height / 2 }) => {
    if (scaleFactor === 10) {
      scale.current = 1;
      panX.current = 0;
      panY.current = 0;
    } else {
      let newScale = scale.current * scaleFactor;
      if (newScale < minScale.current) {
        newScale = minScale.current;
      } else if (newScale > maxScale.current) {
        newScale = maxScale.current;
      }

      const rect = canvas!.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width;
      const offsetY = (event.clientY - rect.top) / rect.height;

      const dx = (offsetX * canvas!.width) * (1 - scaleFactor);
      const dy = (offsetY * canvas!.height) * (1 - scaleFactor);

      scale.current = newScale;
      panX.current = panX.current * scaleFactor + dx;
      panY.current = panY.current * scaleFactor + dy;

      const maxPanX = (canvas!.width * (scale.current - 1)) / scale.current;
      const maxPanY = (canvas!.height * (scale.current - 1)) / scale.current;
      panX.current = Math.min(Math.max(panX.current, -maxPanX), 0);
      panY.current = Math.min(Math.max(panY.current, -maxPanY), 0);
    }

    ctx!.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
    drawShapes();
  };

  const handleZoom = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomCanvas(1.2, e);
    } else {
      zoomCanvas(0.8, e);
    }
  };

  const drawEdgeMarkers = () => {
    ctx!.save();
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.strokeStyle = 'red';
    ctx!.lineWidth = 5;
    ctx!.setLineDash([]); // solid line

    const markerLength = 20;
    const topLeftX = panX.current;
    const topLeftY = panY.current;
    const bottomRightX = panX.current + maxWidth.current * scale.current;
    const bottomRightY = panY.current + maxHeight.current * scale.current;

    ctx!.beginPath();
    ctx!.moveTo(topLeftX, topLeftY + markerLength);
    ctx!.lineTo(topLeftX, topLeftY);
    ctx!.lineTo(topLeftX + markerLength, topLeftY);
    ctx!.stroke();

    ctx!.beginPath();
    ctx!.moveTo(bottomRightX - markerLength, topLeftY);
    ctx!.lineTo(bottomRightX, topLeftY);
    ctx!.lineTo(bottomRightX, topLeftY + markerLength);
    ctx!.stroke();

    ctx!.beginPath();
    ctx!.moveTo(bottomRightX, bottomRightY - markerLength);
    ctx!.lineTo(bottomRightX, bottomRightY);
    ctx!.lineTo(bottomRightX - markerLength, bottomRightY);
    ctx!.stroke();

    ctx!.beginPath();
    ctx!.moveTo(topLeftX + markerLength, bottomRightY);
    ctx!.lineTo(topLeftX, bottomRightY);
    ctx!.lineTo(topLeftX, bottomRightY - markerLength);
    ctx!.stroke();

    ctx!.restore();
  };

  const drawShapes = () => {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx!.save();
    ctx!.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
    if (useImageBackground) {
      ctx!.drawImage(backgroundImage.current, -panX.current / scale.current, -panY.current / scale.current, canvas!.width / scale.current, canvas!.height / scale.current);
    } else {
      ctx!.fillStyle = '#fff';
      ctx!.fillRect(-panX.current / scale.current, -panY.current / scale.current, canvas!.width / scale.current, canvas!.height / scale.current);
    }
    shapes.forEach(shape => {
      if (shape.type === 'line') {
        drawLine(shape.x1!, shape.y1!, shape.x2!, shape.y2!, shape.color!, shape.thickness!, shape.lineType!);
      } else if (shape.type === 'freehand') {
        drawFreehand(shape.points!, shape.color!, shape.thickness!);
      } else if (shape.type === 'text') {
        ctx!.font = `${shape.fontSize}px ${shape.font}`;
        ctx!.fillStyle = shape.color!;
        ctx!.fillText(shape.text!, shape.x!, shape.y!);
      } else if (shape.type === 'image') {
        ctx!.drawImage(shape.img!, shape.x1!, shape.y1!, shape.x2! - shape.x1!, shape.y2! - shape.y1!);
      } else {
        drawShape(shape.type, shape.x1!, shape.y1!, shape.x2!, shape.y2!, shape.color!, shape.thickness!, shape.lineType!);
      }
    });
    ctx!.restore();
    drawEdgeMarkers();
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, thickness: number, lineType: string) => {
    ctx!.beginPath();
    ctx!.strokeStyle = color;
    ctx!.lineWidth = thickness;
    if (lineType === 'dashed') {
      ctx!.setLineDash([10, 10]);
    } else if (lineType === 'dotted') {
      ctx!.setLineDash([2, 10]);
    } else if (lineType === 'dashDot') {
      ctx!.setLineDash([10, 5, 2, 5]);
    } else {
      ctx!.setLineDash([]);
    }
    ctx!.moveTo(x1, y1);
    ctx!.lineTo(x2, y2);
    ctx!.stroke();
    ctx!.setLineDash([]);
  };

  const drawFreehand = (points: Array<{ x: number, y: number }>, color: string, thickness: number) => {
    if (points.length < 2) return;
    ctx!.strokeStyle = color;
    ctx!.lineWidth = thickness;
    ctx!.beginPath();
    ctx!.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx!.lineTo(points[i].x, points[i].y);
    }
    ctx!.stroke();
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number, x1: number, y1: number, x2: number, y2: number) => {
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

  const drawShape = (type: string, x1: number, y1: number, x2: number, y2: number, color: string, thickness: number, lineType: string, img: HTMLImageElement | null = null, ctxx: CanvasRenderingContext2D = ctx!) => {
    ctxx.beginPath();
    ctxx.strokeStyle = color;
    ctxx.lineWidth = thickness;
    if (lineType === 'dashed') {
      ctxx.setLineDash([10, 10]);
    } else if (lineType === 'dotted') {
      ctxx.setLineDash([2, 10]);
    } else if (lineType === 'dashDot') {
      ctxx.setLineDash([10, 5, 2, 5]);
    } else {
      ctxx.setLineDash([]);
    }
    if (type === 'rectangle') {
      ctxx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (type === 'circle') {
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      ctxx.arc(x1, y1, radius, 0, 2 * Math.PI);
      ctxx.stroke();
    } else if (type === 'rhombus') {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctxx.moveTo(centerX, y1);
      ctxx.lineTo(x2, centerY);
      ctxx.lineTo(centerX, y2);
      ctxx.lineTo(x1, centerY);
      ctxx.closePath();
      ctxx.stroke();
    } else if (type === 'pentagon') {
      drawPolygon(ctxx, 5, x1, y1, x2, y2);
    } else if (type === 'hexagon') {
      drawPolygon(ctxx, 6, x1, y1, x2, y2);
    } else if (type === 'triangle') {
      const centerXTriangle = (x1 + x2) / 2;
      ctxx.moveTo(centerXTriangle, y1);
      ctxx.lineTo(x2, y2);
      ctxx.lineTo(x1, y2);
      ctxx.closePath();
      ctxx.stroke();
    } else if (type === 'square') {
      ctxx.strokeRect(x1, y1, x2 - x1, x2 - x1);
    } else if (type === 'octagon') {
      drawPolygon(ctxx, 8, x1, y1, x2, y2);
    } else if (type === 'oval') {
      const radiusX = Math.abs(x2 - x1) / 2;
      const radiusY = Math.abs(y2 - y1) / 2;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctxx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctxx.stroke();
    } else if (type === 'parallelogram') {
      const centerX = (x1 + x2) / 2;
      ctxx.moveTo(centerX, y1);
      ctxx.lineTo(x2, y2);
      ctxx.lineTo(centerX, y2);
      ctxx.lineTo(x1, y1);
      ctxx.closePath();
      ctxx.stroke();
    } else if (type === 'image') {
      ctxx.drawImage(img!, x1, y1, x2 - x1, y2 - y1);
    }
  };

  const undo = () => {
    if (!checkBoardAccess()) return;

    if (shapes.length > 0) {
      redoStack.push(shapes.pop()!);
      updateRedoStack(redoStack);
      drawShapes();
      socket.emit('updateBoardAction', { action: 'undo' }, handleServerResponse);
    }
  };

  const redo = () => {
    if (!checkBoardAccess()) return;

    if (redoStack.length > 0) {
      shapes.push(redoStack.pop()!);
      updateShapes(shapes);
      drawShapes();
      socket.emit('updateBoardAction', { action: 'redo' }, handleServerResponse);
    }
  };

  const saveState = () => {
    undoStack.push(JSON.stringify(shapes));
    updateUndoStack(undoStack);
  };

  const findShape = (x: number, y: number): Shape | undefined => {
    return shapes.find(shape => {
      if (shape.type === 'freehand') {
        return shape.points!.some(point => {
          const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
          return distance < shape.thickness!;
        });
      } else if (shape.type === 'text') {
        ctx!.font = `${shape.fontSize}px ${shape.font}`;
        const textMetrics = ctx!.measureText(shape.text!);
        return x > shape.x! && x < shape.x! + textMetrics.width && y > shape.y! - shape.fontSize! && y < shape.y!;
      } else if (shape.type === 'image') {
        return x > shape.x1! && x < shape.x2! && y > shape.y1! && y < shape.y2!;
      } else {
        return x > shape.x1! && x < shape.x2! && y > shape.y1! && y < shape.y2!;
      }
    });
  };

  const drawSelection = (shape: Shape | null) => {
    if (!shape) return;

    const handles = getResizeHandles(shape);
    ctx!.strokeStyle = 'red';
    ctx!.lineWidth = 2;
    ctx!.setLineDash([6, 3]);
    if (shape.type === 'line') {
      ctx!.beginPath();
      ctx!.moveTo(shape.x1!, shape.y1!);
      ctx!.lineTo(shape.x2!, shape.y2!);
      ctx!.stroke();
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(shape.x2! - shape.x1!, 2) + Math.pow(shape.y2! - shape.y1!, 2));
      ctx!.beginPath();
      ctx!.arc(shape.x1!, shape.y1!, radius, 0, 2 * Math.PI);
      ctx!.stroke();
    } else {
      ctx!.strokeRect(shape.x1!, shape.y1!, shape.x2! - shape.x1!, shape.y2! - shape.y1!);
    }

    ctx!.setLineDash([]);

    handles.forEach(handle => {
      ctx!.fillStyle = handle.isCenter ? 'blue' : 'red';
      ctx!.fillRect(handle.x - 6, handle.y - 6, 12, 12);
    });
  };

  const getResizeHandles = (shape: Shape) => {
    const handles: any[] = [];
    if (shape.type === 'line') {
      handles.push({ x: shape.x1!, y: shape.y1! });
      handles.push({ x: shape.x2!, y: shape.y2! });
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(shape.x2! - shape.x1!, 2) + Math.pow(shape.y2! - shape.y1!, 2));
      handles.push({ x: shape.x1! + radius, y: shape.y1! });
      handles.push({ x: shape.x1! - radius, y: shape.y1! });
      handles.push({ x: shape.x1!, y: shape.y1! + radius });
      handles.push({ x: shape.x1!, y: shape.y1! - radius });
      handles.push({ x: shape.x1!, y: shape.y1!, isCenter: true });
    } else if (shape.type === 'text') {
      const textMetrics = ctx!.measureText(shape.text!);
      handles.push({ x: shape.x!, y: shape.y! - shape.fontSize!, isCenter: true });
      handles.push({ x: shape.x! + textMetrics.width, y: shape.y!, isCenter: false });
    } else if (shape.type === 'image') {
      handles.push({ x: shape.x1!, y: shape.y1! });
      handles.push({ x: shape.x2!, y: shape.y1! });
      handles.push({ x: shape.x2!, y: shape.y2! });
      handles.push({ x: shape.x1!, y: shape.y2! });
      handles.push({ x: (shape.x1! + shape.x2!) / 2, y: (shape.y1! + shape.y2!) / 2, isCenter: true });
    } else {
      handles.push({ x: shape.x1!, y: shape.y1! });
      handles.push({ x: shape.x2!, y: shape.y1! });
      handles.push({ x: shape.x2!, y: shape.y2! });
      handles.push({ x: shape.x1!, y: shape.y2! });
      handles.push({ x: (shape.x1! + shape.x2!) / 2, y: (shape.y1! + shape.y2!) / 2, isCenter: true });
    }
    return handles.map(handle => ({
      ...handle,
      isCenter: handle.isCenter || false
    }));
  };

  const getHandleAtPosition = (x: number, y: number): { x: number; y: number; isCenter?: boolean } | undefined => {
    if (!selectedShape.current) return undefined;
    return getResizeHandles(selectedShape.current).find(handle => {
      return Math.abs(handle.x - x) < 6 && Math.abs(handle.y - y) < 6;
    });
  };

  const resizeShape = (shape: Shape, handle: { x: number, y: number, isCenter?: boolean }, x: number, y: number) => {
    if (shape.type === 'line') {
      if (handle.x === shape.x1 && handle.y === shape.y1) {
        shape.x1 = x;
        shape.y1 = y;
      } else {
        shape.x2 = x;
        shape.y2 = y;
      }
    } else if (shape.type === 'circle') {
      const dx = x - shape.x1!;
      const dy = y - shape.y1!;
      const radius = Math.sqrt(dx * dx + dy * dy);
      shape.x2 = shape.x1! + radius;
      shape.y2 = shape.y1!;
    } else if (shape.type === 'text') {
      if (handle.isCenter) {
        shape.x = x;
        shape.y = y;
      } else {
        const textMetrics = ctx!.measureText(shape.text!);
        shape.x = x - textMetrics.width;
        shape.y = y;
      }
    } else if (shape.type === 'image') {
      if (handle.isCenter) {
        const dx = x - (shape.x1! + shape.x2!) / 2;
        const dy = y - (shape.y1! + shape.y2!) / 2;
        moveShape(shape, dx, dy);
      } else {
        if (handle.x === shape.x1! && handle.y === shape.y1!) {
          shape.x1 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2! && handle.y === shape.y1!) {
          shape.x2 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2! && handle.y === shape.y2!) {
          shape.x2 = x;
          shape.y2 = y;
        } else {
          shape.x1 = x;
          shape.y2 = y;
        }
      }
    } else {
      if (handle.isCenter) {
        const dx = x - (shape.x1! + shape.x2!) / 2;
        const dy = y - (shape.y1! + shape.y2!) / 2;
        moveShape(shape, dx, dy);
      } else {
        if (handle.x === shape.x1! && handle.y === shape.y1!) {
          shape.x1 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2! && handle.y === shape.y1!) {
          shape.x2 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2! && handle.y === shape.y2!) {
          shape.x2 = x;
          shape.y2 = y;
        } else {
          shape.x1 = x;
          shape.y2 = y;
        }
      }
    }
    drawShapes();
  };

  const moveShape = (shape: Shape, dx: number, dy: number) => {
    if (shape.type === 'line' || shape.type === 'circle') {
      shape.x1! += dx;
      shape.y1! += dy;
      shape.x2! += dx;
      shape.y2! += dy;
    } else if (shape.type === 'freehand') {
      shape.points!.forEach(point => {
        point.x += dx;
        point.y += dy;
      });
    } else if (shape.type === 'text') {
      shape.x! += dx;
      shape.y! += dy;
    } else if (shape.type === 'image') {
      shape.x1! += dx;
      shape.y1! += dy;
      shape.x2! += dx;
      shape.y2! += dy;
    } else {
      shape.x1! += dx;
      shape.y1! += dy;
      shape.x2! += dx;
      shape.y2! += dy;
    }
  };

  const downloadCanvas = (tempCanvas: HTMLCanvasElement) => {
    const link = downloadLinkRef.current!;
    link.href = tempCanvas.toDataURL();
    link.download = 'whiteboard.png';
    link.click();
  };

  const saveCanvas = () => {
    const tempCanvas = tempCanvasRef.current!;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = canvas!.width;
    tempCanvas.height = canvas!.height;
    const notShapes = ['freehand', 'text', 'image', 'line'];

    if (useImageBackground) {
      const backgroundImage = new Image();
      backgroundImage.crossOrigin = 'anonymous';
      backgroundImage.onload = () => {
        tempCtx.drawImage(backgroundImage, 0, 0, tempCanvas.width, tempCanvas.height);
        shapes.forEach(shape => {
          if (!notShapes.includes(shape.type)){
            drawShape(shape.type, shape.x1!, shape.y1!, shape.x2!, shape.y2!, shape.color!, shape.thickness!, shape.lineType!, null, tempCtx)
          } else {
            drawShapeOnCanvas(shape, tempCtx);
           }
        });
        downloadCanvas(tempCanvas);
      };
      backgroundImage.src = imageBackgroundUrl;
    } else {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      shapes.forEach(shape => {
        if (!notShapes.includes(shape.type)){
          drawShape(shape.type, shape.x1!, shape.y1!, shape.x2!, shape.y2!, shape.color!, shape.thickness!, shape.lineType!, null, tempCtx)
        }else{
          drawShapeOnCanvas(shape, tempCtx);
        }
      });
      downloadCanvas(tempCanvas);
    }
  };

  const drawShapeOnCanvas = (shape: Shape, ctxx = ctx!) => {
    ctxx.beginPath();
    ctxx.strokeStyle = shape.color!;
    ctxx.lineWidth = shape.thickness || 2;
    ctxx.fillStyle = shape.color!;
    ctxx.font = `${shape.fontSize}px ${shape.font}`;

    const lineType = shape.lineType ? shape.lineType : 'solid';

    if (lineType === 'dashed') {
      ctxx.setLineDash([10, 10]);
    } else if (lineType === 'dotted') {
      ctxx.setLineDash([2, 10]);
    } else if (lineType === 'dashDot') {
      ctxx.setLineDash([10, 5, 2, 5]);
    } else {
      ctxx.setLineDash([]);
    }
    switch (shape.type) {
      case 'line':
        ctxx.moveTo(shape.x1!, shape.y1!);
        ctxx.lineTo(shape.x2!, shape.y2!);
        break;
      case 'freehand':
        try {
          ctxx.moveTo(shape.points![0].x, shape.points![0].y);
          shape.points!.forEach(point => ctxx.lineTo(point.x, point.y));
        } catch (e) {
          console.error(e);
        }
        break;
      case 'text':
        ctxx.fillText(shape.text!, shape.x!, shape.y!);
        break;
      case 'image':
        ctxx.drawImage(shape.img!, shape.x1!, shape.y1!, shape.x2! - shape.x1!, shape.y2! - shape.y1!);
        break;
      default:
        break;
    }
    ctxx.stroke();
  };

  const deleteShape = (doEmits = true) => {
    if (!checkBoardAccess()) return;

    if (!selectedShape.current) return;
    if (selectedShape.current) {
      shapes = shapes.filter(shape => shape !== selectedShape.current);
      updateShapes(shapes);
      selectedShape.current = null;
      if (doEmits) {
        socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
      }
      drawShapes();
    }
  };

  const toggleBackground = (doEmits = true) => {
    if (doEmits && !checkBoardAccess()) return;
    useImageBackground = !useImageBackground;
    updateUseImageBackground(useImageBackground);
    const toggleButton = toggleBackgroundRef.current!;
    if (useImageBackground) {
      canvas!.style.backgroundImage = `url('${imageBackgroundUrl}')`;
      toggleButton.classList.remove('active');
    } else {
      canvas!.style.backgroundImage = 'none';
      canvas!.style.backgroundColor = 'white';
      toggleButton.classList.add('active');
    }
    drawShapes();
    if (doEmits) {
      socket.emit('updateBoardAction', { action: 'toggleBackground', payload: useImageBackground }, handleServerResponse);
    }
  };

  const clearCanvas = (doEmits = true) => {
    if (islevel != "2" && doEmits) {
      showAlert?.({ message: 'You do not have permission to clear the board', type: 'danger' });
      return;
    }
    if (shapes.length === 0) return;
    shapes = [];
    updateShapes([]);
    drawShapes();
    if (doEmits) {
      socket.emit('updateBoardAction', { action: 'clear' }, handleServerResponse);
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, doEmits = true) => {
    try {
      if (!checkBoardAccess()) return;
      const file = e.target.files![0];
      if (file.size > 1024 * 1024) {
        showAlert?.({ message: 'File size must be less than 1MB', type: 'danger' });
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          if (img.height > 600 && img.height > img.width && !file.type.includes('jpeg')) {
            showAlert?.({ message: 'For better performance, please upload the image in JPG format.', type: 'danger' });
            return;
          }

          let imageWidth = 350;
          const aspectRatio = img.height / img.width;
          let imageHeight = imageWidth * aspectRatio;
          const maxHeight = 600;
          if (imageHeight > maxHeight) {
            imageHeight = maxHeight;
            imageWidth = imageHeight / aspectRatio;
            if (imageWidth > 600) {
              imageWidth = 600;
            }
          }
          const imageShape = {
            type: 'image',
            img: img,
            src: event!.target!.result as string,
            x1: 50,
            y1: 50,
            x2: 50 + imageWidth,
            y2: 50 + imageHeight,
          };
          shapes.push(imageShape);
          updateShapes(shapes);
          drawShapes();
          if (doEmits) {
            socket.emit('updateBoardAction', { action: 'uploadImage', payload: imageShape }, handleServerResponse);
          }
        };
        img.onerror = function () {
          showAlert?.({ message: 'Error loading image', type: 'danger' });
        };
        img.src = event!.target!.result as string;
      };
      reader.onerror = function () {
        showAlert?.({ message: 'Error reading file', type: 'danger' });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in uploadImage:', error);
    }
  };

  const handleServerResponse = (response: { success: boolean, reason: string }) => {
    if (!response.success) {
      showAlert?.({ message: `Whiteboard action failed: ${response.reason}`, type: 'danger' });
    }
  };

  if (socket instanceof Socket) {

    socket!.on('whiteboardAction', (data: { action: string, payload: any }) => {
      const { action, payload } = data;

      if (!ctx && canvasRef.current) {
        ctx = canvasRef.current.getContext('2d');
        canvasWhiteboard = canvas;
        updateCanvasWhiteboard(canvasWhiteboard);
      }

      if (!ctx) return;

      switch (action) {
        case 'draw':
          if (payload.type === 'freehand') {
            drawFreehand(payload.points, payload.color, payload.thickness);
            shapes.push({ type: 'freehand', points: payload.points, color: payload.color, thickness: payload.thickness });
            updateShapes(shapes);
          } else {
            drawLine(payload.x1, payload.y1, payload.x2, payload.y2, payload.color, payload.thickness, payload.lineType);
            shapes.push({ type: 'line', x1: payload.x1, y1: payload.y1, x2: payload.x2, y2: payload.y2, color: payload.color, thickness: payload.thickness, lineType: payload.lineType });
            updateShapes(shapes);
          }
          break;
        case 'shape':
          drawShape(payload.type, payload.x1, payload.y1, payload.x2, payload.y2, payload.color, payload.thickness, payload.lineType);
          shapes.push({ type: payload.type, x1: payload.x1, y1: payload.y1, x2: payload.x2, y2: payload.y2, color: payload.color, thickness: payload.thickness, lineType: payload.lineType });
          updateShapes(shapes);
          break;
        case 'erase':
          erase(payload.x, payload.y);
          break;
        case 'clear':
          clearCanvas(false);
          break;
        case 'uploadImage':
          { const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function () {
            const imageShape = {
              type: 'image',
              img,
              src: payload.src,
              x1: payload.x1,
              y1: payload.y1,
              x2: payload.x2,
              y2: payload.y2,
            };
            shapes.push(imageShape);
            updateShapes(shapes);
            drawShapes();
          };
          img.src = payload.src;
          break; }
        case 'toggleBackground':
          toggleBackground(false);
          drawShapes();
          break;
        case 'undo':
          if (shapes.length > 0) {
            redoStack.push(shapes.pop()!);
            updateRedoStack(redoStack);
            drawShapes();
          }
          break;
        case 'redo':
          if (redoStack.length > 0) {
            shapes.push(redoStack.pop()!);
            updateShapes(shapes);
            drawShapes();
          }
          break;
        case 'text':
          shapes.push({ type: 'text', text: payload.text, x: payload.x, y: payload.y, color: payload.color, font: payload.font, fontSize: payload.fontSize });
          updateShapes(shapes);
          drawShapes();
          break;
        case 'deleteShape':
          shapes = shapes.filter(shape => shape !== payload);
          updateShapes(shapes);
          drawShapes();
          break;
        case 'shapes':
          { const oldShapes = shapes.filter(shape => shape.type === 'image');
          shapes = payload.shapes.map((shape: Shape) => {
            if (shape.type === 'image') {
              const oldShape = oldShapes.find(oldShape => oldShape.src === shape.src);
              if (oldShape) {
                return { ...shape, img: oldShape.img };
              } else {
                const img = new Image();
                img.src = shape.src!;
                img.crossOrigin = 'anonymous';
                return { ...shape, img };
              }
            } else {
              return shape;
            }
          });
          updateShapes(shapes);
          drawShapes();
          break; }
        default:
          break;
      }
    });

    socket!.on('whiteboardUpdated', async (data: any) => {
      try {
        if (islevel == "2" && data.members) {
          participants = await data.members.filter((participant: any) => participant.isBanned == false);
          updateParticipants(participants);
        }

        whiteboardUsers = data.whiteboardUsers;
        updateWhiteboardUsers(whiteboardUsers);

        const useBoard = whiteboardUsers.find(user => user.name == member && user.useBoard) ? true : false;
        if (islevel != "2" && !useBoard && !whiteboardEnded) {
          changeMode('pan');
        }

        if (data.whiteboardData && Object.keys(data.whiteboardData).length > 0) {
          if (data.whiteboardData.shapes) {
            const oldShapes = shapes.filter(shape => shape.type === 'image');
            shapes = data.whiteboardData.shapes.map((shape: Shape) => {
              if (shape.type === 'image') {
                const oldShape = oldShapes.find(oldShape => oldShape.src === shape.src);
                if (oldShape) {
                  return { ...shape, img: oldShape.img };
                } else {
                  const img = new Image();
                  img.src = shape.src!;
                  img.crossOrigin = 'anonymous';
                  return { ...shape, img };
                }
              } else {
                return shape;
              }
            });
            updateShapes(shapes);
          }
          if (data.whiteboardData.useImageBackground != null) {
            useImageBackground = data.whiteboardData.useImageBackground;
            updateUseImageBackground(useImageBackground);
          } else {
            useImageBackground = true;
            updateUseImageBackground(true);
          }
          if (data.whiteboardData.redoStack) {
            redoStack = data.whiteboardData.redoStack;
            updateRedoStack(redoStack);
          }
          if (data.whiteboardData.undoStack) {
            undoStack = data.whiteboardData.undoStack;
            updateUndoStack(undoStack);
          }
        }

        if (data.status == 'started' && !whiteboardStarted) {
          whiteboardStarted = true;
          whiteboardEnded = false;
          screenId = `whiteboard-${roomName}`;

          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);
          updateScreenId(screenId);

          if (islevel != "2") {
            shareScreenStarted = true;
            updateShareScreenStarted(shareScreenStarted);
            await onScreenChanges({ changed: true, parameters });
          }
        } else if (data.status == 'ended') {
          const prevWhiteboardEnded = whiteboardEnded;
          const prevWhiteboardStarted = whiteboardStarted;
          whiteboardEnded = true;
          whiteboardStarted = false;
          updateWhiteboardStarted(false);
          updateWhiteboardEnded(true);
          if (islevel == "2" && prevWhiteboardEnded) {
            // do nothing
          } else {
            shareScreenStarted = false;
            screenId = "";

            updateShareScreenStarted(false);
            updateScreenId(screenId);
            await onScreenChanges({ changed: true, parameters });
          }

          try {
            if (prevWhiteboardStarted && islevel == "2" && ((recordStarted || recordResumed))) {
              if (!(recordPaused || recordStopped)) {
                if (recordingMediaOptions == 'video') {
                  await captureCanvasStream({ parameters, start: false });
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        } else if (data.status == 'started' && whiteboardStarted) {
          whiteboardStarted = true;
          whiteboardEnded = false;

          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);

          shareScreenStarted = true;
          screenId = `whiteboard-${roomName}`;

          updateShareScreenStarted(true);
          updateScreenId(screenId);
          await onScreenChanges({ changed: true, parameters });
        }
      } catch (error) {
        console.error('Error in whiteboardUpdated:', error);
      }
    });

  }

  const handleDropdownClick = (id: string) => {
    dropdownOpen.current = dropdownOpen.current === id ? null : id;
  };

  const handleItemClick = (callback: (value: any) => void, name: string, value: any) => {
    callback(value);
    dropdownOpen.current = null;
    if (['draw', 'freehand', 'shape', 'text', 'erase'].includes(name)) {
      changeMode(name);
    }
  };

  const dropdownItems = (items: Array<{ label: string | React.JSX.Element, value: any }>, name: string, callback: (value: any) => void) => (
    <div className={`dropdown-menu ${dropdownOpen.current ? 'show' : ''}`}>
      {items.map((item, index) => (
        <button key={index} className="dropdown-item" onClick={() => handleItemClick(callback, name, item.value)} style={{ padding: '5px' }}>
          {item.label}
        </button>
      ))}
    </div>
  );

  const toggleToolbar = () => {
    toolbarVisible.current = !toolbarVisible.current;
  };

  return (
    <div id="witehboard-interface" style={{ position: 'relative', display: showAspect ? 'block' : 'none', justifyContent: 'center', alignItems: 'center', border: '2px solid #000', backgroundColor: '#f0f0f0', width: customWidth, height: customHeight }}>
      <div id="whiteboardContent" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'auto' }}>
        <button id="toolbarToggle" className="btn btnBoard btn-primary" style={{ position: 'absolute', top: '5px', left: '65px', zIndex: 1000 }} onClick={toggleToolbar}>
          <FontAwesomeIcon icon={toolbarVisible.current ? faChevronLeft : faChevronRight} />
        </button>
        {toolbarVisible.current && (
          <div className="toolbar mb-3" id="toolbar" style={{ position: 'absolute', top: '5px', left: '110px', zIndex: 1000, backgroundColor: 'transparent' }}>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-secondary dropdown-toggle" id="drawMode" onClick={() => handleDropdownClick('drawMode')}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
              {dropdownOpen.current === 'drawMode' && dropdownItems([{ label: 'XX-Small (3px)', value: 3 }, { label: 'X-Small (6px)', value: 6 }, { label: 'Small (12px)', value: 12 }, { label: 'Medium (18px)', value: 18 }, { label: 'Large (24px)', value: 24 }, { label: 'X-Large (36px)', value: 36 }], 'draw', updateLineThickness)}
            </div>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-secondary dropdown-toggle" id="freehandMode" onClick={() => handleDropdownClick('freehandMode')}>
                <FontAwesomeIcon icon={faPaintBrush} />
              </button>
              {dropdownOpen.current === 'freehandMode' && dropdownItems([{ label: 'X-Small (5px)', value: 5 }, { label: 'Small (10px)', value: 10 }, { label: 'Medium (20px)', value: 20 }, { label: 'Large (40px)', value: 40 }, { label: 'X-Large (60px)', value: 60 }], 'freehand', updateBrushThickness)}
            </div>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-secondary dropdown-toggle" id="shapeMode" onClick={() => handleDropdownClick('shapeMode')}>
                <FontAwesomeIcon icon={faShapes} />
              </button>
              {dropdownOpen.current === 'shapeMode' && dropdownItems([
                { label: <img src="https://mediasfu.com/images/svg/square.svg" alt="Square" className="shape-icon" />, value: 'square' },
                { label: <img src="https://mediasfu.com/images/svg/rectangle.svg" alt="Rectangle" className="shape-icon" />, value: 'rectangle' },
                { label: <img src="https://mediasfu.com/images/svg/circle.svg" alt="Circle" className="shape-icon" />, value: 'circle' },
                { label: <img src="https://mediasfu.com/images/svg/triangle.svg" alt="Triangle" className="shape-icon" />, value: 'triangle' },
                { label: <img src="https://mediasfu.com/images/svg/hexagon.svg" alt="Hexagon" className="shape-icon" />, value: 'hexagon' },
                { label: <img src="https://mediasfu.com/images/svg/pentagon.svg" alt="Pentagon" className="shape-icon" />, value: 'pentagon' },
                { label: <img src="https://mediasfu.com/images/svg/rhombus.svg" alt="Rhombus" className="shape-icon" />, value: 'rhombus' },
                { label: <img src="https://mediasfu.com/images/svg/octagon.svg" alt="Octagon" className="shape-icon" />, value: 'octagon' },
                { label: <img src="https://mediasfu.com/images/svg/parallelogram.svg" alt="Parallelogram" className="shape-icon" />, value: 'parallelogram' },
                { label: <img src="https://mediasfu.com/images/svg/oval.svg" alt="Oval" className="shape-icon" />, value: 'oval' }
              ], 'shape', updateShape)}
            </div>
            <button className="btn btnBoard btn-secondary" id="selectMode" onClick={() => changeMode('select')}>
              <FontAwesomeIcon icon={faMousePointer} />
            </button>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-danger dropdown-toggle" id="eraseMode" onClick={() => handleDropdownClick('eraseMode')}>
                <FontAwesomeIcon icon={faEraser} />
              </button>
              {dropdownOpen.current === 'eraseMode' && dropdownItems([{ label: 'X-Small (5px)', value: 5 }, { label: 'Small (10px)', value: 10 }, { label: 'Medium (20px)', value: 20 }, { label: 'Large (30px)', value: 30 }, { label: 'X-Large (60px)', value: 60 }], 'erase', updateEraserThickness)}
            </div>
            <button className="btn btnBoard btn-info" id="panMode" onClick={() => changeMode('pan')}>
              <FontAwesomeIcon icon={faHandPaper} />
            </button>
            <button className="btn btnBoard btn-success" id="zoomIn" onClick={(e) => zoomCanvas(1.2, e)}>
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
            <button className="btn btnBoard btn-success" id="zoomReset" onClick={(e) => zoomCanvas(10, e)}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="btn btnBoard btn-success" id="zoomOut" onClick={(e) => zoomCanvas(0.8, e)}>
              <FontAwesomeIcon icon={faSearchMinus} />
            </button>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-secondary dropdown-toggle" id="addText" onClick={() => handleDropdownClick('addText')}>
                <FontAwesomeIcon icon={faFont} />
              </button>
              {dropdownOpen.current === 'addText' && dropdownItems([{ label: 'Arial', value: 'Arial' }, { label: 'Times New Roman', value: 'Times New Roman' }, { label: 'Courier New', value: 'Courier New' }, { label: 'Verdana', value: 'Verdana' }], 'text', updateFont)}
            </div>
            <div className="btn-group" role="group">
              <button className="btn btnBoard btn-secondary dropdown-toggle" id="fontSize" onClick={() => handleDropdownClick('fontSize')}>
                <FontAwesomeIcon icon={faTextHeight} />
              </button>
              {dropdownOpen.current === 'fontSize' && dropdownItems([{ label: 'X-Small (5px)', value: 5 }, { label: 'Small (10px)', value: 10 }, { label: 'Medium (20px)', value: 20 }, { label: 'Large (40px)', value: 40 }, { label: 'X-Large (60px)', value: 60 }], '', updateFontSize)}
            </div>
            <button className="btn btnBoard btn-secondary" id="undo" onClick={undo}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button className="btn btnBoard btn-secondary" id="redo" onClick={redo}>
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button className="btn btnBoard btn-secondary" id="save" onClick={saveCanvas}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="btn btnBoard btn-danger" id="delete" onClick={() => deleteShape()}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="btn btnBoard btn-secondary" id="clearCanvas" onClick={() => clearCanvas()}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button id="toggleBackground" ref={toggleBackgroundRef} className="btn btnBoard btn-secondary" onClick={() => toggleBackground()}>
              <img src="https://mediasfu.com/images/svg/graph.jpg" alt="Background" className="toggle-icon" id="backgroundIcon" />
            </button>
            <input type="file" id="uploadBoardImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadImage(e)} />
            <label htmlFor="uploadBoardImage" className="btn btnBoard btn-primary">
              <FontAwesomeIcon icon={faUpload} />
            </label>
            <input type="color" id="colorPicker" className="btn" value={color.current} onChange={(e) => { color.current = e.target.value }} />
            <select id="lineTypePicker" className="custom-select" style={{ width: 'auto' }} onChange={(e) => { lineType.current = e.target.value; }}>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="dashDot">Dash-Dot</option>
            </select>
          </div>
        )}
        <canvas id="whiteboardCanvas" width="1280" height="720" style={{ border: '2px solid red' }} ref={canvasRef}></canvas>
        <textarea id="textInput" className="form-control" ref={textInputRef} style={{ display: 'none', position: 'absolute' }}></textarea>
        <a href="# " ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
        <canvas ref={tempCanvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
};

export default Whiteboard;
