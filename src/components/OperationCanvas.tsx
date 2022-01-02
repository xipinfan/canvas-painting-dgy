import { defineComponent,inject,ref, onMounted } from 'vue'
import CanvasBasice from './CanvasBasice'
import { typeOpD, typeOpMouse, xy } from '../utils/Interface'
import { bus } from '../libs/bus'
import { mousePointLine, boundary, linespotChange } from '../utils/canvas-cursor'
import OperationCanvas from './OperationCanvas';
//操作画布
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
		let state: boolean = false;		//判断当前鼠标是否按下
		let controlnode: boolean = false;		//判断当前初始绘制是否完成
    const opCanvas = ref<typeof CanvasBasice | null>(null);		//主标签获取
    const item: typeof OperationCanvas | null = inject('item') || null;		//获取之前保存的props
		if(!item)return;
		const spotBegin: xy = {		//绘制的初始坐标
			x:0, y:0
		}
		const spotEnd: xy = {		//绘制的结束坐标
			x:0, y:0
		}
		// 形状需要修改坐标点
		const position = function(): void {
			[ spotBegin.x, spotBegin.y, spotEnd.x, spotEnd.y ] = [
				Math.min(spotBegin.x, spotEnd.x), Math.min(spotBegin.y, spotEnd.y),
				Math.max(spotBegin.x, spotEnd.x), Math.max(spotBegin.y, spotEnd.y)
			];
		}
		// 修改cursor
		const changeCursor = function(cursor: string): void {
			opCanvas.value?.setCss('cursor', cursor);
		}
		// 获取当前鼠标在形状何处
		const cursorJudge = function(e: MouseEvent): string {
			if (item.tool === 'line') {
				return mousePointLine( { x: e.offsetX, y: e.offsetY }, spotBegin, spotEnd, changeCursor );
			} else {
				return boundary( changeCursor,{ x:e.offsetX, y: e.offsetY }, spotBegin, spotEnd );
			}
		}
		// 策略模式对象
		const mouse :typeOpMouse = {
			e: { x:0, y:0 },		//当前点
			mobile: { x:0, y:0 },		//移动前的点
			spotNode: '',		//鼠标位置
			lineMove: function (): void {		//直线绘制
				opCanvas.value?.drawDemoLine( spotBegin, spotEnd );
				opCanvas.value?.lineBox( spotBegin, spotEnd );
			},
			lineBaseMove: function (): void {		//直线操作移动
				opCanvas.value?.initBoard();
				linespotChange(		//相对坐标移动
					mouse.spotNode, 
					spotBegin, 
					spotEnd, 
					{ 
						x:mouse.e.x -  mouse.mobile.x,
						y:mouse.e.y -  mouse.mobile.y,
					}
				);
				mouse.mobile = JSON.parse(JSON.stringify(mouse.e));
				mouse.lineMove();
			},
			lineDraw: function (): void {		//直线绘制完成
				opCanvas.value?.initBoard();
				bus.bsCanvasFunction('drawDemoLine', spotBegin, spotEnd)
			}
		}

		//通过对象映射调用数组
		const mouseNameChange = function (name: string, e: MouseEvent): void {
			//实现判断当前映射是否在对象内
			//if(Object.prototype.hasOwnProperty.call(mouse, item.tool + name)){
			[ mouse.e.x, mouse.e.y ] = [ e.offsetX, e.offsetY ];

			if (mouse.hasOwnProperty(item.tool + name)) {
				mouse[(item.tool + name) as typeOpD]();
			}
		}

		const opMousedowm = function (e: MouseEvent): void {
			if ( !controlnode ) {		//当前初始绘制未完成
				state = true;
				[ spotBegin.x, spotBegin.y ] = [ e.offsetX, e.offsetY ];
				mouseNameChange('Dowm', e)	
			} else {
				mouse.spotNode = cursorJudge (e);
				if ( mouse.spotNode === 'default' ) {
					//当鼠标点击位置不在区域内
					mouseNameChange('Draw', e);
				} else {    //进行移动操作
					state = true;
					mouse.mobile = { x:e.offsetX, y:e.offsetY };		//保存初始点
				}
			}
		}

		const opMousemove = function (e: MouseEvent): void {
			if ( state && !controlnode ) {		//绘制
				opCanvas.value?.initBoard();
				[ spotEnd.x, spotEnd.y ] = [ e.offsetX, e.offsetY ];
				mouseNameChange('Move', e)
			} else if ( controlnode ) {		//绘制完成
				mouse.spotNode = mousePointLine({ x:e.offsetX, y:e.offsetY }, spotBegin, spotEnd, changeCursor);
				if ( state ) {		//移动
					mouseNameChange('BaseMove', e);
				}
			}
		}

		const opMouseleave = function (e: MouseEvent): void {
			state = false;
			if ( !controlnode ) {		//切换状态
				[ spotEnd.x, spotEnd.y ] = [ e.offsetX, e.offsetY ];
				controlnode = true;
			}
			
		}

		onMounted(()=>{
			//console.log(bus.bsCanvasFunction('paintB', {x:0,y:0}, 20, '#000000'))
		})

    return () => (<>
      <CanvasBasice
        ref={opCanvas}
        zIndex={ props.zIndex }
				onMousedown={ opMousedowm }
				onMousemove={ opMousemove }
				onMouseleave={ opMouseleave }
				onMouseup={ opMouseleave }
         ></CanvasBasice>
    </>)
  }
})
