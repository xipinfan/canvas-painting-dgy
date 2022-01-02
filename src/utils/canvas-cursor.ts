import { lineDistance, pointToLine } from './basics-tool';
import { xy } from './Interface';

const spotLineDistance = function (beginline: xy, endline: xy, node: xy): string {
  //直线由鼠标位置修改鼠标样式
  if (lineDistance(beginline, node) <= 8) {
    //判断点是否在初始点附近
    return 'begin';
  } else if (lineDistance(endline, node) <= 8) {
    //判断点是否在结束点附近
    return 'end';
  } else {
    const long = pointToLine(beginline, endline, node);
    if (node.x <= Math.max(beginline.x, endline.x) + 8 && node.x >= Math.min(beginline.x, endline.x - 8)) {
      //判断x坐标是否在线段内
      if (node.y <= Math.max(beginline.y, endline.y) + 8 && node.y >= Math.min(beginline.y, endline.y - 8)) {
        //判断y坐标是否在线段内
        if (long < 8) {
          //判断点到线距离
          return 'core';
        }
      }
    }
    return 'default';
  }
};

const mousePointLine = function (
  { x, y }: xy,
  beginLine: xy,
  endLine: xy,
  changeCursor: (cursor: string) => void,
): void {
  //直线鼠标指针所在地判断
  const node = spotLineDistance(beginLine, endLine, { x, y });
  switch (node) {
    //线附近
    case 'core': {
      changeCursor('move');
      break;
    }
    //初始点附近
    case 'begin': {
      changeCursor('n-resize');
      break;
    }
    //结束点附近
    case 'end': {
      changeCursor('n-resize');
      break;
    }
    default: {
      changeCursor('default');
    }
  }
};

const boundary = function (changeCursor: (cursor: string) => void, { x, y }: xy, firstplot: xy, endplot: xy): string {
  //其他的所在地判断，随便修改鼠标样式
  const node = { x, y };
  const minx = Math.min(firstplot.x, endplot.x),
    miny = Math.min(firstplot.y, endplot.y),
    maxx = Math.max(firstplot.x, endplot.x),
    maxy = Math.max(firstplot.y, endplot.y);
  if (x >= minx - 8 && x <= maxx + 8 && y + 8 >= miny && y <= maxy + 8) {
    //是否在范围内
    if (lineDistance(node, { x: minx, y: miny }) <= 8) {
      //到四点距离
      changeCursor('nw-resize');
      return 'topleft';
    } else if (lineDistance(node, { x: maxx, y: maxy }) <= 8) {
      changeCursor('se-resize');
      return 'lowerright';
    } else if (lineDistance(node, { x: minx, y: maxy }) <= 8) {
      changeCursor('sw-resize');
      return 'lowerleft';
    } else if (lineDistance(node, { x: maxx, y: miny }) <= 8) {
      changeCursor('ne-resize');
      return 'topright';
    }

    if (lineDistance(node, firstplot) <= 8) {
      //到四点距离
      //canvas.style.cursor = 'nw-resize';
      return 'topleft';
    } else if (lineDistance(node, endplot) <= 8) {
      //canvas.style.cursor = 'se-resize';
      return 'lowerright';
    } else if (lineDistance(node, { x: firstplot.x, y: endplot.y }) <= 8) {
      //canvas.style.cursor = 'sw-resize';
      return 'lowerleft';
    } else if (lineDistance(node, { x: endplot.x, y: firstplot.y }) <= 8) {
      //canvas.style.cursor = 'ne-resize';
      return 'topright';
    } else if (pointToLine(firstplot, { x: firstplot.x, y: endplot.y }, node) <= 8) {
      //到四边距离
      changeCursor('w-resize');
      return 'left';
    } else if (pointToLine(firstplot, { x: endplot.x, y: firstplot.y }, node) <= 8) {
      changeCursor('n-resize');
      return 'top';
    } else if (pointToLine(endplot, { x: endplot.x, y: firstplot.y }, node) <= 8) {
      changeCursor('w-resize');
      return 'right';
    } else if (pointToLine(endplot, { x: firstplot.x, y: endplot.y }, node) <= 8) {
      changeCursor('n-resize');
      return 'lower';
    } else {
      changeCursor('move');
      return 'core';
    }
  } else {
    changeCursor('default');
    return 'default';
  }
};

export { spotLineDistance, mousePointLine, boundary };
