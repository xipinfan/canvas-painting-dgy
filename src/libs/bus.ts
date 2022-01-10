import { reactive } from 'vue';
import { typeBsCanvas } from '../utils/Interface';
type bustype = {
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => void;
  middleCanvas: HTMLCanvasElement;
  middleCanvasCtx: CanvasRenderingContext2D | null;
};

export const bus: bustype = reactive({
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => null,
  middleCanvas: document.createElement('canvas'),
  middleCanvasCtx: null,
});

bus.middleCanvasCtx = bus.middleCanvas.getContext('2d');
