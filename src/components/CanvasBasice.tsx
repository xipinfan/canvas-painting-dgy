import { defineComponent,ref,onMounted } from 'vue'
import { layer, imgM, drawType, xy } from '../utils/Interface';

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
    //快速设定css
    const setCssText = function(text:string):void{
      if(!canvas.value)return;
      canvas.value.style.cssText = text;
    }
    //修改类名
    const setClassName = function(name:string):void{
      if(!canvas.value)return;
      canvas.value.className = name;
    }
    //保存图片函数
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
    //重置画布
    const initBoard = function (color: string): void {
			if(!canvasCtx.value)return;
      canvasCtx.value.clearRect(0,0,props.width,props.height);
      if(color){
        fillRect ( 0, 0, props.width, props.height, color );
      }
    }
		//橡皮擦
		const eliminate = function ( color: string, layers:layer, eraserSize: number ): void {
			if (!canvasCtx.value) return;
			if (!color) {
				canvasCtx.value.clearRect( layers.layerX, layers.layerY, eraserSize, eraserSize )
			} else {
				fillRect ( layers.layerX, layers.layerY, eraserSize, eraserSize, color );
			}
		}
		//映射函数
		const drawImage = function ( Img: HTMLImageElement,sDraw: drawType, Draw: drawType ): void {
			canvasCtx.value?.drawImage( Img, sDraw.x, sDraw.y, sDraw.width, sDraw.height,
				Draw.x, Draw.y, Draw.width, Draw.height );
		}
		//画笔函数
		const drawLine = function ( polt: imgM, pensize: number ): void {
			if (!canvasCtx.value) return;
			canvasCtx.value.beginPath();
			canvasCtx.value.arc( (polt.x1 + polt.x2)/2, (polt.y1 + polt.y2)/2, pensize, 0, Math.PI*2, true );
			canvasCtx.value.fill();
		}
		//直线函数
		const drawDemoLine = function ( beginLine: xy, endLine: xy ): void {
			if (!canvasCtx.value) return;
			canvasCtx.value.beginPath();
			canvasCtx.value.moveTo( beginLine.x, beginLine.y );
			canvasCtx.value.lineTo( endLine.x, endLine.y );
			canvasCtx.value.stroke();
		}
		//直线的操作框
		const lineBox = function ( x1: number, y1: number, x2: number, y2: number ): void {
			const path: xy[] = [ {x:x1, y:y1}, {x:x2, y:y2} ];
			path.forEach((element:xy):void => {
				if (!canvasCtx.value) return;
				canvasCtx.value.beginPath();
				canvasCtx.value.arc( element.x, element.y, 5, 0, Math.PI*2, true );
				canvasCtx.value.stroke();
			})
		}

    expose({
      setCssText,    //设定css
      setClassName,
      saveImag,
			initBoard,
			eliminate,
			drawImage,
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
