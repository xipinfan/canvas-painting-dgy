import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 8888
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/export.ts'),
      name: 'CanvasD',
      fileName: (format) => `canvasd.${format}.ts`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'vueJsx'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          vueJsx: 'VueJsx'
        }
      }
    }
  }
})
