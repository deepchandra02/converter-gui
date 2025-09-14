import './ChoiceDialog.css'

function ChoiceDialog({ onModeSelect }) {
  return (
    <div className="choice-dialog">
      <div className="choice-card">
        <h2>Select Processing Mode</h2>
        <p className="instruction-text">
          Do you want to convert a batch of PDF files or only one PDF?<br />
          <strong>Note:</strong> Ensure that the PDFs are named in the format{' '}
          <code>[formcode][optional_characters].pdf</code><br />
          <em>Examples: ABIC_en.pdf, AAAX.pdf</em>
        </p>

        <div className="choice-buttons">
          <button
            className="choice-button batch-button"
            onClick={() => onModeSelect('batch')}
          >
            <div className="button-icon">📁</div>
            <div className="button-content">
              <h3>Batch Process</h3>
              <p>Convert multiple PDF files at once</p>
            </div>
          </button>

          <button
            className="choice-button single-button"
            onClick={() => onModeSelect('single')}
          >
            <div className="button-icon">📄</div>
            <div className="button-content">
              <h3>Single PDF</h3>
              <p>Convert one PDF file</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChoiceDialog