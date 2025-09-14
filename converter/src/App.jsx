import { useState, useEffect } from 'react'
import axios from 'axios'
import ConfigDialog from './components/ConfigDialog'
import ChoiceDialog from './components/ChoiceDialog'
import FileUpload from './components/FileUpload'
import ConversionProgress from './components/ConversionProgress'
import Results from './components/Results'
import './App.css'

const API_BASE_URL = 'http://localhost:5001/api'

function App() {
  const [currentStep, setCurrentStep] = useState('config') // config, choice, upload, processing, results
  const [config, setConfig] = useState(null)
  const [processingMode, setProcessingMode] = useState(null) // 'single' or 'batch'
  const [sessionId, setSessionId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [results, setResults] = useState(null)

  useEffect(() => {
    checkConfig()
  }, [])

  const checkConfig = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`)
      if (response.data.config_exists && response.data.secrets_exists) {
        setConfig(response.data)
        setCurrentStep('choice')
      } else {
        setCurrentStep('config')
      }
    } catch (error) {
      console.error('Error checking config:', error)
      setCurrentStep('config')
    }
  }

  const handleConfigSave = async (configData) => {
    try {
      await axios.post(`${API_BASE_URL}/config`, configData)
      setConfig({ config_exists: true, secrets_exists: true })
      setCurrentStep('choice')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration. Please try again.')
    }
  }

  const handleModeChoice = (mode) => {
    setProcessingMode(mode)
    setCurrentStep('upload')
  }

  const handleFileUpload = async (files) => {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      formData.append('mode', processingMode)

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSessionId(response.data.session_id)
      setUploadedFiles(response.data.files)

      // Start processing
      await axios.post(`${API_BASE_URL}/process/${response.data.session_id}`)
      setCurrentStep('processing')
    } catch (error) {
      console.error('Error uploading files:', error)
      alert(error.response?.data?.error || 'Error uploading files. Please try again.')
    }
  }

  const handleProcessingComplete = (results) => {
    setResults(results)
    setCurrentStep('results')
  }

  const handleRestart = () => {
    setCurrentStep('choice')
    setSessionId(null)
    setUploadedFiles([])
    setResults(null)
    setProcessingMode(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>PDF to AF Converter</h1>
        <p>Convert PDF forms to Adobe Experience Manager Adaptive Forms</p>
      </header>

      <main className="app-main">
        {currentStep === 'config' && (
          <ConfigDialog onSave={handleConfigSave} />
        )}

        {currentStep === 'choice' && (
          <ChoiceDialog onModeSelect={handleModeChoice} />
        )}

        {currentStep === 'upload' && (
          <FileUpload
            mode={processingMode}
            onUpload={handleFileUpload}
            onBack={() => setCurrentStep('choice')}
          />
        )}

        {currentStep === 'processing' && sessionId && (
          <ConversionProgress
            sessionId={sessionId}
            apiBaseUrl={API_BASE_URL}
            onComplete={handleProcessingComplete}
          />
        )}

        {currentStep === 'results' && results && (
          <Results
            results={results}
            onRestart={handleRestart}
            apiBaseUrl={API_BASE_URL}
          />
        )}
      </main>
    </div>
  )
}

export default App
