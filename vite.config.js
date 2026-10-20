import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {
    '/api': {
      target: env.BACKEND_ORIGIN || 'http://127.0.0.1:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api(?=\/|$)/, '') || '/',
    },
  }
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy,
    },
    preview: { proxy },
  }
})
