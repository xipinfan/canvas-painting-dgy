import Theme from 'vitepress/dist/client/theme-default'
import { registerComponents } from './register-components.js';
import { CanvasD, VueEsign } from '../../../src/export'
import 'vitepress-theme-demoblock/theme/styles/index.css';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('CanvasD',CanvasD);
    app.component('VueEsign',VueEsign);
		registerComponents(app)
  }
}
