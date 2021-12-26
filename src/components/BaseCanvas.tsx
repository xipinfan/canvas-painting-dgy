import { defineComponent,inject,ref, onMounted } from 'vue'
import CanvasBasice from './CanvasBasice'
import { route } from '../utils/basics-tool'
import { canvasDProps, xy, imgM } from '../utils/Interface'

//基础画布
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
    const lastCoordinate: xy = { x: 0, y: 0 };
    const bsCanvas: any = ref();
    const setUp: canvasDProps | null = inject('setUp') || null;
    if(!setUp) return;
    const baMousedowm = function (e: MouseEvent): void {
      if (bsCanvas.value) {
        state = true;
        switch (setUp.tool) {
          case 'pencil': {
            [lastCoordinate.x, lastCoordinate.y] = [e.offsetX, e.offsetY];
            bsCanvas.value.drawLine(lastCoordinate, setUp.penSize);
            break;
          }
          case 'eraser': {
            bsCanvas.value.eliminate(setUp.bgColor, { x: e.offsetX, y: e.offsetY }, setUp.eraserSize);
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    const baMousemove = function (e: MouseEvent): void {
      if (bsCanvas.value && state) {
        switch (setUp.tool) {
          case 'pencil': {
            const routes: xy[] = route(lastCoordinate, {
              x:e.offsetX, y: e.offsetY,
            });
            routes.forEach((R)=>{
              bsCanvas.value.drawLine(R, setUp.penSize);
              [ lastCoordinate.x, lastCoordinate.y ] = [ R.x, R.y ]
            })
            break;
          }
          case 'eraser': {
            bsCanvas.value.eliminate(setUp.bgColor, { x: e.offsetX, y: e.offsetY }, setUp.eraserSize);
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    const baMouseleave = function (e: MouseEvent): void {
      state = false;
    }
    //拾色器函数
    const pickup = function (spots: xy): string {
      const ImgD: ImageData = bsCanvas.value?.getImageData(spots, {x: 1, y: 1});
      const datas: string[] = [...ImgD.data].map((num:number): string=>{
        let Snum = num.toString(16);
        if(Snum.length < 2) Snum = '0' + Snum;
        return Snum;
      });
      return `#${datas[0]}${datas[1]}${datas[2]}`;
    }
    //油漆桶
    const bucket = function (...buckets: any[]): void {
      bsCanvas.value?.paintB.apply(bsCanvas.value, buckets);
    }

    expose({
      pickup,      //拾色器
      bucket
    })

    onMounted(()=>{
      bsCanvas.value?.initBoard('blue');
    })

    return () => (
    <CanvasBasice
        ref={ bsCanvas }
        height={setUp.height }
        width={ setUp.width }
        position={ 'absolute' }
        zIndex={ props.zIndex }
        onMousedown={ baMousedowm }
        onMousemove={ baMousemove }
        onMouseleave={ baMouseleave }
        onMouseup={ baMouseleave }
        ></CanvasBasice>
    )
  }
})
