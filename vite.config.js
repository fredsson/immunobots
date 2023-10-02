/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 4200
  },
  build: {
    rollupOptions: {
      input: {
        app: './index.prod.html'
      },
    }
  },
  plugins: [{
    name: 'renameIndex',
    enforce: 'post',
    generateBundle(options, bundle) {
      const indexHtml = bundle['index.prod.html'];
      indexHtml.fileName = 'index.html';
    },
  }]
})
