import { shapeType, imgd, imgM, xy } from './Interface';

const lastImage: string[] = [];
const anotherImage: string[] = [];

const ellipse = function (
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean,
): void {
  const r = radiusX > radiusY ? radiusX : radiusY; //用打的数为半径
  const scaleX = radiusX / r; //计算缩放的x轴比例
  const scaleY = radiusY / r; //计算缩放的y轴比例
  canvasCtx.save(); //保存副本
  canvasCtx.translate(x, y); //移动到圆心位置
  canvasCtx.rotate(rotation); //进行旋转
  canvasCtx.scale(scaleX, scaleY); //进行缩放
  canvasCtx.arc(0, 0, r, startAngle, endAngle, anticlockwise); //绘制圆形
  canvasCtx.restore(); //还原副本
};

const ellipsefill = function (
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean,
): void {
  const r = radiusX > radiusY ? radiusX : radiusY; //用打的数为半径
  const scaleX = radiusX / r; //计算缩放的x轴比例
  const scaleY = radiusY / r; //计算缩放的y轴比例
  canvasCtx.save(); //保存副本
  canvasCtx.translate(x, y); //移动到圆心位置
  canvasCtx.rotate(rotation); //进行旋转
  canvasCtx.scale(scaleX, scaleY); //进行缩放
  canvasCtx.arc(0, 0, r, startAngle, endAngle, anticlockwise); //绘制圆形
  canvasCtx.fill();
  canvasCtx.restore(); //还原副本
};

//图片保存函数
const saveImagMapping = function (imageData: ImageData, { width, height }: shapeType): string {
  const pxList: imgd[][] = transToRowCol(transToRGBA(imageData.data), width);
  const boundary: imgM = getBoundary(width, height, pxList);
  const px: number[] = transToPlain(pxList.slice(boundary.y1, boundary.y2 + 1), boundary.x1, boundary.x2 + 1);
  const canvasTemporarily: HTMLCanvasElement = document.createElement('canvas');
  const canvasTemporarilyCtx: CanvasRenderingContext2D | null = canvasTemporarily.getContext('2d');

  canvasTemporarily.width = boundary.x2 - boundary.x1 + 1;
  canvasTemporarily.height = boundary.y2 - boundary.y1 + 1;

  const imagedata = (canvasTemporarilyCtx as CanvasRenderingContext2D).getImageData(
    0,
    0,
    boundary.x2 - boundary.x1 + 1,
    boundary.y2 - boundary.y1 + 1,
  );

  for (let i = 0; i < imagedata.data.length; i++) {
    imagedata.data[i] = px[i];
  }

  // eslint-disable-next-line prettier/prettier
  (canvasTemporarilyCtx as CanvasRenderingContext2D).putImageData(imagedata, 0, 0)

  function transToRGBA(data: Uint8ClampedArray): imgd[] {
    const pxlength: number = data.length;
    const pxlist: imgd[] = [];

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

  function transToRowCol(pxlist: imgd[], width: number): imgd[][] {
    const pxlength: number = pxlist.length;
    const pxRowList: imgd[][] = [];

    for (let i = 0; i < pxlength; i += width) {
      pxRowList.push(pxlist.slice(i, i + width));
    }

    return pxRowList;
  }

  function getBoundary(width: number, height: number, pxList: imgd[][]): imgM {
    let x1 = width;
    let x2 = 0;
    let y1 = height;
    let y2 = 0;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (pxList[j][i].alpha) {
          x1 = Math.min(i, x1);
          x2 = Math.max(i, x2);
          y1 = Math.min(j, y1);
          y2 = Math.max(j, y2);
        }
      }
    }
    return { x1, x2, y1, y2 };
  }

  function transToPlain(rowlist: imgd[][], start: number, end: number): number[] {
    const pxList: number[] = [];

    rowlist.forEach(function (colist) {
      colist.slice(start, end).forEach(function (pxData) {
        pxList.push(pxData.red);
        pxList.push(pxData.green);
        pxList.push(pxData.blue);
        pxList.push(pxData.alpha);
      });
    });

    return pxList;
  }
  return canvasTemporarily.toDataURL('png', 1);
};

const updownImage = function (dataURL: string, type: string): Promise<HTMLImageElement> {
  return new Promise((reslove, reject) => {
    const img: HTMLImageElement = new Image();
    if (type === 'last' && lastImage.length > 0) {
      const forward = lastImage.pop();
      anotherImage.push(dataURL);
      img.src = forward as string;
      img.onload = () => {
        reslove(img);
      };
    } else if (type === 'another' && anotherImage.length > 0) {
      const another = anotherImage.pop();
      lastImage.push(dataURL);
      img.src = another as string;
      img.onload = () => {
        reslove(img);
      };
    } else {
      reject(false);
    }
  });
};

const extractPixels = function (imageData: ImageData): string {
  return `RGB(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]})`;
};
// 计算灰度值
function rgbToGray(r: number, g: number, b: number): number {
  return r * 0.299 + g * 0.587 + b * 0.114;
}
//油漆桶
const paintBucket = function (ImageDate: ImageData, x: number, y: number, color: string, intensity: number): void {
  const { width, height, data } = ImageDate;
  const colorMatch: RegExpMatchArray | null = color.substring(1).match(/[a-fA-F\d]{2}/g);
  if (!colorMatch) return;
  const R1: number = Number.parseInt(colorMatch[0], 16);
  const G1: number = Number.parseInt(colorMatch[1], 16);
  const B1: number = Number.parseInt(colorMatch[2], 16);
  x = Math.floor(x);
  y = Math.floor(y);
  let index: number = (y * width + x) * 4; //data数组排列为从左到右，从上到下，每一个像素点占三个空间，分别为RGB属性
  const grayColor: number = rgbToGray(data[index], data[index + 1], data[index + 2]);
  const vis: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => 0)); // 访问标记
  const move_dir: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // 广搜方向
  const queue: xy[] = [{ x, y }];
  vis[y][x] = 1;
  //广搜搜索附近相识颜色
  while (queue.length > 0) {
    const pos = queue.shift();
    if (!pos) break;
    index = (pos.y * width + pos.x) * 4;
    data[index] = R1;
    data[index + 1] = G1;
    data[index + 2] = B1;
    for (const i of move_dir) {
      const x1 = pos.x + i[0];
      const y1 = pos.y + i[1];
      index = (y1 * width + x1) * 4;
      const colorto = rgbToGray(data[index], data[index + 1], data[index + 2]);
      //通过灰度值判断
      if (
        x1 >= 0 &&
        y1 >= 0 &&
        x1 < width &&
        y1 < height &&
        !vis[y1][x1] &&
        colorto - intensity <= grayColor &&
        colorto + intensity >= grayColor
      ) {
        vis[y1][x1] = 1;
        queue.push({ x: x1, y: y1 });
      }
    }
  }
};

export { ellipse, ellipsefill, updownImage, saveImagMapping, extractPixels, paintBucket };
