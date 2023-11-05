import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src/'),
    },
  },
  plugins: [vue()],
});
