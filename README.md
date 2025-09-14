# PDF to Adaptive Forms Converter

A web-based application that converts PDF forms to Adobe Experience Manager Adaptive Forms using AI-powered form analysis.

## Features

- **Dual Processing Modes**: Convert single PDF files or process multiple PDFs in batch
- **Real-time Progress Tracking**: Monitor conversion progress with detailed step-by-step updates
- **AI-Powered Analysis**: Uses Azure OpenAI to extract form structure and content
- **Configurable Output**: Supports both sandbox and development packaging modes
- **Web Interface**: Modern React-based UI with drag-and-drop file upload
- **Statistics Tracking**: Tracks token usage, costs, and processing metrics

## Architecture

- **Backend**: Flask REST API with endpoints for configuration, file upload, processing, and progress tracking
- **Frontend**: React with Vite for fast development and modern UI components
- **Processing**: Multi-step conversion pipeline with real-time status updates
- **Storage**: Local file system for uploads and generated outputs

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Azure OpenAI API access (key, endpoint, and model)

### Installation

1. **Clone or download the project**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**:
   ```bash
   cd converter
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Use the start script (recommended)
```bash
./start.sh
```

#### Option 2: Manual startup

1. **Start the Flask backend**:
   ```bash
   python app.py
   ```
   The backend will run on http://localhost:5000

2. **Start the React frontend** (in a new terminal):
   ```bash
   cd converter
   npm run dev
   ```
   The frontend will run on http://localhost:5173

### Configuration

On first run, the application will prompt you to configure:

- **Designer T-Number**: Your identifier for tracking modifications
- **Azure OpenAI API Key**: Your API key for accessing OpenAI services
- **Azure OpenAI Endpoint**: Your Azure OpenAI resource endpoint
- **Model Name**: The GPT model to use (e.g., gpt-4)
- **API Version**: Azure OpenAI API version (e.g., 2023-12-01-preview)
- **Packager Mode**: Choose between "sandbox" or "dev" packaging

## Usage

1. **Configure the application** with your API credentials and preferences
2. **Choose processing mode**:
   - **Single PDF**: Convert one PDF file
   - **Batch Process**: Convert multiple PDF files
3. **Upload PDF files**: Drag and drop or browse for files
   - Files must follow the naming convention: `[ABCD][optional_text].pdf` where ABCD is a 4-letter form code
4. **Monitor progress**: Watch real-time conversion progress with detailed steps
5. **Download results**: Access generated Adaptive Form packages and JSON files

## File Naming Convention

PDF files must be named with a 4-letter alphabetic prefix followed by optional characters:
- ✅ `ABIC_en.pdf`
- ✅ `FORM.pdf`
- ✅ `TEST_v2.pdf`
- ❌ `12AB.pdf` (numbers in prefix)
- ❌ `ABC.pdf` (less than 4 letters)

## Output Files

The application generates:
- **JSON files**: Structured form data extracted from PDFs
- **AF packages**: Complete Adaptive Form packages ready for AEM deployment
- **Statistics**: CSV file with processing metrics and costs

## Development Notes

This is a development version with dummy utility functions that simulate:
- PDF to image conversion
- Image segmentation
- GPT chat processing
- AF package generation

In a production environment, these would be replaced with actual implementations that:
- Use proper PDF processing libraries
- Integrate with real Azure OpenAI services
- Generate actual AEM-compatible packages

## Troubleshooting

- **Configuration errors**: Ensure all API credentials are correct
- **File upload issues**: Check that PDF files follow the naming convention
- **Processing errors**: Verify Azure OpenAI API access and quotas
- **Port conflicts**: Default ports are 5000 (Flask) and 5173 (React)

## API Endpoints

- `GET/POST /api/config` - Configuration management
- `POST /api/upload` - File upload and session creation
- `POST /api/process/<session_id>` - Start processing
- `GET /api/progress/<session_id>` - Get processing progress
- `GET /api/results/<session_id>` - Get final results
- `GET /api/download/<filename>` - Download generated files