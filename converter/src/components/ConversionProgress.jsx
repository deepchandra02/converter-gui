import { useState, useEffect } from 'react'
import axios from 'axios'

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
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 m-4 border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Conversion Error</h2>
          <div className="flex items-start space-x-4">
            <div className="text-3xl">❌</div>
            <p className="text-black leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
          >
            Restart Application
          </button>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
          <h2 className="text-2xl font-bold text-black mb-6">Initializing...</h2>
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  const isBatch = progress.mode === 'batch'

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {isBatch && (
        <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
          <h2 className="text-2xl font-bold text-black mb-6">Batch Conversion Progress</h2>
          <div className="space-y-4">
            <p className="text-lg text-black">Converting: <span className="font-medium text-primary-600">{progress.current_file || 'Preparing...'}</span></p>
            <p className="text-gray-600">
              File {progress.current_file_index + 1} of {progress.total_files}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Elapsed time: {formatTime(progress.elapsed_time)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
        <h2 className="text-2xl font-bold text-black mb-4">PDF Conversion</h2>
        {progress.current_file && (
          <p className="text-gray-600 mb-6">Converting: <span className="font-medium text-primary-600">{progress.current_file}</span></p>
        )}

        <div className="space-y-3 mb-6">
          {progress.steps.map((step, index) => {
            const stepClass = getStepClass(index, progress.current_step, progress.status);
            const isCompleted = stepClass === 'step-completed';
            const isActive = stepClass === 'step-active';
            const isError = stepClass === 'step-error';

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isCompleted ? 'bg-green-50' :
                  isActive ? 'bg-primary-50' :
                  isError ? 'bg-red-50' : 'bg-gray-50'
                }`}
              >
                <div className="text-2xl">
                  {getStepIcon(index, progress.current_step, progress.status)}
                </div>
                <span className={`font-medium ${
                  isCompleted ? 'text-green-700' :
                  isActive ? 'text-primary-700' :
                  isError ? 'text-red-700' : 'text-gray-500'
                }`}>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-primary-500 to-black h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(progress.current_step / progress.total_steps) * 100}%`
            }}
          ></div>
        </div>

        <p className="text-sm text-gray-500">
          Time: {formatTime(progress.elapsed_time)}
        </p>
      </div>
    </div>
  )
}

export default ConversionProgress