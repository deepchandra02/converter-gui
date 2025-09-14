import { useState } from 'react'
import './ConfigDialog.css'

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
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="config-dialog">
      <div className="config-card">
        <h2>Configuration Setup</h2>
        <p>Please provide your Azure OpenAI API details and designer information.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="t_number">Designer T-Number:</label>
            <input
              type="text"
              id="t_number"
              name="t_number"
              value={formData.t_number}
              onChange={handleChange}
              className={errors.t_number ? 'error' : ''}
              placeholder="e.g., T123456"
            />
            {errors.t_number && <span className="error-message">{errors.t_number}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="api_key">Azure OpenAI API Key:</label>
            <input
              type="password"
              id="api_key"
              name="api_key"
              value={formData.api_key}
              onChange={handleChange}
              className={errors.api_key ? 'error' : ''}
              placeholder="Your API key"
            />
            {errors.api_key && <span className="error-message">{errors.api_key}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endpoint">Azure OpenAI Endpoint:</label>
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              className={errors.endpoint ? 'error' : ''}
              placeholder="https://your-resource.openai.azure.com/"
            />
            {errors.endpoint && <span className="error-message">{errors.endpoint}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="model_name">Model Name:</label>
            <input
              type="text"
              id="model_name"
              name="model_name"
              value={formData.model_name}
              onChange={handleChange}
              className={errors.model_name ? 'error' : ''}
              placeholder="e.g., gpt-4"
            />
            {errors.model_name && <span className="error-message">{errors.model_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="api_version">API Version:</label>
            <input
              type="text"
              id="api_version"
              name="api_version"
              value={formData.api_version}
              onChange={handleChange}
              className={errors.api_version ? 'error' : ''}
              placeholder="e.g., 2023-12-01-preview"
            />
            {errors.api_version && <span className="error-message">{errors.api_version}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="packager_mode">Packager Mode:</label>
            <select
              id="packager_mode"
              name="packager_mode"
              value={formData.packager_mode}
              onChange={handleChange}
            >
              <option value="sandbox">Sandbox</option>
              <option value="dev">Development</option>
            </select>
          </div>

          <button type="submit" className="save-button">
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConfigDialog