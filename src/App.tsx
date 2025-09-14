import FileDropArea from './components/common/FileDropArea'
import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    navigate("/view/1", {
      state: {
        file: file.path
      }
    });
  }

  return (
    <div className="max-w-screen max-h-screen flex items-center justify-center">
      <FileDropArea onFileSelect={handleFile} />
    </div>
  )
}

export default App
