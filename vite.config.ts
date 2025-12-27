import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace '[YOUR-REPO-NAME]' with your actual repository name on GitHub
  base: '/[YOUR-REPO-NAME]/',
  build: {
    outDir: 'dist',
  },
});