//props的接口定义
interface canvasDProps {
  width: number;
  height: number;
  tool: string;
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

interface layer {
  layerY: number;
  layerX: number;
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

export { canvasDProps, shapeType, props, imgd, imgM, xy, layer, drawType, trianglePlot };
