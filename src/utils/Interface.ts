//props的接口定义
interface canvasDProps {
  width: number;
  height: number;
  tool: Type;
  bgColor: string;
  penSize: number;
  strokeColor: string;
  eraserSize: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
}

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

type Type = 'pencil' | 'eraser' | 'line';
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
  | 'getImageData';

type typeMouse = {
  pencilDowm: (e: MouseEvent) => void;
  pencilMove: (e: MouseEvent) => void;
  eraserMove: (e: MouseEvent) => void;
  eraserDowm: (e: MouseEvent) => void;
};
type typeOpD = 'lineDowm';
type typeOpMouse = {
  lineDowm: (e: MouseEvent) => void;
};

export {
  canvasDProps,
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
};
