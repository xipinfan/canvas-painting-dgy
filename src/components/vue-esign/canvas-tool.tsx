interface canvasT {
  reset: Function;
  drawArc: Function;
  generate: Function;
}

interface props {
  width: number;
  height: number;
  lineWidth: number;
  lineColor: string;
  bgColor: string;
  isCrop: boolean;
}

interface color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface xy {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Disposition {
  width: number;
  height: number;
  backgroundColor: string;
  initBgColor: Array<number>;
}

// 图像裁切函数
function saveImagMapping(
  esignCanvasCtx: CanvasRenderingContext2D,
  { width, height, backgroundColor, initBgColor }: Disposition,
): string {
  const imageData: ImageData = esignCanvasCtx.getImageData(0, 0, width, height);
  const pxList: Array<Array<color>> = transToRowCol(transToRGBA(imageData.data), width);
  const boundary: xy = getBoundary(width, height, pxList);
  const px: Array<number> = transToPlain(pxList.slice(boundary.y1, boundary.y2 + 1), boundary.x1, boundary.x2 + 1);
  const canvasTemporarily: HTMLCanvasElement = document.createElement('canvas');
  const canvasTemporarilyCtx: CanvasRenderingContext2D | null = canvasTemporarily.getContext('2d');

  canvasTemporarily.width = boundary.x2 - boundary.x1 + 1;
  canvasTemporarily.height = boundary.y2 - boundary.y1 + 1;

  const imagedata: ImageData = (canvasTemporarilyCtx as CanvasRenderingContext2D).getImageData(
    0,
    0,
    boundary.x2 - boundary.x1 + 1,
    boundary.y2 - boundary.y1 + 1,
  );

  for (let i = 0; i < imagedata.data.length; i++) {
    imagedata.data[i] = px[i];
  }
  (canvasTemporarilyCtx as CanvasRenderingContext2D).putImageData(imagedata, 0, 0);

  // 将图像数据以像素为单位进行分组
  function transToRGBA(data: Uint8ClampedArray): Array<color> {
    const pxlist: Array<color> = [];
    const pxlength: number = data.length;
    for (let i = 0; i < pxlength; i += 4) {
      pxlist.push({
        red: data[i],
        green: data[i + 1],
        blue: data[i + 2],
        alpha: data[i + 3],
      });
    }
    return pxlist;
  }

  // 将分组后的一维图像数据转化为二维数组与图像逻辑相同
  function transToRowCol(pxlist: Array<color>, width: number): Array<Array<color>> {
    const pxlength: number = pxlist.length;
    const pxRowList: Array<Array<color>> = [];
    for (let i = 0; i < pxlength; i += width) {
      pxRowList.push(pxlist.slice(i, i + width));
    }

    return pxRowList;
  }

  // 判断当前点是否为绘制点
  function bgJudgment(i: number, j: number, xyT: xy): void {
    if (!backgroundColor) {
      if (pxList[j][i].alpha) {
        xyT.x1 = Math.min(i, xyT.x1);
        xyT.x2 = Math.max(i, xyT.x2);
        xyT.y1 = Math.min(j, xyT.y1);
        xyT.y2 = Math.max(j, xyT.y2);
      }
    } else {
      if (
        pxList[j][i].red !== initBgColor[0] ||
        pxList[j][i].green !== initBgColor[1] ||
        pxList[j][i].blue !== initBgColor[2]
      ) {
        xyT.x1 = Math.min(i, xyT.x1);
        xyT.x2 = Math.max(i, xyT.x2);
        xyT.y1 = Math.min(j, xyT.y1);
        xyT.y2 = Math.max(j, xyT.y2);
      }
    }
  }
  // 计算绘制后的图像数据
  function getBoundary(width: number, height: number, pxList: Array<Array<color>>): xy {
    const xyT: xy = {
      x1: width - 1,
      x2: 0,
      y1: height - 1,
      y2: 0,
    };
    console.log(width, height, pxList);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        bgJudgment(i, j, xyT);
      }
    }
    return xyT;
  }
  // 将二维图像数据还原
  function transToPlain(rowlist: Array<Array<color>>, start: number, end: number): Array<number> {
    const pxList: Array<number> = [];

    rowlist.forEach((colist: Array<color>): void => {
      colist.slice(start, end).forEach((pxData: color): void => {
        pxList.push(pxData.red);
        pxList.push(pxData.green);
        pxList.push(pxData.blue);
        pxList.push(pxData.alpha);
      });
    });

    return pxList;
  }

  return canvasTemporarily.toDataURL();
}

// canvas工具函数
export default function canvasTool(canvas: HTMLCanvasElement, props: props): canvasT {
  const esignCanvasCtx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
  const initBgColor: Array<number> = [];

  canvas.width = props.width;
  canvas.height = props.height;
  esignCanvasCtx.fillStyle = props.lineColor;
  esignCanvasCtx.strokeStyle = props.lineColor;

  const reset = function (): void {
    if (!props.bgColor) {
      esignCanvasCtx.clearRect(0, 0, props.width, props.height);
    } else {
      esignCanvasCtx.save();
      esignCanvasCtx.fillStyle = props.bgColor;
      esignCanvasCtx.fillRect(0, 0, props.width, props.height);
      esignCanvasCtx.restore();
    }
    // 保存当前画板背景
    esignCanvasCtx.getImageData(0, 0, 1, 1).data.forEach((element: number): void => {
      initBgColor.push(element);
    });
  };

  const drawArc = function (x: number, y: number): void {
    esignCanvasCtx.beginPath();
    esignCanvasCtx.arc(x, y, props.lineWidth / 2, 0, Math.PI * 2, false);
    esignCanvasCtx.fill();
  };

  const generate = function (use: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      // 判断当前是否有进行绘制
      if (!use) {
        reject(new Error('Not Signned'));
      }
      if (!props.isCrop) {
        resolve(canvas.toDataURL());
      } else {
        resolve(
          saveImagMapping(esignCanvasCtx, {
            width: props.width,
            height: props.height,
            backgroundColor: props.bgColor,
            initBgColor,
          }),
        );
      }
    });
  };

  reset();

  return {
    // 清除画布
    reset,
    // 绘制圆
    drawArc,
    // 保存图片
    generate,
  };
}
