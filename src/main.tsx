import React from 'react'
import ReactDOM from 'react-dom/client'
import UploadPage from './pages/Upload.tsx'
import './index.css'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { View } from './pages/View.tsx'
import { SideMenuProvider } from './contexts/SideMenuContext.tsx'
import { HomePage } from './pages/Home.tsx'
import { LibraryPage } from './pages/Library.tsx'
import { CollectionPage } from './pages/Collection.tsx'
import SearchPage from './pages/Search.tsx'
import BookDetailsPage from './pages/BookDetails.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <SideMenuProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/view/:id/:page" element={<View />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/details/book/:id" element={<BookDetailsPage />} />
        </Routes>  
      </SideMenuProvider>
    </HashRouter>
  </React.StrictMode>,
)

// Use contextBridge
// @ts-ignore
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
