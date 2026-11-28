import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` from the root directory (`../`)
  const env = loadEnv(mode, '../', '');

  // Prefer the build-time API_ORIGIN from Docker/CI, then fall back to the env file.
  const apiOrigin = process.env.API_ORIGIN ?? env.API_ORIGIN;

  return {
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      // Expose the API_ORIGIN explicitly to the client code
      'import.meta.env.API_ORIGIN': JSON.stringify(apiOrigin),
    }
  };
})
