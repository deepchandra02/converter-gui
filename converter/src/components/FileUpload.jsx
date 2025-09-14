import { useState, useRef } from 'react'

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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
        <h2 className="text-2xl font-bold text-black mb-2">Upload PDF Files</h2>
        <p className="text-black mb-6">
          Mode: <strong className="text-primary-600">{mode === 'batch' ? 'Batch Processing' : 'Single File'}</strong>
        </p>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : selectedFiles.length > 0
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-black mb-2">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
              : 'Drop PDF files here or click to browse'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {mode === 'batch'
              ? 'Select multiple PDF files for batch processing'
              : 'Select a single PDF file'
            }
          </p>
          <p className="text-sm text-gray-500">
            <strong>Requirements:</strong> Files must be named like ABIC_en.pdf (4 letters + optional characters)
          </p>
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
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-black mb-3">Selected Files:</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-black">{file.name}</span>
                  <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-3 bg-gray-200 text-black text-base font-semibold rounded-md transition-colors hover:bg-gray-300"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="px-6 py-3 bg-primary-500 text-white text-base font-semibold rounded-md transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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