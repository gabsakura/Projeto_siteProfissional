import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/@mui/material/') ||
            id.includes('node_modules/@emotion/react/') ||
            id.includes('node_modules/@emotion/styled/')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0'
  }
})
