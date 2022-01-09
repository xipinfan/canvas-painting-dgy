import { defineComponent,inject,ref, onMounted } from 'vue'
import CanvasBasice from './CanvasBasice'
import { typeOpD, typeOpMouse, typeShare, xy } from '../../utils/Interface'
import { bus } from '../../libs/bus'
import { mousePointLine, boundary, linespotChange, shapespotChange } from '../../utils/canvas-cursor'

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
		let state: boolean = false;		// 判断当前鼠标是否按下
		let controlnode: boolean = false;		// 判断当前初始绘制是否完成
    const opCanvas = ref<typeof CanvasBasice | null>(null);		// 主标签获取
    const tool: string | undefined = inject('tool');		// 获取之前保存的props
		if(!tool)return;
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
			if (tool === 'line') {
				return mousePointLine( { x: e.offsetX, y: e.offsetY }, spotBegin, spotEnd, changeCursor );
			} else {
				return boundary( changeCursor,{ x:e.offsetX, y: e.offsetY }, spotBegin, spotEnd );
			}
		}
		//  调用坐标移动函数
		const spotChange = function (type: string): void {
			mouse[type + 'spotChange' as typeShare](
				mouse.spotNode, 
				spotBegin, 
				spotEnd, 
				{ 
					x:mouse.e.x -  mouse.mobile.x,
					y:mouse.e.y -  mouse.mobile.y,
				}
			);
		}
		// 策略模式对象
		const mouse :typeOpMouse = {
			e: { x:0, y:0 },		// 当前点
			mobile: { x:0, y:0 },		// 移动前的点
			spotNode: '',		// 鼠标位置
			linespotChange,
			shapespotChange,
			move: function () :void {
				if (tool === 'line') {		//直线移动判断与其他的不同
					spotChange('line');	
				} else {
					spotChange('shape');	
				}
			},
			lineMove: function (): void {		// 直线绘制
				opCanvas.value?.drawDemoLine( spotBegin, spotEnd );
				opCanvas.value?.lineBox( spotBegin, spotEnd );
			},
			lineDraw: function (): void {		// 直线绘制完成
				bus.bsCanvasFunction('drawDemoLine', spotBegin, spotEnd);
			},
			rectangleMove: function (): void {
				opCanvas.value?.solidBox( spotBegin, spotEnd );
				opCanvas.value?.dottedBox( spotBegin, spotEnd );
			},
			rectangleDraw: function (): void {
				bus.bsCanvasFunction('solidBox', spotBegin, spotEnd);
			},
			roundMove: function (): void {
				opCanvas.value?.solidRound( spotBegin, spotEnd );
				opCanvas.value?.dottedBox( spotBegin, spotEnd );
			},
			roundDraw: function (): void {
				bus.bsCanvasFunction('solidRound', spotBegin, spotEnd);
			},
			rightTriangleMove: function(): void {
				opCanvas.value?.Triangle( spotBegin, spotEnd, 'solid' );
				opCanvas.value?.dottedBox( spotBegin, spotEnd );
			},
			rightTriangleDraw: function(): void {
				bus.bsCanvasFunction('Triangle', spotBegin, spotEnd, 'solid');
			},
			isoscelesMove: function(): void {
				opCanvas.value?.Triangle( spotBegin, spotEnd, 'isosceles' );
				opCanvas.value?.dottedBox( spotBegin, spotEnd );
			},
			isoscelesDraw: function(): void {
				bus.bsCanvasFunction('Triangle', spotBegin, spotEnd, 'isosceles');
			},
			diamondMove: function(): void {
				opCanvas.value?.drawDiamond( spotBegin, spotEnd );
				opCanvas.value?.dottedBox( spotBegin, spotEnd );
			},
			diamondDraw: function(): void {
				bus.bsCanvasFunction('drawDiamond', spotBegin, spotEnd);
			}
		}

		// 通过对象映射调用数组
		const mouseNameChange = function (name: string, e: MouseEvent): void {
			// 实现判断当前映射是否在对象内
			// if(Object.prototype.hasOwnProperty.call(mouse, item.tool + name)){
			[ mouse.e.x, mouse.e.y ] = [ e.offsetX, e.offsetY ];
			if (tool !== 'line') {
				position();
			}
			console.log(spotBegin, spotEnd)
			if (mouse.hasOwnProperty(tool + name)) {
				mouse[(tool + name) as typeOpD]();
			}
		}

		const opMousedowm = function (e: MouseEvent): void {
			if ( !controlnode ) {		// 当前初始绘制未完成
				state = true;
				[ spotBegin.x, spotBegin.y ] = [ e.offsetX, e.offsetY ];
			} else {
				mouse.spotNode = cursorJudge (e);
				if ( mouse.spotNode === 'default' ) {``
					// 当鼠标点击位置不在区域内
					opCanvas.value?.initBoard();
					mouseNameChange('Draw', e);
				} else {    // 进行移动操作
					state = true;
					[ mouse.mobile.x, mouse.mobile.y ] = [ e.offsetX, e.offsetY ];		// 保存初始点
					mouse.e = JSON.parse(JSON.stringify(mouse.mobile));
				}
			}
		}

		const opMousemove = function (e: MouseEvent): void {
			if ( state && !controlnode ) {		// 绘制
				opCanvas.value?.initBoard();
				[ spotEnd.x, spotEnd.y ] = [ e.offsetX, e.offsetY ];
				mouseNameChange('Move', e)
			} else if ( controlnode ) {		// 绘制完成
				if ( state ) {		// 移动
					opCanvas.value?.initBoard();	//每移动一次清楚一次画布重新绘制
					mouse.move();		//拖动计算位置
					mouse.mobile = JSON.parse(JSON.stringify(mouse.e));		//位置保存
					mouseNameChange('Move', e)		//重绘
				} else {
					mouse.spotNode = cursorJudge(e);
				}
			}
		}

		const opMouseleave = function (e: MouseEvent): void {
			if ( !controlnode ) {		// 切换状态
				[ spotEnd.x, spotEnd.y ] = [ e.offsetX, e.offsetY ];
				controlnode = true;
			} 
			if ( !state ) {
				controlnode = false;
			}
			state = false;
		}

		onMounted(()=>{
			// console.log(bus.bsCanvasFunction('paintB', {x:0,y:0}, 20, '#000000'))
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
