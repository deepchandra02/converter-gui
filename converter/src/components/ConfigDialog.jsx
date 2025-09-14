import { useState } from 'react'

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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
        <h2 className="text-2xl font-bold text-black mb-2">Configuration Setup</h2>
        <p className="text-black mb-6">Please provide your Azure OpenAI API details and designer information.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="t_number" className="block mb-2 font-semibold text-black">Designer T-Number:</label>
            <input
              type="text"
              id="t_number"
              name="t_number"
              value={formData.t_number}
              onChange={handleChange}
              className={`w-full px-3 py-3 border-2 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500 ${
                errors.t_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., T123456"
            />
            {errors.t_number && <span className="text-red-500 text-sm mt-1 block">{errors.t_number}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="api_key" className="block mb-2 font-semibold text-black">Azure OpenAI API Key:</label>
            <input
              type="password"
              id="api_key"
              name="api_key"
              value={formData.api_key}
              onChange={handleChange}
              className={`w-full px-3 py-3 border-2 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500 ${
                errors.api_key ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your API key"
            />
            {errors.api_key && <span className="text-red-500 text-sm mt-1 block">{errors.api_key}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="endpoint" className="block mb-2 font-semibold text-black">Azure OpenAI Endpoint:</label>
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              className={`w-full px-3 py-3 border-2 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500 ${
                errors.endpoint ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://your-resource.openai.azure.com/"
            />
            {errors.endpoint && <span className="text-red-500 text-sm mt-1 block">{errors.endpoint}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="model_name" className="block mb-2 font-semibold text-black">Model Name:</label>
            <input
              type="text"
              id="model_name"
              name="model_name"
              value={formData.model_name}
              onChange={handleChange}
              className={`w-full px-3 py-3 border-2 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500 ${
                errors.model_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., gpt-4"
            />
            {errors.model_name && <span className="text-red-500 text-sm mt-1 block">{errors.model_name}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="api_version" className="block mb-2 font-semibold text-black">API Version:</label>
            <input
              type="text"
              id="api_version"
              name="api_version"
              value={formData.api_version}
              onChange={handleChange}
              className={`w-full px-3 py-3 border-2 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500 ${
                errors.api_version ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2023-12-01-preview"
            />
            {errors.api_version && <span className="text-red-500 text-sm mt-1 block">{errors.api_version}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="packager_mode" className="block mb-2 font-semibold text-black">Packager Mode:</label>
            <select
              id="packager_mode"
              name="packager_mode"
              value={formData.packager_mode}
              onChange={handleChange}
              className="w-full px-3 py-3 border-2 border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-primary-500"
            >
              <option value="sandbox">Sandbox</option>
              <option value="dev">Development</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary-500 text-white text-base font-semibold rounded-md transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConfigDialog