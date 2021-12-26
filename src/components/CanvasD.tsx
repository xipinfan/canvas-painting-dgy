import { defineComponent,ref,provide,onMounted } from 'vue'
import BaseCanvas from './BaseCanvas';
import CanvasBasice from './CanvasBasice'
import OperationCanvas from './OperationCanvas';
import { xy } from '../utils/Interface'

//项目住文件
export default defineComponent({
  name:'cavnas-d',
  inheritAttrs:false,
  props: {
    width:{
      type:Number,
      default:400
    },
    height:{
      type:Number,
      default:400
    },
    tool:{
      type:String,
      default:'pencil'
    },
    bgColor:{
      type:String,
      default:''
    },
    penSize:{
      type:Number,
      default:6
    },
    strokeColor:{
      type:String,
      default:'#000000'
    },
    eraserSize:{
      type:Number,
      default:6
    },
    fontSize:{
      type:Number,
      default:16
    },
    fontFamily:{
      type:String,
      default:'sans-serif'
    },
    fontWeight:{
      type:String,
      default:'400'
    },
  },
  setup(props, { slots, expose }) {
    const inTextarea = ref<HTMLTextAreaElement | null>();   //保存textarea
		const frame = ref();    //保存画布框体
    const baCanvas = ref(); //保存基础画布
    const opIndex = ref<number>(-1001);
    const baIndex = ref<number>(1000);
    provide('setUp', props);

    switch(props.tool){
      case 'pickup':
      case 'pencil':{
        baIndex.value = 1000;
        opIndex.value = -1001;
      }
      default: {
        
      }
    }

    onMounted(():void=>{
			if (!inTextarea.value || !frame.value) return;
			inTextarea.value.style.cssText = 'opacity: 0;z-index: -1001; position: absolute;';
			frame.value.style.cssText = `width:${props.width}px;height:${props.height}px;`;
    })

    expose({
      pickup: (spotX: number, spotY: number): string=>{
        return baCanvas.value?.pickup({x: spotX, y: spotY})
      },
      bucket: (x: number, y: number,intensity: number = 20, color: string = props.strokeColor): void=>{
        baCanvas.value?.bucket({ x, y }, intensity, color);
      }
    })

    //总共三层canvas背景、基础、操作，分别定义在不同的文件，textarea是用来输入文字的
    return () => (
      <div ref={frame}>
        { slots.default && slots.default() }

         <BaseCanvas
          ref = {baCanvas}
          zIndex={baIndex.value}
          ></BaseCanvas>

         <OperationCanvas
          zIndex={opIndex.value}
          ></OperationCanvas>

         <textarea ref={inTextarea}></textarea>
      </div>
    )
  }
})
