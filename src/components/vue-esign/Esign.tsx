import { defineComponent, ref, onMounted, reactive } from 'vue';
import canvasTool from './canvas-tool';

interface Dot {
  x: number;
  y: number;
}
interface pageDistance {
  left: number;
  top: number;
}
interface diff {
  difference: number;
  negative: number;
}

const vueEsign = defineComponent({
  name: 'TSign',
  inheritAttrs: false,
  props: {
    // 画布宽度
    width: {
      type: Number,
      default: 800,
    },
    // 画布高度
    height: {
      type: Number,
      default: 300,
    },
    // 画笔大小
    lineWidth: {
      type: Number,
      default: 4,
    },
    // 画笔颜色
    lineColor: {
      type: String,
      default: '#000000',
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '',
    },
    // 是否裁切
    isCrop: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    let use = false;
    const esignCanvas = ref<HTMLCanvasElement | null>(null);
    const esignTool = ref();
    const markPress = ref<boolean>(false);
    const distance:pageDistance = reactive({
      left: 0,
      top: 0,
    });
    const lastDot:Dot = reactive({
      x: 0,
      y: 0,
    });

    // 按下鼠标或者触摸屏幕
    const moveStart = function (e: Touch | MouseEvent): void {
      use = true;
      if(!esignCanvas.value)return;
      // 计算当前标签与屏幕左上角的距离
      [distance.left, distance.top] = [
        esignCanvas.value.getBoundingClientRect().left + document.documentElement.scrollLeft,
        esignCanvas.value.getBoundingClientRect().top + document.documentElement.scrollTop,
      ];

      const currentDot: Dot = {
        x: e.pageX,
        y: e.pageY,
      };

      markPress.value = true;
      // 通过绘制多个圆的方式绘制线
      esignTool.value.drawArc(currentDot.x - distance.left, currentDot.y - distance.top);
      [lastDot.x, lastDot.y] = [currentDot.x, currentDot.y];
    };

    // 鼠标移动或者手指移动
    const moveIn = function (e: Touch | MouseEvent): void {
      const currentDot: Dot = {
        x: e.pageX,
        y: e.pageY,
      };
      if (markPress.value) {
        // 计算两个点坐标的差值并累加绘制
        const conversion = function (difference: number): diff {
          if (difference < 0) {
            return { difference: -difference, negative: -1 };
          }
          return { difference: difference, negative: 1 };
        };

        let differenceX: number = currentDot.x - lastDot.x;
        let differenceY: number = currentDot.y - lastDot.y;
        let negativeX: diff = conversion(differenceX);
        let negativeY: diff = conversion(differenceY);
        let maxDistance: number = Math.max(negativeX.difference, negativeY.difference);
        // 找到当前差值最大的点，等比例遍历绘制
        for (let i = 1; i <= maxDistance; i += 1) {
          esignTool.value.drawArc(
            lastDot.x + (negativeX.difference / maxDistance) * i * negativeX.negative - distance.left,
            lastDot.y + (negativeY.difference / maxDistance) * i * negativeY.negative - distance.top,
          );
        }
        // 更新初始点
        [lastDot.x, lastDot.y] = [currentDot.x, currentDot.y];
      }
    };

    // 鼠标松开或者手指拿开
    const moveEnd = function (e: Touch | MouseEvent): void {
      markPress.value = false;
    };

    // 初始化工具类
    onMounted((): void => {
      if(!esignCanvas.value)return;
      esignTool.value = canvasTool(esignCanvas.value, props);
    });
    // 导出函数
    expose({
      // 清空画布
      reset: (): void => {
        esignTool.value.reset();
      },
      // 保存图片
      generate: (): Promise<string> => {
        return esignTool.value.generate(use);
      },
    });

    return () => (
      <canvas
        ref={esignCanvas}
        onTouchstart={(e: TouchEvent): void => {
          e.preventDefault();
          moveStart(e.touches[0]);
        }}
        onTouchmove={(e: TouchEvent): void => {
          e.preventDefault();
          moveIn(e.touches[0]);
        }}
        onTouchend={(e: TouchEvent): void => {
          e.preventDefault();
          moveEnd(e.touches[0]);
        }}
        onMousedown={moveStart}
        onMousemove={moveIn}
        onMouseup={moveEnd}
        onMouseout={moveEnd}
      ></canvas>
    );
  },
});

export default vueEsign;
