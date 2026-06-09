import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is set for production builds so assets resolve correctly when the
// site is served from the GitHub Pages project sub-path
// (https://<user>.github.io/Beyondthegame/). Dev server stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Beyondthegame/' : '/',
  plugins: [react()],
}))
