import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mission: resolve(__dirname, 'mission.html'),
        actualites: resolve(__dirname, 'actualites.html'),
        don: resolve(__dirname, 'don.html'),
        contact: resolve(__dirname, 'contact.html'),
      }
    }
  }
});
