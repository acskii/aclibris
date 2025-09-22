import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { View } from './pages/View.tsx'
import { SideMenuProvider } from './contexts/SideMenuContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SideMenuProvider>
        <Routes>
          <Route path="/upload" element={<App />} />
          <Route path="/view/:page" element={<View />} />
        </Routes>  
      </SideMenuProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
