
function ChoiceDialog({ onModeSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4">
        <h2 className="text-2xl font-bold text-black mb-4">Select Processing Mode</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Do you want to convert a batch of PDF files or only one PDF?<br />
          <strong className="text-black">Note:</strong> Ensure that the PDFs are named in the format{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-primary-600">[formcode][optional_characters].pdf</code><br />
          <em className="text-gray-500">Examples: ABIC_en.pdf, AAAX.pdf</em>
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-200 hover:border-primary-500 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => onModeSelect('batch')}
          >
            <div className="text-4xl mb-4">📁</div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Batch Process</h3>
              <p className="text-gray-600">Convert multiple PDF files at once</p>
            </div>
          </button>

          <button
            className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-200 hover:border-primary-500 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => onModeSelect('single')}
          >
            <div className="text-4xl mb-4">📄</div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Single PDF</h3>
              <p className="text-gray-600">Convert one PDF file</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChoiceDialog