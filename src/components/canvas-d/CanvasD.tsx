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
    const indexText = ref<string>('');
		const ImageDatas: string[] = [];
		const forwardData: string[] = [];
    provide('item', props);
    provide('tool', props.tool);
		provide('ImageDatas', ImageDatas);
		provide('forwardData', forwardData);

		function initTool (tool: string): void {
			baIndex.value = 1000;
			switch(tool){
        case 'text':
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

    const getFocus = function () {
      inTextarea.value?.focus();
    }
    onMounted(():void=>{
			if (!inTextarea.value) return;
			inTextarea.value.style.cssText = 'opacity: 0;z-index: -1001; position: absolute;';
      initTool(props.tool);
		})

    expose({
      pickup: (): string=>{
        return canvas[0].value?.pickup.value;
      },
      bucket: (x: number, y: number,intensity: number = 20, color: string = props.strokeColor): void=>{
        canvas[0].value?.bucket({ x, y }, intensity, color);
      },
      getFocus,
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
          inTextarea={indexText.value}
				 	ref={canvas[1]}
          zIndex={opIndex.value}
          getFocus={getFocus}
          ></OperationCanvas>

         <textarea 
          ref={inTextarea}
          v-model={indexText.value}
          ></textarea>
      </div>
    )
  }
})
