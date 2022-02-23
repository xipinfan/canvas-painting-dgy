import { defineComponent,ref,provide,onMounted, watch, nextTick } from 'vue'
import propsCanvasD from './props';
import BaseCanvas from './BaseCanvas';
import { bus } from '../../libs/bus';
import OperationCanvas from './OperationCanvas';

/**
 * @description  Canvas 画布
 *
 * @property {Number}    width    画布宽度（默认值为400）
 * @property {Number}    height    画布长度（默认值为400）
 * @property {String}    border    画布的边框（无默认）
 * @property {String}    tool    当前画布的工具（可选值有'pickup'，'pencil'，'eraser'，'line'，
 * 'round'，'rectangle'，'rightTriangle'，'isosceles'，'diamond'，'text'， 'bucket'，默认为pencil）
 * @property {String}    bgColor    背景颜色
 * @property {Number}    penSize    画笔大小（默认为6）
 * @property {String}    strokeColor    绘制图像的颜色（默认#000000）
 * @property {Number}    eraserSize    橡皮擦大小（默认6）
 * @property {Number}    fontSize   文本字体大小（默认16）
 * @property {String}    fontFamily    文本字体样式（默认sans-serif）
 * @property {String}    fontWeight    文本粗细（默认400）
 * @property {String}    shapeStatu    图案绘制样式（可选值有fill、stroke，默认stroke）
 * @property {String}    bucketColor    油漆桶颜色（默认white）
 * @property {Number}    bucketIntensity    油漆桶力度（默认20）
 *
 *
 * @method {String}    pickup    获取拾色器选择到的颜色
 * @method {Function}    bucket    在指定的位置进行油漆桶操作
 * @method {Function}    save    返回当前画布base64格式的图片
 *
 * @event {Function} click click事件
 *
 */

//项目住文件
export default defineComponent({
  name:'cavnas-d',
  inheritAttrs:false,
  props:propsCanvasD,
  setup(props, { slots, expose, emit }) {

    const inTextarea = ref<HTMLTextAreaElement | null>();   //保存textarea
		const canvas = [ref(), ref()]; //保存基础与操作画布
    const opIndex = ref<number>(-1001);
    const baIndex = ref<number>(1000);
    const indexText = ref<string>('');
		const ImageDatas: string[] = [];
		const forwardData: string[] = [];
		const pickupColor = ref<string>('');
    provide('item', props);
    provide('tool', props.tool);
		provide('ImageDatas', ImageDatas);
		provide('forwardData', forwardData);

		async function initTool (tool: string): Promise<void> {
			baIndex.value = 1000;
			switch(tool){
        case 'text':
        case 'round':
        case 'rectangle':
        case 'rightTriangle':
        case 'isosceles':
        case 'shear':
        case 'diamond':
				case 'line': {
					opIndex.value = 1001;
					break;
				}
				default: {
          opIndex.value = -1001;
				}
			}

      if (tool === 'shear') {
        await bus.savemiddle();
        console.log(bus.middleImage.src)
      }
		}
		//当工具更新时相应
		watch(()=>props.tool, (newVal: string)=>{
			initTool(newVal);
		})

    const getFocus = function () {
      inTextarea.value?.focus();
    }

		const cleanTextarea = function () {
				indexText.value = '';
		}

    onMounted(():void=>{
			if (!inTextarea.value) return;
      // bus.bsCanvasFunction('solidBox', { x: 100, y: 100 }, {x: 300, y: 300})
			inTextarea.value.style.cssText = 'opacity: 0;z-index: -1001; position: absolute;';
      nextTick(()=>{
        initTool(props.tool);
      })
		})

    expose({
      pickup: pickupColor,
      bucket: (x: number, y: number,intensity: number = 20, color: string = props.strokeColor): void=>{
        canvas[0].value?.bucket({ x, y }, intensity, color);
      },
      getFocus,
			save: (type: string): string=> {
				return canvas[0].value?.save(type);
			}
    })

    //总共两层canvas有基础、操作，分别定义在不同的文件，textarea是用来输入文字的
    return () => (
      <div onClick={()=>{pickupColor.value = canvas[0].value?.pickup; emit('click'); }} style={{width:props.width+'px', height:props.height+'px', border: props.border}}>
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
					bsCanvasFunction={canvas[0].value?.bsCanvasFunction}
					cleanTextarea={cleanTextarea}
          ></OperationCanvas>

         <textarea
          ref={inTextarea}
          v-model={indexText.value}
          ></textarea>
      </div>
    )
  }
})
