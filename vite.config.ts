import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In production Firebase Hosting rewrites this path to the `contact`
      // function. In dev it goes to the Functions emulator; start it with
      // `npm --prefix functions run serve`.
      "/api/contact": {
        target: "http://127.0.0.1:5001",
        rewrite: () => "/portfolio-cf811/us-central1/contact",
      },
    },
  },
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
