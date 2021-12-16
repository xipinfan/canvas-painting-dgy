import { defineComponent } from 'vue'
import CanvasD from './components/canvas'

export default  defineComponent({
  name:'cavnas-dgy',
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
  },
  setup(props, ctx) {

    return () => (
      <>
        <CanvasD
         height={props.height}
         width={props.width}
         position={'absolute'}
         ></CanvasD>
      </>
    )
  }
})