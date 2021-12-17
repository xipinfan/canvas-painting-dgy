import { defineComponent,ref } from 'vue'
import CanvasD from './components/CanvasD'

export default defineComponent({

  setup(props) {

    const height = ref<number>(500);
    const width = ref<number>(500);
    return () => (
      <CanvasD
       height={height.value}
       width={width.value}
       ></CanvasD>
    )
  }
})
