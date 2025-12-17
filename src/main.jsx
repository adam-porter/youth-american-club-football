import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Import Uniform styles in the correct order
import '@adam-porter/shared-uniform-styles/src/uniform-design-tokens.css'
import '@adam-porter/shared-uniform-styles/src/index.css'
import '@adam-porter/shared-uniform-styles/src/uniform-design-system.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

