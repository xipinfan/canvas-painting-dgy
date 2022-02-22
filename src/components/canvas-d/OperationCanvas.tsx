import { defineComponent,inject,ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import CanvasBasice from './CanvasBasice'
import { typeOpD, typeOpMouse, typeShare, xy, imgM } from '../../utils/Interface'
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
    },
		inTextarea:{
			type:String,
			default: ''
		},
		getFocus:{
			type: Function,
			default:(): void=>{},
		},
		bsCanvasFunction: {
			type: Function,
		}
  },
  setup(props, { expose }) {
		let state: boolean = false;		// 判断当前鼠标是否按下
		let controlnode: boolean = false;		// 判断当前初始绘制是否完成
		let twinkle: number = 0;    //闪烁计时
		let textInterval: any = null;
    const opCanvas = ref<typeof CanvasBasice | null>(null);		// 主标签获取
    const tool: string | undefined = inject('tool');		// 获取之前保存的props
		if(!tool)return;
		const xyTemplate: string = '{ "x":0, "y":0 }';
		const spotBegin: xy =JSON.parse(xyTemplate);		//绘制的结束坐标
		const spotEnd: xy = JSON.parse(xyTemplate);
		const shapeBegin: xy = JSON.parse(xyTemplate);		//保存的绘制坐标
		const shapeEnd: xy = JSON.parse(xyTemplate);
		// 形状需要修改坐标点
		const position = function(Begin: xy, end: xy, BeginTo: xy, EndTo: xy): void {
			[ Begin.x, Begin.y, end.x, end.y ] = [
				Math.min(BeginTo.x, EndTo.x), Math.min(BeginTo.y, EndTo.y),
				Math.max(BeginTo.x, EndTo.x), Math.max(BeginTo.y, EndTo.y)
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
		const textareaInput = function (): void {
			clearInterval(textInterval);
			textInterval = setInterval(()=>{
				opCanvas.value?.initBoard();
				const h = opCanvas.value?.text( {x1:shapeBegin.x, y1:shapeBegin.y, x2:shapeEnd.x, y2:shapeEnd.y}, props.inTextarea );
				if(h > Math.abs(shapeEnd.y - shapeBegin.y)){
					shapeEnd.y = shapeBegin.y + h + 1;
					spotEnd.y = shapeEnd.y;
				}
				twinkle ++;
				if(twinkle >= 20) twinkle -= 20;
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			}, 40)

		}
		onBeforeUnmount(()=>{
			clearInterval(textInterval);
		})

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
				props.bsCanvasFunction && props.bsCanvasFunction('drawDemoLine', spotBegin, spotEnd);
			},
			rectangleMove: function (): void {
				opCanvas.value?.solidBox( shapeBegin, shapeEnd );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			},
			rectangleDraw: function (): void {
				props.bsCanvasFunction && props.bsCanvasFunction('solidBox', shapeBegin, shapeEnd);
			},
			roundMove: function (): void {
				opCanvas.value?.solidRound( shapeBegin, shapeEnd );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			},
			roundDraw: function (): void {
				props.bsCanvasFunction && props.bsCanvasFunction('solidRound', shapeBegin, shapeEnd);
			},
			rightTriangleMove: function(): void {
				opCanvas.value?.Triangle( shapeBegin, shapeEnd, 'solid' );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			},
			rightTriangleDraw: function(): void {
				props.bsCanvasFunction && props.bsCanvasFunction('Triangle', shapeBegin, shapeEnd, 'solid');
			},
			isoscelesMove: function(): void {
				opCanvas.value?.Triangle( shapeBegin, shapeEnd, 'isosceles' );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			},
			isoscelesDraw: function(): void {
				props.bsCanvasFunction && props.bsCanvasFunction('Triangle', shapeBegin, shapeEnd, 'isosceles');
			},
			diamondMove: function(): void {
				opCanvas.value?.drawDiamond( shapeBegin, shapeEnd );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
			},
			diamondDraw: function(): void {
				props.bsCanvasFunction && props.bsCanvasFunction('drawDiamond', shapeBegin, shapeEnd);
			},
			textMove: function(): void {
				opCanvas.value?.text( {x1:shapeBegin.x, y1:shapeBegin.y, x2:shapeEnd.x, y2:shapeEnd.y}, props.inTextarea );
				opCanvas.value?.dottedBox( shapeBegin, shapeEnd );
				textareaInput();
			},
			textDraw: function(): void {
				props.bsCanvasFunction && props.bsCanvasFunction('text', {x1:shapeBegin.x, y1:shapeBegin.y, x2:shapeEnd.x, y2:shapeEnd.y}, props.inTextarea);
			},
			textLeave: function(): void {
				props.getFocus();
				textareaInput();
			}
		}

		// 通过对象映射调用数组
		const mouseNameChange = function (name: string, e: MouseEvent): void {
			// 实现判断当前映射是否在对象内
			// if(Object.prototype.hasOwnProperty.call(mouse, item.tool + name)){
			[ mouse.e.x, mouse.e.y ] = [ e.offsetX, e.offsetY ];
			if (tool !== 'line') {
				position(shapeBegin, shapeEnd, spotBegin ,spotEnd);
			}
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
					clearInterval(textInterval);
					opCanvas.value?.initBoard();
					mouseNameChange('Draw', e);
				} else {    // 进行移动操作
					state = true;
					[ mouse.mobile.x, mouse.mobile.y ] = [ e.offsetX, e.offsetY ];		// 保存初始点
					mouse.e = JSON.parse(JSON.stringify(mouse.mobile));
					if (tool !== 'line') {
						position(spotBegin ,spotEnd, shapeBegin, shapeEnd);
					}
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
			state = false;
		}

		const onMouseup = function (e: MouseEvent): void {
			if ( !controlnode ) {		// 切换状态
				[ spotEnd.x, spotEnd.y ] = [ e.offsetX, e.offsetY ];
				controlnode = true;
			}
			if ( !state ) {
				controlnode = false;
			} else {
				mouseNameChange('Leave', e)
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
				onMouseup={ onMouseup }
         ></CanvasBasice>
    </>)
  }
})
