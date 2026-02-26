import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/dashboard': {
        target: 'https://dashboard.stellar.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dashboard/, '/api'),
      },
      '/api/statuspage': {
        target: 'https://9sl3dhr1twv1.statuspage.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statuspage/, '/api'),
      },
    },
  },
})
