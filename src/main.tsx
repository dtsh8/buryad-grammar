import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Restore path after GitHub Pages 404 redirect
;(function () {
  const search = window.location.search
  if (search.startsWith('?p=')) {
    const path = decodeURIComponent(search.slice(3))
    window.history.replaceState(null, '', import.meta.env.BASE_URL + path.replace(/^\//, ''))
  }
})()

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found in DOM')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
