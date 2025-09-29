import React from 'react'
import ReactDOM from 'react-dom/client'
import UploadPage from './pages/Upload.tsx'
import './index.css'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { View } from './pages/View.tsx'
import { SideMenuProvider } from './contexts/SideMenuContext.tsx'
import { Home } from './pages/Home.tsx'
import { LibraryPage } from './pages/Library.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <SideMenuProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/view/:page" element={<View />} />
        </Routes>  
      </SideMenuProvider>
    </HashRouter>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
