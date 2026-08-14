import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Three.js is a static import of the entry graph so the shader exists on
        // React's very first render — no lazy chunk means no gap to cover with a
        // placeholder or fade. Splitting it into its own chunk keeps it a
        // *parallel* download: Vite emits a modulepreload link for it, so it
        // fetches alongside the entry chunk instead of queueing behind it.
        manualChunks: (id) => (id.includes("node_modules/three") ? "three" : undefined),
      },
    },
  },
})
