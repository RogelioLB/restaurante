// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, '/login/login.html'),
        signup: resolve(__dirname, '/signup/signup.html'),
      }
    },
  },
});
