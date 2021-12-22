import { defineComponent,ref,onMounted } from 'vue'
import { layer, imgM, drawType, xy, trianglePlot } from '../utils/Interface';

//基础canvas的定义
export default defineComponent({
  name:'canvas-basice',
  inheritAttrs:false,
  emits:['click','mousedown','mouseup','mouseleave','mousemove'],
  props: {
    width:{
      type:Number,
      default:400
    },
    height:{
      type:Number,
      default:400
    },
    position:{
      type:String,
      default:'absolute'
    },
    zIndex:{
      type:Number,
      default:0
    }
  },
  components: {},
  setup(props, { expose,emit }) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

    onMounted(():void=>{
      if(!canvas.value)return;
      setCssText(`position:${props.position};z-index:${props.zIndex};`);
      canvasCtx.value = canvas.value.getContext('2d');
    })
    // 快速设定css
    const setCssText = function(text:string):void{
      if(!canvas.value)return;
      canvas.value.style.cssText = text;
    }
    // 修改类名
    const setClassName = function(name:string):void{
      if(!canvas.value)return;
      canvas.value.className = name;
    }
    // 保存图片函数
    const saveImag = function(name:string, cut: boolean):Promise<boolean> {
      return new Promise((resolve, reject)=>{
        if(!canvas.value){
          reject(false);
        }
        else{
          const imgdata = canvas.value.toDataURL('png', 1).replace('image/png',  'image/octet-stream');
          const link = document.createElement('a');
          link.href = imgdata;
          link.download =  name + '.png';
          link.click();
          resolve(true)
        }
      })
    }
		const fillRect = function( beginX: number, beginY: number, endX: number, endY: number, color: string ): void {
			if(!canvasCtx.value)return;
			canvasCtx.value.save();
			canvasCtx.value.fillStyle = color;
			canvasCtx.value.fillRect( beginX, beginY, endX, endY );
			canvasCtx.value.restore();
		}
    // 重置画布
    const initBoard = function (color: string): void {
			if(!canvasCtx.value)return;
      canvasCtx.value.clearRect(0,0,props.width,props.height);
      if(color){
        fillRect ( 0, 0, props.width, props.height, color );
      }
    }
		// 橡皮擦
		const eliminate = function ( color: string, layers:layer, eraserSize: number ): void {
			if (!canvasCtx.value) return;
			if (!color) {
				canvasCtx.value.clearRect( layers.layerX, layers.layerY, eraserSize, eraserSize )
			} else {
				fillRect ( layers.layerX, layers.layerY, eraserSize, eraserSize, color );
			}
		}
		// 映射函数
		const drawImage = function ( Img: HTMLImageElement,sDraw: drawType, Draw: drawType ): void {
			canvasCtx.value?.drawImage( Img, sDraw.x, sDraw.y, sDraw.width, sDraw.height,
				Draw.x, Draw.y, Draw.width, Draw.height );
		}
		// 画笔函数
		const drawLine = function ( polt: imgM, pensize: number ): void {
			if (!canvasCtx.value) return;
			canvasCtx.value.beginPath();
			canvasCtx.value.arc( (polt.x1 + polt.x2)/2, (polt.y1 + polt.y2)/2, pensize, 0, Math.PI*2, true );
			canvasCtx.value.fill();
		}
		// 直线函数
		const drawDemoLine = function (beginLine: xy, endLine: xy): void {
			if (!canvasCtx.value) return;
			canvasCtx.value.beginPath();
			canvasCtx.value.moveTo( beginLine.x, beginLine.y );
			canvasCtx.value.lineTo( endLine.x, endLine.y );
			canvasCtx.value.stroke();
		}
		// 直线的操作框
		const lineBox = function ( x1: number, y1: number, x2: number, y2: number ): void {
			const path: xy[] = [ {x:x1, y:y1}, {x:x2, y:y2} ];
			path.forEach((element:xy):void => {
				if (!canvasCtx.value) return;
				canvasCtx.value.beginPath();
				canvasCtx.value.arc( element.x, element.y, 5, 0, Math.PI*2, true );
				canvasCtx.value.stroke();
			})
		}
    // 矩形函数
    const solidBox = function (beginLine: xy, endLine: xy, imageStatus: string): void {
      if (!canvasCtx.value) return;
      const minx: number = Math.min(beginLine.x, endLine.x);
      const miny: number = Math.min(beginLine.y, endLine.y);
      const maxx: number = Math.max(beginLine.x, endLine.x);
      const maxy: number = Math.max(beginLine.y, endLine.y);
      if (imageStatus === 'stroke') {
        canvasCtx.value.strokeRect(minx, miny, maxx, maxy);
      } else {
        canvasCtx.value.fillRect(minx, miny, maxx, maxy);
      }
    }
    // 虚线提示框
    const dottedBox = function (beginLine: xy, endLine: xy): void {
      if (!canvasCtx.value) return;
      const x: number = Math.min(beginLine.x, endLine.x);
      const y: number = Math.min(beginLine.y, endLine.y);
      const w: number = Math.abs(endLine.x - beginLine.x);
      const h: number = Math.abs(endLine.y - beginLine.y);
      canvasCtx.value.save();
      canvasCtx.value.setLineDash([5, 2]);
      canvasCtx.value.lineDashOffset = -10;
      canvasCtx.value.strokeStyle = 'rgba(131,191,236)';
      canvasCtx.value.lineWidth = 1;
      canvasCtx.value.strokeRect(x, y, w, h);
      const nodeLine:xy = { x: w/2 + x, y: h/2 + y };
      const path:xy[] = [
        { x:beginLine.x, y:beginLine.y }, { x:endLine.x, y:endLine.y },
        { x:endLine.x, y:beginLine.y }, { x:beginLine.x, y:endLine.y },
        { x:beginLine.x, y:nodeLine.y }, { x:endLine.x, y:nodeLine.y },
        { x:nodeLine.x, y:beginLine.y }, { x:nodeLine.x, y:endLine.y },
      ];
      path.forEach( (event:xy): void => {
        if (!canvasCtx.value) return;
        canvasCtx.value.strokeStyle = 'rgba(117,117,117)';
        canvasCtx.value.strokeRect(event.x-1, event.y-1, 3, 3);
        canvasCtx.value.fillStyle = 'rgba(255,255,255)';
        canvasCtx.value.fillRect(event.x, event.y, 2, 2);
      })
      canvasCtx.value.restore();
    }
    //判断绘制是否填充
    function triangleStatus (imageStatus: string): void {
      if (!canvasCtx.value) return;
      if(imageStatus === 'stroke'){
        canvasCtx.value.stroke();
      }
      else{
        canvasCtx.value.fill();
      }
    }
    //
    function triangleDraw (plot: trianglePlot, imageStatus: string) : void {
      if (!canvasCtx.value) return;
      canvasCtx.value.beginPath();
      canvasCtx.value.moveTo(plot.begin.x, plot.begin.y);
      canvasCtx.value.lineTo(plot.mid.x, plot.mid.y);
      canvasCtx.value.lineTo(plot.end.x, plot.end.y);
      canvasCtx.value.closePath();
      triangleStatus(imageStatus);
    }
    //三角形
    const Triangle = function (firstplot: xy, endplot: xy, type: string = 'solid', imageStatus: string):void {
      let beginPlot = {x:firstplot.x, y:firstplot.y};
      if (type === 'isosceles') {
        beginPlot.x = (firstplot.x + endplot.x)/2;
      }
      triangleDraw({
          begin: beginPlot,
          mid: {x:firstplot.x, y:endplot.y},
          end: {x:endplot.x, y:endplot.y},
        }, imageStatus);
    }
    //菱形
    const drawDiamond = function (firstplot: xy, endplot: xy, imageStatus: string) {
      if (!canvasCtx.value) return;
      const mid:xy = {
        x: (firstplot.x + endplot.x)/2,
        y: (firstplot.y + endplot.y)/2
      }
      const x = (endplot.x - firstplot.x)/2;
      const y = (endplot.y - firstplot.y)/2;
      canvasCtx.value.beginPath();
      canvasCtx.value.moveTo( mid.x + x , mid.y );
      canvasCtx.value.lineTo( mid.x  , mid.y - y );
      canvasCtx.value.lineTo( mid.x - x , mid.y );
      canvasCtx.value.lineTo( mid.x  , mid.y + y );
      canvasCtx.value.closePath();
      triangleStatus(imageStatus);
    } 
    //文本
    const text = function (textDottedLine: imgM, value: string, fontType: string, textStyle: boolean, fontSize: number): number {
      if (!canvasCtx.value) return 0;
      let index = 0;
      const textQueue: string[] = [''];
      const textWidth: number = Math.abs(textDottedLine.x2 - textDottedLine.x1);
      canvasCtx.value.save();
      canvasCtx.value.font = fontType;
      for(let i of value){
        if (canvasCtx.value.measureText(textQueue[index] + i).width > textWidth || i === '\n') {
          index += 1;
          textQueue.push('');
        }
        if(i != '\n')textQueue[index] += i;
      }
      for (let i = 0; i < textQueue.length; i++) {
        if (textStyle) {
          canvasCtx.value.fillText(textQueue[i], textDottedLine.x1, textDottedLine.y1 + fontSize * (i+1));
        } else {
          canvasCtx.value.strokeText(textQueue[i], textDottedLine.x1, textDottedLine.y1 + fontSize * (i+1));
        }
      }
      canvasCtx.value.restore();
      return textQueue.length * fontSize;  //判断是否需要伸长框体
    }
    expose({
      setCssText,    //设定css
      setClassName,
      saveImag,
			initBoard,
			eliminate,
			drawImage,
      lineBox,
      dottedBox,
      Triangle,
      text
    })

    //将事件导出外部使用
    return () => (
      <>
        <canvas
        ref={canvas}
        height={props.height}
        width={props.width}
        onClick={()=>{ emit('click') }}
        onMousedown={()=>{ emit('mousedown') }}
        onMouseup={()=>{ emit('mouseup') }}
        onMouseleave={()=>{ emit('mouseleave') }}
        onMousemove={()=>{ emit('mousemove') }}
          ></canvas>
      </>
    )
  }
})
