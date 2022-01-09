import { defineComponent,ref,provide,onMounted, watch, PropType } from 'vue'
import propsCanvasD from './props';
import BaseCanvas from './BaseCanvas';
import OperationCanvas from './OperationCanvas';

//项目住文件
export default defineComponent({
  name:'cavnas-d',
  inheritAttrs:false,
  props:propsCanvasD,
  setup(props, { slots, expose }) {

    const inTextarea = ref<HTMLTextAreaElement | null>();   //保存textarea
		const canvas = [ref(), ref()]; //保存基础与操作画布
    const opIndex = ref<number>(-1001);
    const baIndex = ref<number>(1000);
		const ImageDatas: string[] = [];
		const forwardData: string[] = [];
    provide('item', props);
    provide('tool', props.tool);
		provide('ImageDatas', ImageDatas);
		provide('forwardData', forwardData);

		function initTool (tool: string): void {
			baIndex.value = 1000;
			switch(tool){
        case 'round':
        case 'rectangle':
        case 'rightTriangle':
        case 'isosceles':
        case 'diamond':
				case 'line': {
					opIndex.value = 1001;
					break;
				}
				default: {
          opIndex.value = -1001;
				}
			}
		}
		//当工具更新时相应
		watch(()=>props.tool, (newVal: string)=>{
			initTool(newVal);
		})


    onMounted(():void=>{
			if (!inTextarea.value) return;
			inTextarea.value.style.cssText = 'opacity: 0;z-index: -1001; position: absolute;';
			initTool(props.tool);
		})

    expose({
      pickup: (spotX: number, spotY: number): string=>{
        return canvas[0].value?.pickup({x: spotX, y: spotY})
      },
      bucket: (x: number, y: number,intensity: number = 20, color: string = props.strokeColor): void=>{
        canvas[0].value?.bucket({ x, y }, intensity, color);
      }
    })

    //总共两层canvas有基础、操作，分别定义在不同的文件，textarea是用来输入文字的
    return () => (
      <div style={{width:props.width+'px', height:props.height+'px'}}>
        { slots.default && slots.default() }

         <BaseCanvas
          ref={canvas[0]}
          zIndex={baIndex.value}
          ></BaseCanvas>

         <OperationCanvas
				 	ref={canvas[1]}
          zIndex={opIndex.value}
          ></OperationCanvas>

         <textarea ref={inTextarea}></textarea>
      </div>
    )
  }
})
