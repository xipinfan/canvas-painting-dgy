import { defineComponent,inject,ref, onMounted, watch } from 'vue'
import CanvasBasice from './CanvasBasice'
import { route } from '../../utils/basics-tool'
import { xy, typeD, typeMouse, typeBsCanvas } from '../../utils/Interface'
import { bus } from '../../libs/bus'

//基础画布
export default defineComponent({
  inheritAttrs: false,
  emits: [],
  components: {},
  props:{
    zIndex:{
      type:Number,
      default:1000
    }
  },
  setup(props, { expose }) {
    let state: boolean = false;
    const lastCoordinate: xy = { x: 0, y: 0 };
    const bsCanvas= ref<typeof CanvasBasice | null>(null);
    const item: any = inject('item');
    if(!item) return;

		//具体需要调用的数组
		const mouse: typeMouse = {
			//画笔函数
			pencilDowm: function (e: MouseEvent): void {
				[lastCoordinate.x, lastCoordinate.y] = [e.offsetX, e.offsetY];
				bsCanvas.value?.drawLine(lastCoordinate, item.penSize);
			},
			pencilMove: function (e: MouseEvent): void {
				const routes: xy[] = route(lastCoordinate, {
					x:e.offsetX, y: e.offsetY,
				});
				routes.forEach((R)=>{
					bsCanvas.value?.drawLine(R, item.penSize);
					[ lastCoordinate.x, lastCoordinate.y ] = [ R.x, R.y ]
				})
			},
			//橡皮擦函数
			eraserDowm: function (e: MouseEvent): void {
				bsCanvas.value?.eliminate(item.bgColor, { x: e.offsetX, y: e.offsetY }, item.eraserSize);
			},
			eraserMove: function (e: MouseEvent): void {
				bsCanvas.value?.eliminate(item.bgColor, { x: e.offsetX, y: e.offsetY }, item.eraserSize);
			},
      pickupDowm: function (e: MouseEvent): void {
        const ImgD: ImageData = bsCanvas.value?.getImageData({x:e.offsetX, y:e.offsetY}, {x: 1, y: 1});
        const datas: string[] = [...ImgD.data].map((num:number): string=>{
          let Snum = num.toString(16);
          if(Snum.length < 2) Snum = '0' + Snum;
          return Snum;
        });
        pickup.value = `#${datas[0]}${datas[1]}${datas[2]}`;
      },
		}

		//通过对象映射调用数组
		const mouseNameChange = function (name: string, e:MouseEvent): void {
			//实现判断当前映射是否在对象内
			//if(Object.prototype.hasOwnProperty.call(mouse, item.tool + name)){
			if (mouse.hasOwnProperty(item.tool + name)) {
				mouse[(item.tool + name) as typeD](e);
			}
		}

    const baMousedowm = function (e: MouseEvent): void {
			state = true;
			mouseNameChange('Dowm', e);
    }

    const baMousemove = function (e: MouseEvent): void {
			if(state) {
				mouseNameChange('Move', e);
			}
    }

    const baMouseleave = function (e: MouseEvent): void {
      state = false;
    }

    //拾色器函数
    const pickup = ref<string>('');
    //油漆桶
    const bucket = function (...buckets: any[]): void {
      bsCanvas.value?.paintB.apply(bsCanvas.value, buckets);
    }

    expose({
      pickup,      //拾色器
      bucket,
    })

    onMounted(()=>{
      bsCanvas.value?.initBoard(item.bgColor);
			//通过一个外部的reactive保存数据将调用本地canvas数据的函数传递到兄弟节点
			bus.bsCanvasFunction = function (type: typeBsCanvas, ...parameters: any[]): void {
				if (Object.prototype.hasOwnProperty.call(bsCanvas.value, type) && bsCanvas.value) {
					bsCanvas.value[type](...parameters);
					//bsCanvas.value[type].apply(bsCanvas.value, parameters);
				}
			};
    })

		watch( () => item.bgColor, (newVal)=>{
			bsCanvas.value?.initBoard(newVal);
		})

    return () => (
    <CanvasBasice
        ref={ bsCanvas }
        zIndex={ props.zIndex }
        onMousedown={ baMousedowm }
        onMousemove={ baMousemove }
        onMouseleave={ baMouseleave }
        onMouseup={ baMouseleave }
        ></CanvasBasice>
    )
  }
})
