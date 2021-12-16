import { defineComponent,ref,onMounted } from 'vue'

export default defineComponent({
  name:'cavnas',
  inheritAttrs:false,
  props: {
    width:{
      type:Number,
      default:400
    },
    height:{
      type:Number,
      default:400
    },
    position:{
      type:String,
      default:'absolute'
    },
    zIndex:{
      type:Number,
      default:0
    }
  },
  emits: [],
  components: {},
  setup(props, ctx) {
    const canvas = ref<HTMLCanvasElement|null>(null);
    console.log(props)
    onMounted(()=>{
      console.log(canvas.value);
    })
    return () => (
      <canvas ref={canvas} ></canvas>
    )
  }
})