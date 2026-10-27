import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use the repo sub-path only for production deployments.
// Locally: base = '/' so localhost:5173/ works directly.
// CI (GitHub Actions) or explicit VITE_DEPLOY=true: base = '/buryad-grammar/'
const isProduction = process.env.GITHUB_ACTIONS === 'true' || process.env.VITE_DEPLOY === 'true'
const base = isProduction ? '/buryad-grammar/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
