import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` from the root directory (`../`)
  const env = loadEnv(mode, '../', '');

  return {
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      // Expose the API_ORIGIN explicitly to the client code
      'import.meta.env.API_ORIGIN': JSON.stringify(env.API_ORIGIN),
    }
  };
})
