import { defineComponent,inject,ref } from 'vue'
import CanvasBasice from './CanvasBasice'
import { canvasDProps } from '../utils/Interface'

//操作画布
export default defineComponent({
  inheritAttrs: false,
  emits: [],
  components: {},
  setup(props, ctx) {
    const opCanvas = ref();
    const setUp:canvasDProps | null = inject('setUp') || null;
    if(!setUp)return;

    return () => (<>
      <CanvasBasice
         ref={opCanvas}
         height={setUp.height}
         width={setUp.width}
         position={'absolute'}
         zIndex={ -1001 }
         ></CanvasBasice>
    </>)
  }
})