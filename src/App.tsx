import { defineComponent, ref, onMounted } from 'vue'
import CanvasD from './components/CanvasD'

export default defineComponent({

  setup(props) {
    const canvas = ref();
    const height = ref<number>(500);
    const width = ref<number>(500);
		const tool = ref<string>('diamond');
		const penSize = ref<number>(9);
		const strokeColor = ref<string>('#000000')
    onMounted( () => {
      canvas.value?.bucket(100,100,20, 'red');
    })

		const buttonClick = function () {
			//tool.value = 'line';
			//height.value = 600;
			penSize.value = 6;
			strokeColor.value = 'blue'

		}
    return () => (
			<>
				<CanvasD
				ref={canvas}
				height={height.value}
				width={width.value}
				tool={tool.value }
				penSize={penSize.value}
				strokeColor={strokeColor.value}
				>
				</CanvasD>
				<button onClick={buttonClick}>切换模式</button>
			</>
    )
  }
})
