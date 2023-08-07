import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/weight-tracker/'
  : '/',
  assetsPublicPath: process.env.NODE_ENV === 'production'
  ? '/weight-tracker/'
  : '/',
  plugins: [vue()],
})
