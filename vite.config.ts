import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use sub-path base only in CI (GitHub Pages deployment).
// Locally the app is served from root so localhost:5173/ just works.
const base = process.env.GITHUB_ACTIONS ? '/buryad-grammar/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
