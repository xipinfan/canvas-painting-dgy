import { reactive } from 'vue';
import { typeBsCanvas } from '../utils/Interface';
type bustype = {
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => void;
  savemiddle: () => Promise<boolean>;
  middleImage: HTMLImageElement;
};

export const bus: bustype = reactive({
  bsCanvasFunction: (type: typeBsCanvas, ...parameters: any[]) => null,
  savemiddle: () => Promise.resolve(true),
  middleImage: new Image(),
});
