import { useState, useEffect } from 'react'
import axios from 'axios'
import './ConversionProgress.css'

function ConversionProgress({ sessionId, apiBaseUrl, onComplete }) {
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const pollProgress = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/progress/${sessionId}`)
        const progressData = response.data

        setProgress(progressData)

        if (progressData.status === 'completed') {
          // Fetch final results
          const resultsResponse = await axios.get(`${apiBaseUrl}/results/${sessionId}`)
          onComplete(resultsResponse.data)
        } else if (progressData.status === 'error') {
          setError(progressData.error_message || 'An error occurred during processing')
        }
      } catch (error) {
        console.error('Error polling progress:', error)
        setError('Failed to get progress updates')
      }
    }

    // Poll every 1 second
    const interval = setInterval(pollProgress, 1000)

    // Initial poll
    pollProgress()

    return () => clearInterval(interval)
  }, [sessionId, apiBaseUrl, onComplete])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStepIcon = (stepIndex, currentStep, status) => {
    if (status === 'error') {
      return '❌'
    } else if (stepIndex < currentStep) {
      return '✅'
    } else if (stepIndex === currentStep && status === 'processing') {
      return '🔄'
    } else {
      return '⭕'
    }
  }

  const getStepClass = (stepIndex, currentStep, status) => {
    if (status === 'error') {
      return 'step-error'
    } else if (stepIndex < currentStep) {
      return 'step-completed'
    } else if (stepIndex === currentStep && status === 'processing') {
      return 'step-active'
    } else {
      return 'step-pending'
    }
  }

  if (error) {
    return (
      <div className="conversion-progress">
        <div className="progress-card error-card">
          <h2>Conversion Error</h2>
          <div className="error-message">
            <div className="error-icon">❌</div>
            <p>{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="retry-button">
            Restart Application
          </button>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="conversion-progress">
        <div className="progress-card">
          <h2>Initializing...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  const isBatch = progress.mode === 'batch'

  return (
    <div className="conversion-progress">
      {isBatch && (
        <div className="batch-progress-card">
          <h2>Batch Conversion Progress</h2>
          <div className="batch-info">
            <p>Converting: {progress.current_file || 'Preparing...'}</p>
            <p className="file-counter">
              File {progress.current_file_index + 1} of {progress.total_files}
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
            <p className="elapsed-time">
              Elapsed time: {formatTime(progress.elapsed_time)}
            </p>
          </div>
        </div>
      )}

      <div className="conversion-card">
        <h2>PDF Conversion</h2>
        {progress.current_file && (
          <p className="current-file">Converting: {progress.current_file}</p>
        )}

        <div className="steps-container">
          {progress.steps.map((step, index) => (
            <div
              key={index}
              className={`step-item ${getStepClass(index, progress.current_step, progress.status)}`}
            >
              <div className="step-icon">
                {getStepIcon(index, progress.current_step, progress.status)}
              </div>
              <div className="step-content">
                <span className="step-text">{step}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="conversion-progress-bar">
          <div
            className="conversion-progress-fill"
            style={{
              width: `${(progress.current_step / progress.total_steps) * 100}%`
            }}
          ></div>
        </div>

        <p className="conversion-time">
          Time: {formatTime(progress.elapsed_time)}
        </p>
      </div>
    </div>
  )
}

export default ConversionProgress