import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const env = loadEnv('', process.cwd(), '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': JSON.stringify(env),
  }
})
