import { defineComponent,inject,ref } from 'vue'
import CanvasBasice from './CanvasBasice'
import { canvasDProps } from '../utils/Interface'

//基础画布
export default defineComponent({
  inheritAttrs: false,
  emits: [],
  components: {},
  setup(props, ctx) {
    const bsCanvas = ref();
    const setUp:canvasDProps | null = inject('setUp') || null;
    if(!setUp)return;


    return () => (<>
      <CanvasBasice
         ref={bsCanvas}
         height={setUp.height}
         width={setUp.width}
         position={'absolute'}
         zIndex={ 1000 }
         ></CanvasBasice>
    </>)
  }
})