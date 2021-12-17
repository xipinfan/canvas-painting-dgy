import { defineComponent,ref,onMounted } from 'vue'

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
    const canvasCtx = ref<CanvasRenderingContext2D | null>(null)

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

    expose({
      setCssText,    //设定css
      setClassName,
      canvas,   //canvas的dom
      canvasCtx   //canvas的getContext('2d')
    })

    //将事件导出外部使用
    return () => (
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
    )
  }
})