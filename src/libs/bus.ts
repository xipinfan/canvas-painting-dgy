import { reactive } from 'vue';
import { typeBsCanvas } from '../utils/Interface';
type bustype = {
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => void;
};

export const bus: bustype = reactive({
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => null,
});
