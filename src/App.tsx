import { defineComponent, ref, onMounted } from 'vue'
import CanvasD from './components/CanvasD'

export default defineComponent({

  setup(props) {
    const canvas = ref();
    const height = ref<number>(500);
    const width = ref<number>(500);
    onMounted( () => {
      canvas.value?.bucket(100,100,20, 'red');
    })
    return () => (
      <CanvasD
       ref={canvas}
       height={height.value}
       width={width.value}
       tool='pencil'
       >
       </CanvasD>
    )
  }
})
