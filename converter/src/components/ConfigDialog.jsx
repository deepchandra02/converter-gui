import { useState, useEffect, useRef } from 'react'
import { animate, createScope } from 'animejs'

function ConfigDialog({ onSave }) {
  const [formData, setFormData] = useState({
    t_number: '',
    api_key: '',
    endpoint: '',
    model_name: '',
    api_version: '',
    packager_mode: 'sandbox'
  })

  const [errors, setErrors] = useState({})
  const rootRef = useRef(null)
  const scope = useRef(null)

  useEffect(() => {
    scope.current = createScope({ root: rootRef }).add(self => {

      // Set initial styles
      animate('.form-container', {
        opacity: 0,
        translateY: 30,
        scale: 0.95,
        duration: 0
      })

      animate('.form-title', {
        opacity: 0,
        translateY: 30,
        duration: 0
      })

      animate('.form-field', {
        opacity: 0,
        translateY: 30,
        duration: 0
      })

      animate('.form-button', {
        opacity: 0,
        translateY: 30,
        duration: 0
      })

      // Entrance animations
      setTimeout(() => {
        // Form container
        animate('.form-container', {
          opacity: 1,
          translateY: 0,
          scale: 1,
          duration: 600,
          easing: 'spring(1, 80, 10, 0)'
        })

        // Title
        setTimeout(() => {
          animate('.form-title', {
            opacity: 1,
            translateY: 0,
            duration: 400,
            easing: 'out(2)'
          })
        }, 200)

        // Fields with stagger
        setTimeout(() => {
          animate('.form-field', {
            opacity: 1,
            translateY: 0,
            duration: 400,
            delay: (el, i) => i * 100,
            easing: 'out(2)'
          })
        }, 400)

        // Button
        setTimeout(() => {
          animate('.form-button', {
            opacity: 1,
            translateY: 0,
            duration: 400,
            easing: 'out(2)'
          })
        }, 700)
      }, 100)

      // Register methods for interactions
      self.add('focusField', (target) => {
        animate(target, {
          scale: 1.02,
          duration: 200,
          easing: 'out(2)'
        })
      })

      self.add('blurField', (target) => {
        animate(target, {
          scale: 1,
          duration: 200,
          easing: 'out(2)'
        })
      })

      self.add('shakeField', (target) => {
        animate(target, {
          translateX: [-10, 10, -5, 5, 0],
          duration: 500,
          easing: 'outElastic(1, 0.6)'
        })
      })

      self.add('hoverButton', (target) => {
        animate(target, {
          scale: 1.05,
          duration: 200,
          easing: 'out(2)'
        })
      })

      self.add('leaveButton', (target) => {
        animate(target, {
          scale: 1,
          duration: 200,
          easing: 'out(2)'
        })
      })

      self.add('clickButton', (target) => {
        animate(target, {
          scale: [0.95, 1],
          duration: 300,
          easing: 'outElastic(1, 0.6)'
        })
      })
    })

    return () => scope.current.revert()
  }, [])

  const animateInputFocus = (element) => {
    if (scope.current) {
      scope.current.methods.focusField(element)
    }
  }

  const animateInputBlur = (element) => {
    if (scope.current) {
      scope.current.methods.blurField(element)
    }
  }

  const animateError = (element) => {
    if (scope.current) {
      scope.current.methods.shakeField(element)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.t_number.trim()) {
      newErrors.t_number = 'T-number is required'
    }

    if (!formData.api_key.trim()) {
      newErrors.api_key = 'API key is required'
    }

    if (!formData.endpoint.trim()) {
      newErrors.endpoint = 'Endpoint is required'
    }

    if (!formData.model_name.trim()) {
      newErrors.model_name = 'Model name is required'
    }

    if (!formData.api_version.trim()) {
      newErrors.api_version = 'API version is required'
    }

    setErrors(newErrors)

    // Animate fields with errors
    if (Object.keys(newErrors).length > 0) {
      Object.keys(newErrors).forEach(fieldName => {
        const fieldElement = document.querySelector(`[name="${fieldName}"]`)
        if (fieldElement) {
          animateError(fieldElement)
        }
      })
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div ref={rootRef} className="w-full max-w-2xl mx-auto">
      <div className="form-container bg-white rounded-xl shadow-2xl p-8 m-4">
        <div className="form-title">
          <h2 className="text-2xl font-bold text-black mb-2">Configuration Setup</h2>
          <p className="text-black mb-6">Please provide your Azure OpenAI API details and designer information.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="t_number" className="block mb-2 font-semibold text-black">Designer T-Number:</label>
            <input
              className={`form-field w-full px-3 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300 ${
                errors.t_number ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              id="t_number"
              name="t_number"
              value={formData.t_number}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
              placeholder="e.g., T123456"
            />
            {errors.t_number && <span className="text-red-500 text-sm mt-1 block">{errors.t_number}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="api_key" className="block mb-2 font-semibold text-black">Azure OpenAI API Key:</label>
            <input
              className={`form-field w-full px-3 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300 ${
                errors.api_key ? 'border-red-500' : 'border-gray-300'
              }`}
              type="password"
              id="api_key"
              name="api_key"
              value={formData.api_key}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
              placeholder="Your API key"
            />
            {errors.api_key && <span className="text-red-500 text-sm mt-1 block">{errors.api_key}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="endpoint" className="block mb-2 font-semibold text-black">Azure OpenAI Endpoint:</label>
            <input
              className={`form-field w-full px-3 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300 ${
                errors.endpoint ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              id="endpoint"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
              placeholder="https://your-resource.openai.azure.com/"
            />
            {errors.endpoint && <span className="text-red-500 text-sm mt-1 block">{errors.endpoint}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="model_name" className="block mb-2 font-semibold text-black">Model Name:</label>
            <input
              className={`form-field w-full px-3 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300 ${
                errors.model_name ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              id="model_name"
              name="model_name"
              value={formData.model_name}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
              placeholder="e.g., gpt-4"
            />
            {errors.model_name && <span className="text-red-500 text-sm mt-1 block">{errors.model_name}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="api_version" className="block mb-2 font-semibold text-black">API Version:</label>
            <input
              className={`form-field w-full px-3 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300 ${
                errors.api_version ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              id="api_version"
              name="api_version"
              value={formData.api_version}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
              placeholder="e.g., 2023-12-01-preview"
            />
            {errors.api_version && <span className="text-red-500 text-sm mt-1 block">{errors.api_version}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="packager_mode" className="block mb-2 font-semibold text-black">Packager Mode:</label>
            <select
              className="form-field w-full px-3 py-3 border-2 border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-primary-500 hover:border-primary-300"
              id="packager_mode"
              name="packager_mode"
              value={formData.packager_mode}
              onChange={handleChange}
              onFocus={(e) => animateInputFocus(e.target)}
              onBlur={(e) => animateInputBlur(e.target)}
            >
              <option value="sandbox">Sandbox</option>
              <option value="dev">Development</option>
            </select>
          </div>

          <button
            type="submit"
            className="form-button w-full px-6 py-3 bg-primary-500 text-white text-base font-semibold rounded-md transition-all duration-200 hover:bg-primary-600 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform"
            onMouseEnter={(e) => {
              if (scope.current) {
                scope.current.methods.hoverButton(e.target)
              }
            }}
            onMouseLeave={(e) => {
              if (scope.current) {
                scope.current.methods.leaveButton(e.target)
              }
            }}
            onClick={(e) => {
              if (scope.current) {
                scope.current.methods.clickButton(e.target)
              }
            }}
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConfigDialog