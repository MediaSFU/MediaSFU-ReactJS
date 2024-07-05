import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight, faChevronLeft, faPencilAlt, faPaintBrush, faShapes, faEraser, faSearch,
  faSearchPlus, faSearchMinus, faFont, faTextHeight, faUndo, faRedo, faSave, faTrash, faTimes, faMousePointer
} from '@fortawesome/free-solid-svg-icons';
import './Screenboard.css';

const Screenboard = ({ customWidth, customHeight, parameters, showAspect }) => {
  let { canvasScreenboard, updateCanvasScreenboard, annotateScreenStream,isScreenboardModalVisible, updateIsScreenboardModalVisible,sleep, updateAnnotateScreenStream } = parameters;

  const mode = useRef('draw');
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const freehandDrawing = useRef([]);
  const shapes = useRef([]);
  const eraserThickness = useRef(10);
  const brushThickness = useRef(6);
  const lineThickness = useRef(6);
  const lineType = useRef('solid');
  const color = useRef('#000000');
  const font = useRef('Arial');
  const fontSize = useRef(20);
  const shape = useRef(null);
  const toolbarVisible = useRef(false);
  const dropdownOpen = useRef(null);
  const canvasRef = useRef(null);
  const screenboardRef = useRef(null);
  const screenboardContentRef = useRef(null);
 
  let canvas = canvasRef.current;
  let ctx = canvas ? canvas.getContext('2d') : null;

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
      canvasScreenboard = canvas;

      updateCanvasScreenboard(canvas);
    }

    const handleMouseDown = (e) => startDrawing(e, ctx);
    const handleMouseMove = (e) => draw(e, ctx);
    const handleMouseUp = () => stopDrawing(ctx);

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);

    //touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseUp);

      //touch events
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shapes.current]);

  const handleClickOutside = (event) => {
    if (dropdownOpen.current && !event.target.closest('.btn-group')) {
      dropdownOpen.current = null;
    }
  };

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

  const handleDropdownClick = (id) => {
    dropdownOpen.current = dropdownOpen.current === id ? null : id;
  };

  const handleItemClick = (callback, name, value) => {
    callback(value);
    dropdownOpen.current = null;
    if (['draw', 'freehand', 'shape', 'erase'].includes(name)) {
      mode.current = name;
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

  const startDrawing = (e, ctx) => {
    isDrawing.current = true;
    startX.current = e.offsetX;
    startY.current = e.offsetY;

    if (mode.current === 'erase') {
      erase(e.offsetX, e.offsetY, ctx);
    } else if (mode.current === 'draw' || mode.current === 'freehand') {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      if (mode.current === 'freehand') {
        freehandDrawing.current = [{ x: e.offsetX, y: e.offsetY }];
      }
    }
  };

  const draw = (e, ctx) => {
    if (!isDrawing.current) return;

    currentX.current = e.offsetX;
    currentY.current = e.offsetY;

    if (mode.current === 'erase') {
      erase(e.offsetX, e.offsetY, ctx);
    } else if (mode.current === 'draw') {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawShapes(ctx);
      drawLine(startX.current, startY.current, e.offsetX, e.offsetY, color.current, lineThickness.current, lineType.current, ctx);
    } else if (mode.current === 'freehand') {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = color.current;
      ctx.lineWidth = brushThickness.current;
      ctx.stroke();
      freehandDrawing.current.push({ x: e.offsetX, y: e.offsetY, color: color.current, thickness: brushThickness.current });
    } else if (mode.current === 'shape') {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawShapes(ctx);
      drawShape(shape.current, startX.current, startY.current, e.offsetX, e.offsetY, color.current, lineThickness.current, lineType.current, ctx);
    }
  };

  const stopDrawing = (ctx) => {
    try {
      isDrawing.current = false;

      if (mode.current === 'draw') {
        shapes.current.push({ type: 'line', x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current });
      } else if (mode.current === 'freehand') {
        shapes.current.push({ type: 'freehand', points: freehandDrawing.current, color: color.current, thickness: brushThickness.current });
        freehandDrawing.current = [];
      } else if (mode.current === 'shape') {
        shapes.current.push({ type: shape.current, x1: startX.current, y1: startY.current, x2: currentX.current, y2: currentY.current, color: color.current, thickness: lineThickness.current, lineType: lineType.current });
      }
  
      setTimeout(() => removeShape(ctx), 15000);
    } catch (error) {
      
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

  const removeShape = (ctx) => {
    try {
      shapes.current.shift();
      drawShapes(ctx)
    } catch (error) {
      
    };
  };


  const erase = (x, y, ctx) => {
    try {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, eraserThickness.current / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
  
      shapes.current = shapes.current.map(shape => {
        if (shape.type === 'freehand') {
          return {
            ...shape,
            points: shape.points.filter(point => {
              const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
              return distance > eraserThickness.current / 2;
            })
          };
        } else if (shape.type === 'line') {
          if (isPointNearLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2, eraserThickness.current / 2)) {
            return null;
          }
        } else if (shape.type === 'text') {
          const textWidth = ctx.measureText(shape.text).width;
          if (x > shape.x && x < shape.x + textWidth && y > shape.y - shape.fontSize && y < shape.y) {
            return null;
          }
        } else {
          if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
            return null;
          }
        }
        return shape;
      }).filter(shape => shape && (shape.type !== 'freehand' || shape.points.length > 0));
    } catch (error) {
      
    }
 
  };

  const drawShapes = (ctx) => {

    try {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas before drawing
      shapes.current.forEach(shape => {
        if (shape.type === 'line') {
          drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, ctx);
        } else if (shape.type === 'freehand') {
          drawFreehand(shape.points, shape.color, shape.thickness, ctx);
        } else {
          drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, ctx);
        }
      });
    } catch (error) {
      
    }

  };

  const drawLine = (x1, y1, x2, y2, color, thickness, lineType, ctx) => {
    try {
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
    } catch (error) {
      
    }
   
  };

  const drawFreehand = (points, color, thickness, ctx) => {
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

  const drawShape = (type, x1, y1, x2, y2, color, thickness, lineType, ctx) => {
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
    if (type === 'rectangle') {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (type === 'circle') {
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (type === 'rhombus') {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const halfWidth = Math.abs(x2 - x1) / 2;
      const halfHeight = Math.abs(y2 - y1) / 2;
      ctx.moveTo(centerX, y1);
      ctx.lineTo(x2, centerY);
      ctx.lineTo(centerX, y2);
      ctx.lineTo(x1, centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (type === 'pentagon') {
      drawPolygon(ctx, 5, x1, y1, x2, y2);
    } else if (type === 'hexagon') {
      drawPolygon(ctx, 6, x1, y1, x2, y2);
    } else if (type === 'triangle') {
      const centerXTriangle = (x1 + x2) / 2;
      ctx.moveTo(centerXTriangle, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x1, y2);
      ctx.closePath();
      ctx.stroke();
    } else if (type === 'square') {
      ctx.strokeRect(x1, y1, x2 - x1, x2 - x1);
    } else if (type === 'octagon') {
      drawPolygon(ctx, 8, x1, y1, x2, y2);
    } else if (type === 'oval') {
      const radiusX = Math.abs(x2 - x1) / 2;
      const radiusY = Math.abs(y2 - y1) / 2;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (type === 'parallelogram') {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.moveTo(centerX, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(centerX, y2);
      ctx.lineTo(x1, y1);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.setLineDash([]);
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

  const toggleToolbar = () => {
    toolbarVisible.current = !toolbarVisible.current;
  };

  const toggleAnnotate = async () => {
    annotateScreenStream = !annotateScreenStream;
    updateAnnotateScreenStream(annotateScreenStream);
    if (annotateScreenStream) {
      toolbarVisible.current = true;
    } else {
      toolbarVisible.current = false;
    }

    await updateIsScreenboardModalVisible(true);
    await sleep(500);
    await updateIsScreenboardModalVisible(false);
  }

  return (
    <div id="screenboard-interface" style={{ position: 'relative', display: showAspect ? 'block' : 'none', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 1000, width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'auto' }} ref={screenboardRef}>
      <div id="screenboardContent" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden', top: 0, left: 0}} ref={screenboardContentRef}>


        <button id="annotateScreen" className="btn btn-primary btnBoardScreen annotateScreenBtn" style={{ position: 'absolute', top: '5px', right: '10px', zIndex: 1000 }} onClick={toggleAnnotate}>
          <FontAwesomeIcon icon={faPencilAlt} color={annotateScreenStream ? 'red' : 'grenn'} />
        </button>

        {annotateScreenStream &&
          <button id="toolbarToggleScreen" className="btn btnBoardScreen btn-primary" style={{ position: 'absolute', top: '5px', right: '55px', zIndex: 1000 }} onClick={toggleToolbar}>
            <FontAwesomeIcon icon={toolbarVisible.current ? faChevronRight : faChevronLeft} />
          </button>
        }

        <div className="toolbarScreen mb-3" id="toolbarScreen" style={{ position: 'absolute', top: '5px', right: '105px', zIndex: 1000, backgroundColor: 'transparent', display: toolbarVisible.current ? 'block' : 'none' }}>
          <div className="btn-group" role="group">
            <button className="btn btnBoardScreen btn-secondary dropdown-toggle" id="drawModeScreen" onClick={() => handleDropdownClick('drawModeScreen')}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            {dropdownOpen.current === 'drawModeScreen' && dropdownItems([{ label: 'XX-Small (3px)', value: 3 }, { label: 'X-Small (6px)', value: 6 }, { label: 'Small (12px)', value: 12 }, { label: 'Medium (18px)', value: 18 }, { label: 'Large (24px)', value: 24 }, { label: 'X-Large (36px)', value: 36 }], 'draw', (value) => (lineThickness.current = value))}
          </div>
          <div className="btn-group" role="group">
            <button className="btn btnBoardScreen btn-dark dropdown-toggle" id="freehandModeScreen" onClick={() => handleDropdownClick('freehandModeScreen')}>
              <FontAwesomeIcon icon={faPaintBrush} />
            </button>
            {dropdownOpen.current === 'freehandModeScreen' && dropdownItems([{ label: 'X-Small (5px)', value: 5 }, { label: 'Small (10px)', value: 10 }, { label: 'Medium (20px)', value: 20 }, { label: 'Large (40px)', value: 40 }, { label: 'X-Large (60px)', value: 60 }], 'freehand', (value) => (brushThickness.current = value))}
          </div>
          <div className="btn-group" role="group">
            <button className="btn btnBoardScreen btn-dark dropdown-toggle" id="shapeModeScreen" onClick={() => handleDropdownClick('shapeModeScreen')}>
              <FontAwesomeIcon icon={faShapes} />
            </button>
            {dropdownOpen.current === 'shapeModeScreen' && dropdownItems([
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
            ], 'shape', (value) => (shape.current = value))}
          </div>
          <div className="btn-group" role="group">
            <button className="btn btnBoardScreen btn-danger dropdown-toggle" id="eraseModeScreen" onClick={() => handleDropdownClick('eraseModeScreen')}>
              <FontAwesomeIcon icon={faEraser} />
            </button>
            {dropdownOpen.current === 'eraseModeScreen' && dropdownItems([{ label: 'X-Small (5px)', value: 5 }, { label: 'Small (10px)', value: 10 }, { label: 'Medium (20px)', value: 20 }, { label: 'Large (30px)', value: 30 }, { label: 'X-Large (60px)', value: 60 }], 'erase', (value) => (eraserThickness.current = value))}
          </div>
          <button className="btn btnBoard btn-success" id="zoomResetScreen" style={{ display: 'none' }}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <label htmlFor="colorPickerScreen"></label>
          <input type="color" className="btn" id="colorPickerScreen" value={color.current} onChange={(e) => (color.current = e.target.value)} />
          <label htmlFor="lineTypePickerScreen"></label>
          <select id="lineTypePickerScreen" className="custom-select" style={{ width: 'auto' }} onChange={(e) => (lineType.current = e.target.value)}>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="dashDot">Dash-Dot</option>
          </select>
        </div>


        <canvas id="screenboardCanvas" width="1280" height="720" style={{ padding: 0, margin: 0, display: annotateScreenStream ? 'block' : 'none'}} ref={canvasRef}></canvas>

      </div>
    </div>
  );
};

export default Screenboard;
