import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vite.dev/config/
export default defineConfig({
  // 如果你使用的是项目页面 (例如: https://username.github.io/repo-name)，请取消注释下面的行并替换为你的仓库名称
  base: '/demos/',
  plugins: [
    vue(),
    codeInspectorPlugin({
      bundler: 'vite'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
