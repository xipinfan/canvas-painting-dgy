import { defineComponent,inject,ref, onMounted } from 'vue'
import CanvasBasice from './CanvasBasice'
import { canvasDProps, typeOpD, typeOpMouse } from '../utils/Interface'
import { bus } from '../libs/bus'
//操作画布
export default defineComponent({
  inheritAttrs: false,
  emits: [],
  components: {},
  props:{
    zIndex:{
      type:Number,
      default:-1000
    }
  },
  setup(props, { expose }) {
		let state: boolean = false;
    const opCanvas = ref();
    const item:canvasDProps | null = inject('item') || null;
    if(!item)return;

		const mouse :typeOpMouse = {
			lineDowm: function (): void {

			}
		}

		//通过对象映射调用数组
		const mouseNameChange = function (name: string, e:MouseEvent): void {
			//实现判断当前映射是否在对象内
			//if(Object.prototype.hasOwnProperty.call(mouse, item.tool + name)){
			if (mouse.hasOwnProperty(item.tool + name)) {
				mouse[(item.tool + name) as typeOpD](e);
			}
		}

		const opMousedowm = function (e: MouseEvent): void {
			state = true;
			mouseNameChange('Dowm', e)
		}

		const opMousemove = function (): void {
			if (state) {

			}
		}

		const opMouseleave = function (): void {
			state = false;
		}

		onMounted(()=>{
			//console.log(bus.bsCanvasFunction('paintB', {x:0,y:0}, 20, '#000000'))
		})

    return () => (<>
      <CanvasBasice
        ref={opCanvas}
        zIndex={ props.zIndex }
				onMousedown={ opMousedowm }
				onMousemove={ opMousemove }
				onMouseleave={ opMouseleave }
				onMouseup={ opMouseleave }
         ></CanvasBasice>
    </>)
  }
})
