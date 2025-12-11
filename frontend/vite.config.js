// frontend/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  // load ESM-only plugin dynamically so bundler doesn't try to require() it
  const reactPlugin = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [reactPlugin()],
    server: {
      port: 5173
    }
  };
});
