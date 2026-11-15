import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8081',
      '/users': 'http://localhost:8081',
      '/admin': 'http://localhost:8081',
      '/api': 'http://localhost:8082',
    },
  },
})