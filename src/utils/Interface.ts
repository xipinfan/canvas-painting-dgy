//props的接口定义
import { linespotChange, shapespotChange } from '../utils/canvas-cursor';
interface imgRe {
  width: number;
  height: number;
  dWidth: number;
  dHeight: number;
}

interface shapeType {
  width: number;
  height: number;
}

interface props {
  imgFunc: (imgRe: imgRe) => void;
}

interface imgd {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface imgM {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface xy {
  x: number;
  y: number;
}

interface drawType {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface trianglePlot {
  begin: xy;
  mid: xy;
  end: xy;
}

interface diff {
  difference: number;
  negative: number;
}

type Type = 'pencil' | 'eraser' | 'line' | 'round' | 'rectangle' | 'rightTriangle' | 'isosceles' | 'diamond';
type typeD = 'pencilDowm' | 'pencilDowm' | 'eraserMove' | 'eraserDowm';

type typeBsCanvas =
  | 'setCssText'
  | 'setClassName'
  | 'saveImag'
  | 'initBoard'
  | 'eliminate'
  | 'drawImage'
  | 'drawLine'
  | 'drawDemoLine'
  | 'lineBox'
  | 'solidBox'
  | 'dottedBox'
  | 'Triangle'
  | 'drawDiamond'
  | 'text'
  | 'paintB'
  | 'getImageData'
  | 'solidRound';

type typeMouse = {
  pencilDowm: (e: MouseEvent) => void;
  pencilMove: (e: MouseEvent) => void;
  eraserMove: (e: MouseEvent) => void;
  eraserDowm: (e: MouseEvent) => void;
};

type typeOpD =
  | 'lineMove'
  | 'lineDraw'
  | 'rectangleMove'
  | 'rectangleDraw'
  | 'rightTriangleMove'
  | 'rightTriangleDraw'
  | 'isoscelesMove'
  | 'isoscelesDraw'
  | 'diamondMove'
  | 'diamondDraw';

type typeOpMouse = {
  e: xy;
  mobile: xy;
  spotNode: string;
  linespotChange: typeof linespotChange;
  shapespotChange: typeof shapespotChange;
  lineMove: () => void;
  move: () => void;
  lineDraw: () => void;
  rectangleMove: () => void;
  //rectangleBaseMove: () => void;
  rectangleDraw: () => void;
  roundMove: () => void;
  roundDraw: () => void;
  rightTriangleMove: () => void;
  rightTriangleDraw: () => void;
  isoscelesMove: () => void;
  isoscelesDraw: () => void;
  diamondMove: () => void;
  diamondDraw: () => void;
};

type typeShare = 'linespotChange' | 'shapespotChange';

export {
  shapeType,
  props,
  imgd,
  imgM,
  xy,
  drawType,
  trianglePlot,
  diff,
  typeD,
  typeMouse,
  Type,
  typeOpD,
  typeOpMouse,
  typeBsCanvas,
  typeShare,
};
