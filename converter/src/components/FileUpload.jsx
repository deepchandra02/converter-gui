import { useState, useRef } from 'react'
import './FileUpload.css'

function FileUpload({ mode, onUpload, onBack }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const validateFileName = (filename) => {
    // Check if filename has .pdf extension and first 4 characters are alphabetic
    const nameWithoutExt = filename.toLowerCase().replace('.pdf', '')
    return filename.toLowerCase().endsWith('.pdf') &&
           nameWithoutExt.length >= 4 &&
           /^[a-zA-Z]{4}/.test(nameWithoutExt)
  }

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    const validFiles = []
    const invalidFiles = []

    fileArray.forEach(file => {
      if (validateFileName(file.name)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    if (invalidFiles.length > 0) {
      alert(`Invalid filename format for: ${invalidFiles.join(', ')}\n\nFilenames must:\n- End with .pdf\n- Have first 4 characters as letters (e.g., ABIC_en.pdf)`)
      return
    }

    if (mode === 'single' && validFiles.length > 1) {
      alert('Please select only one file for single mode conversion.')
      return
    }

    setSelectedFiles(validFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file.')
      return
    }

    onUpload(selectedFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="file-upload">
      <div className="upload-card">
        <h2>Upload PDF Files</h2>
        <p className="mode-indicator">
          Mode: <strong>{mode === 'batch' ? 'Batch Processing' : 'Single File'}</strong>
        </p>

        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <h3>
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                : 'Drop PDF files here or click to browse'
              }
            </h3>
            <p>
              {mode === 'batch'
                ? 'Select multiple PDF files for batch processing'
                : 'Select a single PDF file'
              }
            </p>
            <p className="file-requirements">
              <strong>Requirements:</strong> Files must be named like ABIC_en.pdf (4 letters + optional characters)
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf"
          multiple={mode === 'batch'}
          style={{ display: 'none' }}
        />

        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files:</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="upload-actions">
          <button className="back-button" onClick={onBack}>
            Back
          </button>
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            Start Conversion
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload