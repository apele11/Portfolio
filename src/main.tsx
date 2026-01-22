import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<script type="module" src="./firebase.js"></script>
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
