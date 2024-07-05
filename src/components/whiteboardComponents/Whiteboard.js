import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faUndo, faRedo, faEraser, faShapes, faMousePointer, faHandPaper, faTextHeight,
  faFont, faPencilAlt, faPaintBrush, faTrash, faSave, faSearch, faSearchMinus, faSearchPlus,
  faChevronLeft, faUpload, faChevronRight, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './Whiteboard.css';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Whiteboard = ({ customWidth, customHeight, parameters, showAspect }) => {
  let {
    socket,
    showAlert,
    itemPageLimit,
    islevel,
    roomName,
    eventType,
    shareScreenStarted,
    shared,
    shapes,
    useImageBackground,
    redoStack,
    undoStack,
    canvasStream,
    whiteboardStarted,
    whiteboardEnded,
    whiteboardUsers,
    transportCreated,
    screenProducer,
    screenStream,
    participants,
    participantsAll,
    screenId,
    recordStarted,
    recordStopped,
    recordPaused,
    recordResumed,
    recordingMediaOptions,
    member,
    canvasWhiteboard,

    updateShapes,
    updateUseImageBackground,
    updateRedoStack,
    updateUndoStack,
    updateCanvasStream,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateTransportCreatedScreen,
    updateScreenProducer,
    updateScreenStream,
    updateParticipants,
    updateParticipantsAll,
    updateScreenId,
    updateShareScreenStarted,
    updateCanvasWhiteboard,
  


    //mediasfu functions
    createSendTransport,
    sleep,
    connectSendTransportScreen,
    disconnectSendTransportScreen,
    onScreenChanges,
    captureCanvasStream,

  } = parameters;

  const mode = useRef('pan');
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const freehandDrawing = useRef([]);
  const selectedShape = useRef(null);
  const selectedHandle = useRef(null);
  const movingShape = useRef(false);
  const panX = useRef(0);
  const panY = useRef(0);
  const scale = useRef(1);
  const minScale = useRef(0.25);
  const maxScale = useRef(1.75);
  const eraserThickness = useRef(10);
  const brushThickness = useRef(6);
  const lineThickness = useRef(6);
  const lineType = useRef('solid');
  const color = useRef('#000000');
  const font = useRef('Arial');
  const fontSize = useRef(20);
  const shape = useRef(null);
  const backgroundImage = useRef(new Image());
  const toolbarVisible = useRef(true);
  const dropdownOpen = useRef(null);

  const updateLineType = (type) => {
    lineType.current = type;
  };

  const updateColor = (newColor) => {
    color.current = newColor;
  };

  const updateFont = (newFont) => {
    font.current = newFont;
  };

  const updateFontSize = (newFontSize) => {
    fontSize.current = newFontSize;
  };

  const updateShape = (newShape) => {
    shape.current = newShape;
  };

  const updateLineThickness = (newThickness) => {
    lineThickness.current = newThickness;
  }

  const updateBrushThickness = (newThickness) => {
    brushThickness.current = newThickness;
  };

  const updateEraserThickness = (newThickness) => {
    eraserThickness.current = newThickness;
  };


  const canvasRef = useRef(null);
  const textInputRef = useRef(null);
  const toggleBackgroundRef = useRef(null);
  const downloadLinkRef = useRef(null);
  const tempCanvasRef = useRef(null);
  const imageBackgroundUrl = 'https://mediasfu.com/images/svg/graph_paper.jpg';

  let canvas = canvasRef.current;
  let ctx = canvas ? canvas.getContext('2d') : null;

  useEffect(() => {
    const img = new Image();
    img.src = imageBackgroundUrl;
    img.onload = () => {
      backgroundImage.current = img;
      drawShapes();
    };

    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
      canvasWhiteboard = canvas;
      updateCanvasWhiteboard(canvasWhiteboard);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('wheel', handleZoom);
    canvas.addEventListener('click', handleCanvasClick);

    //touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('wheel', handleZoom);
      canvas.removeEventListener('click', handleCanvasClick);

      //touch events
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shapes, panX.current, panY.current, scale.current]);


  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  };


  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  };


  const handleClickOutside = (event) => {
    if (dropdownOpen.current && !event.target.closest('.btn-group')) {
      dropdownOpen.current = null;
    }
  };


  const handleCanvasClick = (e) => {
    if (mode.current === 'text') {
      const textInput = textInputRef.current;
      textInput.style.left = e.clientX + 'px';
      textInput.style.top = e.clientY + 'px';
      textInput.style.display = 'block';
      textInput.focus();
      textInput.addEventListener('keypress', function onEnter(event) {
        if (event.key === 'Enter') {
          const text = textInput.value;
          textInput.style.display = 'none';
          textInput.value = '';
          shapes.push({ type: 'text', text, x: (e.offsetX - panX.current) / scale.current, y: (e.offsetY - panY.current) / scale.current, color: color.current, font: font.current, fontSize: fontSize.current });
          drawShapes();
          updateShapes(shapes);
          textInput.removeEventListener('keypress', onEnter);
          socket.emit('updateBoardAction', { action: 'text', payload: { type: 'text', text, x: (e.offsetX - panX.current) / scale.current, y: (e.offsetY - panY.current) / scale.current, color: color.current, font: font.current, fontSize: fontSize.current } }, handleServerResponse);
        }
      });
    }
  };

  const startDrawing = (e) => {
    try {
      isDrawing.current = true;
      startX.current = (e.offsetX - panX.current) / scale.current;
      startY.current = (e.offsetY - panY.current) / scale.current;

      if (mode.current === 'erase') {
        erase(startX.current, startY.current);
      } else if (mode.current === 'draw' || mode.current === 'freehand') {
        ctx.beginPath();
        ctx.moveTo(startX.current, startY.current);
        if (mode.current === 'freehand') {
          freehandDrawing.current = [{ x: startX.current, y: startY.current }];
        }
      } else if (mode.current === 'pan') {
        isPanning.current = true;
        isDragging.current = false;
      } else if (mode.current === 'select') {
        selectedHandle.current = getHandleAtPosition(startX.current, startY.current);
        if (selectedHandle.current) {
          isDragging.current = true;
          movingShape.current = selectedHandle.current.isCenter;
        } else {
          selectedShape.current = findShape(startX.current, startY.current);
          if (selectedShape.current) {
            drawShapes();
            drawSelection(selectedShape.current);
          }
        }
      }
    } catch (error) {
      //console.log(error, 'Whiteboard.js startDrawing');
    }
  };

  const checkBoardAccess = () => {
    if (whiteboardStarted && !whiteboardEnded) {
      const user = whiteboardUsers.find(user => user.name === member);
      if ((!user || !user.useBoard) && islevel != '2') {
        showAlert({ message: 'You are not allowed to use the whiteboard. Please ask the host to assign you.', type: 'danger' });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const changeMode = (newMode) => {
    if (newMode !== 'pan' && !checkBoardAccess()) return;
    mode.current = newMode;
    if (newMode === 'pan') {
      canvas.style.cursor = 'grab';
    } else if (newMode === 'select') {
      canvas.style.cursor = 'pointer';
    } else if (newMode === 'erase') {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'crosshair';
    }
    if (newMode !== 'freehand' && freehandDrawing.current.length > 0) {
      shapes.push({ type: 'freehand', points: freehandDrawing.current, color: color.current, thickness: brushThickness.current });
      updateShapes(shapes);
      freehandDrawing.current = [];
      saveState();
    }
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    currentX.current = (e.offsetX - panX.current) / scale.current;
    currentY.current = (e.offsetY - panY.current) / scale.current;

    if (mode.current == 'draw' || mode.current == 'freehand' || mode.current == 'shape') {
      //if more than 1280x720, do not draw
      if (currentX.current > 1280 || currentY.current > 720) {
        return;
      }
    }

    if (mode.current === 'erase') {
      erase(currentX.current, currentY.current);
    } else if (mode.current === 'draw') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes();
      drawLine(startX.current, startY.current, currentX.current, currentY.current, color.current, lineThickness.current, lineType.current);
    } else if (mode.current === 'freehand') {
      ctx.lineTo(currentX.current, currentY.current);
      ctx.strokeStyle = color.current;
      ctx.lineWidth = brushThickness.current;
      ctx.stroke();
      freehandDrawing.current.push({ x: currentX.current, y: currentY.current });
    } else if (mode.current === 'shape') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes();
      drawShape(shape.current, startX.current, startY.current, currentX.current, currentY.current, color.current, lineThickness.current, lineType.current);
    } else if (mode.current === 'pan' && isPanning.current) {
      isDragging.current = true;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      panX.current += dx;
      panY.current += dy;
      startX.current = e.clientX;
      startY.current = e.clientY;

      ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
      drawShapes();
    } else if (mode.current === 'select' && selectedShape.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (movingShape.current) {
        const dx = currentX.current - startX.current;
        const dy = currentY.current - startY.current;
        moveShape(selectedShape.current, dx, dy);
        startX.current = currentX.current;
        startY.current = currentY.current;
      } else if (isDragging.current) {
        resizeShape(selectedShape.current, selectedHandle.current, currentX.current, currentY.current);
      }
      drawShapes();
      drawSelection(selectedShape.current);
    }
  };

  const stopDrawing = (e) => {
    isDrawing.current = false;
    isPanning.current = false;
    isDragging.current = false;

    ctx.closePath();

    if (mode.current === 'draw') {
      shapes.push({ type: 'line', x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current });
      updateShapes(shapes);
      saveState();
      socket.emit('updateBoardAction', { action: 'draw', payload: { type: 'line', x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current } }, handleServerResponse);
    } else if (mode.current === 'freehand') {
      shapes.push({ type: 'freehand', points: freehandDrawing.current, color: color.current, thickness: brushThickness.current });
      updateShapes(shapes);
      socket.emit('updateBoardAction', { action: 'draw', payload: { type: 'freehand', points: freehandDrawing.current, color: color.current, thickness: brushThickness.current } }, handleServerResponse);
      freehandDrawing.current = [];
      saveState();

    } else if (mode.current === 'shape') {
      shapes.push({ type: shape.current, x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current });
      updateShapes(shapes);
      saveState();
      socket.emit('updateBoardAction', { action: 'shape', payload: { type: shape.current, x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current } }, handleServerResponse);
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

  const erase = (x, y) => {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraserThickness.current / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    let changeOccurred = false;
    shapes = shapes.map(shape => {
      if (shape.type === 'freehand') {
        return {
          ...shape,
          points: shape.points.filter(point => {
            const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
            if (distance <= eraserThickness.current / 2) {
              changeOccurred = true;
              return false;
            }
            return distance > eraserThickness.current / 2;
          })
        };
      } else if (shape.type === 'line') {
        if (isPointNearLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2, eraserThickness.current / 2)) {
          changeOccurred = true;
          return null;
        }
      } else if (shape.type === 'text') {
        const textWidth = ctx.measureText(shape.text).width;
        if (x > shape.x && x < shape.x + textWidth && y > shape.y - shape.fontSize && y < shape.y) {
          changeOccurred = true;
          return null;
        }
      } else if (shape.type === 'image') {
        if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
          changeOccurred = true;
          return null;
        }
      } else {
        if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
          changeOccurred = true;
          return null;
        }
      }
      return shape;
    }).filter(shape => shape && (shape.type !== 'freehand' || shape.points.length > 0));
    updateShapes(shapes);

    drawShapes();
    if (changeOccurred) {
      socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
    }
  };

  const isPointNearLine = (px, py, x1, y1, x2, y2, threshold) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dot = ((px - x1) * dx + (py - y1) * dy) / (length * length);
    const closestX = x1 + dot * dx;
    const closestY = y1 + dot * dy;
    const distance = Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
    return distance <= threshold;
  };

  const zoomCanvas = (scaleFactor, event = { clientX: canvas.width / 2, clientY: canvas.height / 2 }) => {
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

      const rect = canvas.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width;
      const offsetY = (event.clientY - rect.top) / rect.height;

      const dx = (offsetX * canvas.width) * (1 - scaleFactor);
      const dy = (offsetY * canvas.height) * (1 - scaleFactor);

      scale.current = newScale;
      panX.current = panX.current * scaleFactor + dx;
      panY.current = panY.current * scaleFactor + dy;

      const maxPanX = (canvas.width * (scale.current - 1)) / scale.current;
      const maxPanY = (canvas.height * (scale.current - 1)) / scale.current;
      panX.current = Math.min(Math.max(panX.current, -maxPanX), 0);
      panY.current = Math.min(Math.max(panY.current, -maxPanY), 0);
    }

    ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
    drawShapes();
  };

  const handleZoom = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomCanvas(1.2, e);
    } else {
      zoomCanvas(0.8, e);
    }
  };

  const drawEdgeMarkers = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    const markerLength = 20;
    const topLeftX = panX.current;
    const topLeftY = panY.current;
    const bottomRightX = panX.current + 1280 * scale.current;
    const bottomRightY = panY.current + 720 * scale.current;

    ctx.beginPath();
    ctx.moveTo(topLeftX, topLeftY + markerLength);
    ctx.lineTo(topLeftX, topLeftY);
    ctx.lineTo(topLeftX + markerLength, topLeftY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bottomRightX - markerLength, topLeftY);
    ctx.lineTo(bottomRightX, topLeftY);
    ctx.lineTo(bottomRightX, topLeftY + markerLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bottomRightX, bottomRightY - markerLength);
    ctx.lineTo(bottomRightX, bottomRightY);
    ctx.lineTo(bottomRightX - markerLength, bottomRightY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(topLeftX + markerLength, bottomRightY);
    ctx.lineTo(topLeftX, bottomRightY);
    ctx.lineTo(topLeftX, bottomRightY - markerLength);
    ctx.stroke();

    ctx.restore();
  };

  const drawShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
    if (useImageBackground) {
      ctx.drawImage(backgroundImage.current, -panX.current / scale.current, -panY.current / scale.current, canvas.width / scale.current, canvas.height / scale.current);
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(-panX.current / scale.current, -panY.current / scale.current, canvas.width / scale.current, canvas.height / scale.current);
    }
    shapes.forEach(shape => {
      if (shape.type === 'line') {
        drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType);
      } else if (shape.type === 'freehand') {
        drawFreehand(shape.points, shape.color, shape.thickness);
      } else if (shape.type === 'text') {
        ctx.font = `${shape.fontSize}px ${shape.font}`;
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.x, shape.y);
      } else if (shape.type === 'image') {
        ctx.drawImage(shape.img, shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
      } else {
        drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType);
      }
    });
    ctx.restore();
    drawEdgeMarkers();
  };

  const drawLine = (x1, y1, x2, y2, color, thickness, lineType) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    if (lineType === 'dashed') {
      ctx.setLineDash([10, 10]);
    } else if (lineType === 'dotted') {
      ctx.setLineDash([2, 10]);
    } else if (lineType === 'dashDot') {
      ctx.setLineDash([10, 5, 2, 5]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawText = (text, x, y, color, font) => {
    ctx.font = `20px ${font}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };

  const drawFreehand = (points, color, thickness) => {
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

  const drawPolygon = (ctx, sides, x1, y1, x2, y2) => {
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

  const drawShape = (type, x1, y1, x2, y2, color, thickness, lineType, ctxx = ctx) => {
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
      const halfWidth = Math.abs(x2 - x1) / 2;
      const halfHeight = Math.abs(y2 - y1) / 2;
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
      const centerY = (y1 + y2) / 2;
      ctxx.moveTo(centerX, y1);
      ctxx.lineTo(x2, y2);
      ctxx.lineTo(centerX, y2);
      ctxx.lineTo(x1, y1);
      ctxx.closePath();
      ctxx.stroke();
    } else if (type === 'image') {
      ctxx.drawImage(shape.img, x1, y1, x2 - x1, y2 - y1);
    }
  };

  const undo = () => {
    if (!checkBoardAccess()) return;

    if (shapes.length > 0) {
      redoStack.push(shapes.pop());
      updateRedoStack(redoStack);
      drawShapes();
      socket.emit('updateBoardAction', { action: 'undo' }, handleServerResponse);
    }
  };

  const redo = () => {
    if (!checkBoardAccess()) return;

    if (redoStack.length > 0) {
      shapes.push(redoStack.pop())
      updateShapes(shapes);
      drawShapes();
      socket.emit('updateBoardAction', { action: 'redo' }, handleServerResponse);
    }
  };

  const saveState = () => {
    undoStack.push(JSON.stringify(shapes));
    updateUndoStack(undoStack);
  };

  const findShape = (x, y) => {
    return shapes.find(shape => {
      if (shape.type === 'freehand') {
        return shape.points.some(point => {
          const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
          return distance < shape.thickness;
        });
      } else if (shape.type === 'text') {
        ctx.font = `${shape.fontSize}px ${shape.font}`;
        const textMetrics = ctx.measureText(shape.text);
        return x > shape.x && x < shape.x + textMetrics.width && y > shape.y - shape.fontSize && y < shape.y;
      } else if (shape.type === 'image') {
        return x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2;
      } else {
        return x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2;
      }
    });
  };

  const drawSelection = (shape) => {
    if (!shape) return;

    const handles = getResizeHandles(shape);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    if (shape.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2));
      ctx.beginPath();
      ctx.arc(shape.x1, shape.y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      ctx.strokeRect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
    }

    ctx.setLineDash([]);

    handles.forEach(handle => {
      ctx.fillStyle = handle.isCenter ? 'blue' : 'red';
      ctx.fillRect(handle.x - 6, handle.y - 6, 12, 12);
    });
  };

  const getResizeHandles = (shape) => {
    const handles = [];
    if (shape.type === 'line') {
      handles.push({ x: shape.x1, y: shape.y1 });
      handles.push({ x: shape.x2, y: shape.y2 });
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2));
      handles.push({ x: shape.x1 + radius, y: shape.y1 });
      handles.push({ x: shape.x1 - radius, y: shape.y1 });
      handles.push({ x: shape.x1, y: shape.y1 + radius });
      handles.push({ x: shape.x1, y: shape.y1 - radius });
      handles.push({ x: shape.x1, y: shape.y1, isCenter: true });
    } else if (shape.type === 'text') {
      const textMetrics = ctx.measureText(shape.text);
      handles.push({ x: shape.x, y: shape.y - shape.fontSize, isCenter: true });
      handles.push({ x: shape.x + textMetrics.width, y: shape.y, isCenter: false });
    } else if (shape.type === 'image') {
      handles.push({ x: shape.x1, y: shape.y1 });
      handles.push({ x: shape.x2, y: shape.y1 });
      handles.push({ x: shape.x2, y: shape.y2 });
      handles.push({ x: shape.x1, y: shape.y2 });
      handles.push({ x: (shape.x1 + shape.x2) / 2, y: (shape.y1 + shape.y2) / 2, isCenter: true });
    } else {
      handles.push({ x: shape.x1, y: shape.y1 });
      handles.push({ x: shape.x2, y: shape.y1 });
      handles.push({ x: shape.x2, y: shape.y2 });
      handles.push({ x: shape.x1, y: shape.y2 });
      handles.push({ x: (shape.x1 + shape.x2) / 2, y: (shape.y1 + shape.y2) / 2, isCenter: true });
    }
    return handles.map(handle => ({
      ...handle,
      isCenter: handle.isCenter || false
    }));
  };

  const getHandleAtPosition = (x, y) => {
    if (!selectedShape.current) return null;
    return getResizeHandles(selectedShape.current).find(handle => {
      return Math.abs(handle.x - x) < 6 && Math.abs(handle.y - y) < 6;
    });
  };

  const resizeShape = (shape, handle, x, y) => {
    if (shape.type === 'line') {
      if (handle.x === shape.x1 && handle.y === shape.y1) {
        shape.x1 = x;
        shape.y1 = y;
      } else {
        shape.x2 = x;
        shape.y2 = y;
      }
    } else if (shape.type === 'circle') {
      const dx = x - shape.x1;
      const dy = y - shape.y1;
      const radius = Math.sqrt(dx * dx + dy * dy);
      shape.x2 = shape.x1 + radius;
      shape.y2 = shape.y1;
    } else if (shape.type === 'text') {
      if (handle.isCenter) {
        shape.x = x;
        shape.y = y;
      } else {
        const textMetrics = ctx.measureText(shape.text);
        shape.x = x - textMetrics.width;
        shape.y = y;
      }
    } else if (shape.type === 'image') {
      if (handle.isCenter) {
        const dx = x - (shape.x1 + shape.x2) / 2;
        const dy = y - (shape.y1 + shape.y2) / 2;
        moveShape(shape, dx, dy);
      } else {
        if (handle.x === shape.x1 && handle.y === shape.y1) {
          shape.x1 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2 && handle.y === shape.y1) {
          shape.x2 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2 && handle.y === shape.y2) {
          shape.x2 = x;
          shape.y2 = y;
        } else {
          shape.x1 = x;
          shape.y2 = y;
        }
      }
    } else {
      if (handle.isCenter) {
        const dx = x - (shape.x1 + shape.x2) / 2;
        const dy = y - (shape.y1 + shape.y2) / 2;
        moveShape(shape, dx, dy);
      } else {
        if (handle.x === shape.x1 && handle.y === shape.y1) {
          shape.x1 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2 && handle.y === shape.y1) {
          shape.x2 = x;
          shape.y1 = y;
        } else if (handle.x === shape.x2 && handle.y === shape.y2) {
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

  const moveShape = (shape, dx, dy) => {
    if (shape.type === 'line' || shape.type === 'circle') {
      shape.x1 += dx;
      shape.y1 += dy;
      shape.x2 += dx;
      shape.y2 += dy;
    } else if (shape.type === 'freehand') {
      shape.points.forEach(point => {
        point.x += dx;
        point.y += dy;
      });
    } else if (shape.type === 'text') {
      shape.x += dx;
      shape.y += dy;
    } else if (shape.type === 'image') {
      shape.x1 += dx;
      shape.y1 += dy;
      shape.x2 += dx;
      shape.y2 += dy;
    } else {
      shape.x1 += dx;
      shape.y1 += dy;
      shape.x2 += dx;
      shape.y2 += dy;
    }
  };

  const downloadCanvas = (tempCanvas) => {
    const link = downloadLinkRef.current;
    link.href = tempCanvas.toDataURL();
    link.download = 'whiteboard.png';
    link.click();
  };

  const saveCanvas = () => {
    const tempCanvas = tempCanvasRef.current;
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const notShapes = ['freehand', 'text', 'image', 'line'];

    if (useImageBackground) {
      const backgroundImage = new Image();
      backgroundImage.crossOrigin = 'anonymous';
      backgroundImage.onload = () => {
        tempCtx.drawImage(backgroundImage, 0, 0, tempCanvas.width, tempCanvas.height);
        shapes.forEach(shape => {
          !notShapes.includes(shape.type) ? drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, tempCtx) : drawShapeOnCanvas(shape, tempCtx);
        });
        downloadCanvas(tempCanvas);
      };
      backgroundImage.src = imageBackgroundUrl;
    } else {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      shapes.forEach(shape => {
        !notShapes.includes(shape.type) ? drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, tempCtx) : drawShapeOnCanvas(shape, tempCtx);
      });
      downloadCanvas(tempCanvas);
    }
  };

  const drawShapeOnCanvas = (shape, ctxx = ctx) => {
    ctxx.beginPath();
    ctxx.strokeStyle = shape.color;
    ctxx.lineWidth = shape.thickness || 2;
    ctxx.fillStyle = shape.color;
    ctxx.font = `${shape.fontSize}px ${shape.fontFamily}`;

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
        ctxx.moveTo(shape.x1, shape.y1);
        ctxx.lineTo(shape.x2, shape.y2);
        break;
      case 'freehand':
        try {
          ctxx.moveTo(shape.points[0].x, shape.points[0].y);
          shape.points.forEach(point => ctxx.lineTo(point.x, point.y));
        } catch (e) {
          //console.log(e);
        }
        break;
      case 'text':
        ctxx.fillText(shape.text, shape.x, shape.y);
        break;
      case 'image':
        ctxx.drawImage(shape.img, shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
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
    const toggleButton = toggleBackgroundRef.current;
    if (useImageBackground) {
      canvas.style.backgroundImage = `url('${imageBackgroundUrl}')`;
      toggleButton.classList.remove('active');
    } else {
      canvas.style.backgroundImage = 'none';
      canvas.style.backgroundColor = 'white';
      toggleButton.classList.add('active');
    }
    drawShapes();
    if (doEmits) {
      socket.emit('updateBoardAction', { action: 'toggleBackground', payload: useImageBackground }, handleServerResponse);
    }
  };

  const clearCanvas = (doEmits = true) => {
    if (islevel != 2 && doEmits) {
      showAlert({ message: 'You do not have permission to clear the board', type: 'danger' });
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

  const uploadImage = (e, doEmits = true) => {
    try {
      if (!checkBoardAccess()) return;
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        showAlert({ message: 'File size must be less than 1MB', type: 'danger' });
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          if (img.height > 600 && img.height > img.width && !file.type.includes('jpeg')) {
            showAlert({ message: 'For better performance, please upload the image in JPG format.', type: 'warning' });
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
            src: event.target.result,
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
          showAlert({ message: 'Error loading image', type: 'danger' });
        };
        img.src = event.target.result;
      };
      reader.onerror = function () {
        showAlert({ message: 'Error reading file', type: 'danger' });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      //console.log(error);
    }
  };

  const handleServerResponse = (response) => {
    if (!response.success) {
      showAlert({ message: `Whiteboard action failed: ${response.reason}`, type: 'danger' });
    }
  };

  socket && socket.on('whiteboardAction', (data) => {
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
        erase(payload.x, payload.y, payload.eraserThickness);
        break;
      case 'clear':
        clearCanvas(false);
        break;
      case 'uploadImage':
        const img = new Image();
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
        break;
      case 'toggleBackground':
        toggleBackground(false);
        drawShapes();
        break;
      case 'undo':
        if (shapes.length > 0) {
          redoStack.push(shapes.pop());
          updateRedoStack(redoStack);
          drawShapes();
        }
        break;
      case 'redo':
        if (redoStack.length > 0) {
          shapes.push(redoStack.pop());
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
        const oldShapes = shapes.filter(shape => shape.type === 'image');
        shapes = payload.shapes.map(shape => {
          if (shape.type === 'image') {
            const oldShape = oldShapes.find(oldShape => oldShape.src === shape.src);
            if (oldShape) {
              return { ...shape, img: oldShape.img };
            } else {
              const img = new Image();
              img.src = shape.src;
              return { ...shape, img };
            }
          } else {
            return shape;
          }
        });
        updateShapes(shapes);
        drawShapes();
        break;
      default:
        break;
    }
  });

  socket && socket.on('whiteboardUpdated', async (data) => {

    // data = { whiteboardUsers, status}
    // status = 'started', 'ended', 'updated'
    // whiteboardUsers array
    // members (participants) array only sent to the host
    //whiteboardData = {shapes=[], useImageBackground=Boolean, redoStack=[], undoStack=[]} or {} or null


    try {

      if (islevel == '2' && data.members) {
        //filter out the participant that isBanned == true 
        participantsAll = await data.members
        //remove every field other than isBanned and name from participantsAll
        participantsAll = await participantsAll.map(participant => ({ isBanned: participant.isBanned, name: participant.name }))


        participants = await data.members.filter(participant => participant.isBanned == false)
        updateParticipants(participants);
      }

      whiteboardUsers = data.whiteboardUsers;
      updateWhiteboardUsers(whiteboardUsers);

      //trigger click on panMode if the user is not part of the whiteboardUsers and not the host
      const useBoard = whiteboardUsers.find(user => user.name == member && user.useBoard) ? true : false;
      if (islevel != '2' && !useBoard && !whiteboardEnded) {
        changeMode('pan');
      }

      if (data.whiteboardData && Object.keys(data.whiteboardData).length > 0) {
        //update the whiteboard data
        if (data.whiteboardData.shapes) {
          const oldShapes = shapes.filter(shape => shape.type === 'image');
          shapes = data.whiteboardData.shapes.map(shape => {
            if (shape.type === 'image') {
              const oldShape = oldShapes.find(oldShape => oldShape.src === shape.src);
              if (oldShape) {
                return { ...shape, img: oldShape.img };
              } else {
                //we load the image and return the new shape object
                const img = new Image();
                img.src = shape.src;
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
        //starting the whiteboard
        whiteboardStarted = true;
        whiteboardEnded = false;
        screenId = `whiteboard-${roomName}`;

        updateWhiteboardStarted(true);
        updateWhiteboardEnded(false);
        updateScreenId(screenId);

        //simulate screen sharing started
        if (islevel != '2') {
          shareScreenStarted = true;
          updateShareScreenStarted(true);
          await onScreenChanges({ changed: true, parameters });
        }

      } else if (data.status == 'ended') {

        //ending the whiteboard
        const prevWhiteboardEnded = whiteboardEnded;
        whiteboardEnded = true;
        whiteboardStarted = false;
        updateWhiteboardStarted(false);
        updateWhiteboardEnded(true);
        if (islevel == '2' && prevWhiteboardEnded) {
        } else {
          //simulate screen sharing ended
          shareScreenStarted = false;
          screenId = null;

          updateShareScreenStarted(false);
          updateScreenId(null);
          await onScreenChanges({ changed: true, parameters });
        }

        try {
          if (whiteboardStarted && islevel == '2' && ((recordStarted || recordResumed))) {
            if (!(recordPaused || recordStopped)) {
              if (recordingMediaOptions == 'video') {
                await captureCanvasStream({parameters, start : false});
              }
            }
          }

        } catch (error) {
        }


      } else if (data.status == 'started' && whiteboardStarted) {
        //updating the whiteboard
        whiteboardStarted = true;
        whiteboardEnded = false;

        updateWhiteboardStarted(true);
        updateWhiteboardEnded(false);

        //simulate screen sharing started
        shareScreenStarted = true;
        screenId = `whiteboard-${roomName}`;

        updateShareScreenStarted(true);
        updateScreenId(screenId);
        await onScreenChanges({ changed: true, parameters });

      }
    } catch (error) {

    }
  });

  const handleDropdownClick = (id) => {
    dropdownOpen.current = dropdownOpen.current === id ? null : id;
  };

  const handleItemClick = (callback, name, value) => {
    callback(value);
    dropdownOpen.current = null;
    if (['draw', 'freehand', 'shape', 'text', 'erase'].includes(name)) {
      changeMode(name);
    }
  };

  const dropdownItems = (items, name, callback) => (
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
    <div id="whiteboard-interface" style={{ position: 'relative', display: showAspect ? 'block' : 'none', justifyContent: 'center', alignItems: 'center', border: '2px solid #000', backgroundColor: '#f0f0f0', width: customWidth, height: customHeight }}>
      <div id="whiteboardContent" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'auto' }}>
        <button id="toolbarToggle" className="btn btnBoard btn-primary" style={{ position: 'absolute', top: '5px', left: '55px', zIndex: 1000 }} onClick={toggleToolbar}>
          <FontAwesomeIcon icon={toolbarVisible.current ? faChevronLeft : faChevronRight} />
        </button>
        {toolbarVisible.current && (
          <div className="toolbar mb-3" id="toolbar" style={{ position: 'absolute', top: '5px', left: '100px', zIndex: 1000, backgroundColor: 'transparent' }}>
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
            <button className="btn btnBoard btn-danger" id="delete" onClick={deleteShape}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="btn btnBoard btn-secondary" id="clearCanvas" onClick={clearCanvas}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button id="toggleBackground" ref={toggleBackgroundRef} className="btn btnBoard btn-secondary" onClick={toggleBackground}>
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
