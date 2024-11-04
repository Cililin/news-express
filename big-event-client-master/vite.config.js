import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': { //获取路径中包含/api的请求
        target: 'http://localhost:9090', //后台服务所在的源
        changeOrigin: true, //修改源
        rewrite: path => path.replace(/^\/api/, '') //将api替换成空字符串
      }
    }
  }
})