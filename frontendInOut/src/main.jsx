import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { AuthProvider } from './context/AuthProvider.jsx'
import App2 from './App2.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NextUIProvider>
        <BrowserRouter>
          <App2 />
        </BrowserRouter>
      </NextUIProvider>
    </AuthProvider>
  </React.StrictMode>
)
