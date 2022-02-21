import { defineComponent, ref, onMounted, computed } from 'vue'
import classes from './index.module.css'

export default defineComponent({

  setup(props) {
    const cla = computed(() => {
      return [classes.button1, classes.button2];
    })
    const sss = ref<String>('sadasd')
    return () => (
			<>
        <button class={cla.value}>
          {sss.value}
        </button>
			</>
    )
  }
})
