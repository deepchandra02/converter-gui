import './Results.css'

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
    <div className="results">
      <div className="results-card">
        <div className="completion-header">
          <div className="completion-icon">🎉</div>
          <h2>Processing Complete!</h2>
          <p>All PDF files have been successfully converted to Adaptive Forms.</p>
        </div>

        <div className="results-summary">
          <h3>Conversion Results</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Files Processed:</span>
              <span className="stat-value">{results.results.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Pages:</span>
              <span className="stat-value">{results.global_stats.total_pages_all_forms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Sections:</span>
              <span className="stat-value">{results.global_stats.total_sections_all_forms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Tokens Used:</span>
              <span className="stat-value">{results.global_stats.total_tokens_all_forms.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Cost:</span>
              <span className="stat-value">${results.global_stats.total_cost_all_forms.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Tokens/Page:</span>
              <span className="stat-value">{averages.avgTokensPerPage}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Cost/Page:</span>
              <span className="stat-value">${averages.avgCostPerPage}</span>
            </div>
          </div>
        </div>

        <div className="file-results">
          <h3>Individual File Results</h3>
          <div className="results-table">
            <div className="table-header">
              <div>Form Code</div>
              <div>Pages</div>
              <div>Sections</div>
              <div>Tokens</div>
              <div>Cost</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {results.results.map((result, index) => (
              <div key={index} className={`table-row ${result.status === 'error' ? 'error-row' : ''}`}>
                <div className="form-code">{result.form_code || result.filename}</div>
                <div>{result.page_count || '-'}</div>
                <div>{result.num_sections || '-'}</div>
                <div>{result.total_tokens ? result.total_tokens.toLocaleString() : '-'}</div>
                <div>{result.total_cost ? `$${result.total_cost.toFixed(4)}` : '-'}</div>
                <div>
                  <span className={`status-badge ${result.status}`}>
                    {result.status === 'completed' ? '✅ Success' : '❌ Error'}
                  </span>
                </div>
                <div className="actions">
                  {result.status === 'completed' && result.package_name && (
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(result.package_name + '.zip')}
                    >
                      Download
                    </button>
                  )}
                  {result.status === 'error' && (
                    <span className="error-message" title={result.error}>
                      {result.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button className="folder-button" onClick={handleOpenOutputFolder}>
            📁 View Output Folder
          </button>
          <button className="restart-button" onClick={onRestart}>
            🔄 Convert More Files
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results