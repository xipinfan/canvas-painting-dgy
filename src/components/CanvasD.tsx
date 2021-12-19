import { defineComponent,ref,provide,onMounted } from 'vue'
import BaseCanvas from './BaseCanvas';
import CanvasBasice from './CanvasBasice'
import OperationCanvas from './OperationCanvas';

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
      type:Number,
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
  setup(props, ctx) {
    const bgCavnas = ref();   //保存背景canvas
    const inTextarea = ref();   //保存textarea
    provide('setUp', props);
    
    onMounted(():void=>{
      console.log(bgCavnas.value.canvas);
    })
    
    //总共三层canvas背景、基础、操作，分别定义在不同的文件，textarea是用来输入文字的
    return () => (
      <> 
        <CanvasBasice
         ref={bgCavnas}
         height={props.height}
         width={props.width}
         position={'absolute'}
         zIndex={ -999 }
         ></CanvasBasice>

         <BaseCanvas></BaseCanvas>

         <OperationCanvas></OperationCanvas>

         <textarea ref={inTextarea}></textarea>
      </>
    )
  }
})