/// <reference types="vitest" />
import { defineConfig } from 'vite'
import fs from 'fs/promises';

export default defineConfig({
  server: {
    port: 4200
  },
  plugins: [{
    name: 'index-html-build-replacement',
    apply: 'build',
    async transformIndexHtml() {
      return await fs.readFile('./index.prod.html', 'utf8');
    }
  }]
})
