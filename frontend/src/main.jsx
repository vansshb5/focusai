import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#e8e8e8',
          border: '0.5px solid #2a2a2a',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          borderRadius: '6px',
        },
        success: {
          iconTheme: { primary: '#1D9E75', secondary: '#0e0e0e' },
          duration: 3000,
        },
        error: {
          iconTheme: { primary: '#E24B4A', secondary: '#0e0e0e' },
          duration: 4000,
        },
      }}
    />
    <App />
  </StrictMode>
)