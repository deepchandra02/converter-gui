
function Results({ results, onRestart, apiBaseUrl }) {
  const handleDownload = (filename) => {
    window.open(`${apiBaseUrl}/download/${filename}`, '_blank')
  }

  const handleOpenOutputFolder = () => {
    // In a real application, this would open the file manager
    alert('In a desktop application, this would open the outputs folder in your file manager.')
  }

  const calculateAverages = () => {
    if (results.global_stats.total_pages_all_forms === 0) {
      return { avgTokensPerPage: 0, avgCostPerPage: 0 }
    }

    return {
      avgTokensPerPage: (results.global_stats.total_tokens_all_forms / results.global_stats.total_pages_all_forms).toFixed(2),
      avgCostPerPage: (results.global_stats.total_cost_all_forms / results.global_stats.total_pages_all_forms).toFixed(4)
    }
  }

  const averages = calculateAverages()

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-black mb-2">Processing Complete!</h2>
          <p className="text-gray-600 text-lg">All PDF files have been successfully converted to Adaptive Forms.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Conversion Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-1">Files Processed</div>
              <div className="text-2xl font-bold text-primary-700">{results.results.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 font-medium mb-1">Total Pages</div>
              <div className="text-2xl font-bold text-black">{results.global_stats.total_pages_all_forms}</div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-1">Total Sections</div>
              <div className="text-2xl font-bold text-primary-700">{results.global_stats.total_sections_all_forms}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 font-medium mb-1">Total Tokens</div>
              <div className="text-2xl font-bold text-black">{results.global_stats.total_tokens_all_forms.toLocaleString()}</div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-1">Total Cost</div>
              <div className="text-2xl font-bold text-primary-700">${results.global_stats.total_cost_all_forms.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 font-medium mb-1">Avg Tokens/Page</div>
              <div className="text-2xl font-bold text-black">{averages.avgTokensPerPage}</div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-1">Avg Cost/Page</div>
              <div className="text-2xl font-bold text-primary-700">${averages.avgCostPerPage}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Individual File Results</h3>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 rounded-t-lg font-semibold text-black">
                <div>Form Code</div>
                <div>Pages</div>
                <div>Sections</div>
                <div>Tokens</div>
                <div>Cost</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {results.results.map((result, index) => (
                <div key={index} className={`grid grid-cols-7 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 ${
                  result.status === 'error' ? 'bg-red-50 border-red-200' : ''
                }`}>
                  <div className="font-medium text-black">{result.form_code || result.filename}</div>
                  <div className="text-gray-600">{result.page_count || '-'}</div>
                  <div className="text-gray-600">{result.num_sections || '-'}</div>
                  <div className="text-gray-600">{result.total_tokens ? result.total_tokens.toLocaleString() : '-'}</div>
                  <div className="text-gray-600">{result.total_cost ? `$${result.total_cost.toFixed(4)}` : '-'}</div>
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status === 'completed' ? '✅ Success' : '❌ Error'}
                    </span>
                  </div>
                  <div>
                    {result.status === 'completed' && result.package_name && (
                      <button
                        className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded hover:bg-primary-600 transition-colors"
                        onClick={() => handleDownload(result.package_name + '.zip')}
                      >
                        Download
                      </button>
                    )}
                    {result.status === 'error' && (
                      <span className="text-xs text-red-600 truncate" title={result.error}>
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
            onClick={handleOpenOutputFolder}
          >
            📁 View Output Folder
          </button>
          <button
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
            onClick={onRestart}
          >
            🔄 Convert More Files
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results