# NSRR Frontend - Development Guide

## Project Structure

```
NSRR_FRONTEND/
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   │   ├── UploadPanel.svelte
│   │   │   ├── DataPreview.svelte
│   │   │   ├── JsonViewer.svelte
│   │   │   ├── PredictionPanel.svelte
│   │   │   └── LogsPanel.svelte
│   │   ├── services/            # API services
│   │   │   └── apiService.js
│   │   ├── stores/              # Svelte stores
│   │   │   └── dataStore.js
│   │   ├── utils/               # Utility functions
│   │   │   └── fileParser.js
│   │   └── config/              # Configuration
│   │       └── api.config.js
│   ├── routes/                  # SvelteKit pages
│   │   ├── +layout.svelte
│   │   ├── +layout.js
│   │   ├── +page.svelte         # Upload page
│   │   ├── preview/
│   │   │   └── +page.svelte
│   │   ├── predict/
│   │   │   └── +page.svelte
│   │   └── logs/
│   │       └── +page.svelte
│   ├── app.css                  # Global styles
│   └── app.html                 # HTML template
├── package.json
├── svelte.config.js
└── vite.config.js
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

### Backend API Configuration

Edit `src/lib/config/api.config.js`:

```javascript
export const API_CONFIG = {
	baseURL: 'http://localhost:5000',  // Your backend URL
	endpoints: {
		ingest: '/api/data/ingest',
		predict: '/api/predict'
	},
	timeout: 30000,
	maxFileSize: 50 * 1024 * 1024  // 50MB
};
```

## Features

### 1. File Upload
- Drag & drop or browse to upload files
- Supported formats: PDF, CSV, XLSX, XLS, JSON
- Client-side validation (file type and size)
- Real-time upload status

### 2. Data Preview
- **Table view** for CSV/Excel files with pagination
- **Text view** for PDF files
- **JSON tree** for JSON files
- Responsive and scrollable

### 3. JSON Viewer
- Display normalized JSON payload
- Copy to clipboard
- Download as JSON file

### 4. Backend Communication
- POST data to `/api/data/ingest`
- POST predictions to `/api/predict`
- Error handling and retry logic
- Loading states

### 5. Prediction Interface
- Manual input mode (form-based)
- Upload dataset mode (batch prediction)
- Results display (table or single result)
- Support for confidence scores and errors

### 6. Activity Logs
- Track all system activities
- Filter by type (info, success, error, warning)
- Timestamps and details
- Clear logs functionality

## File Parsing

The application includes client-side parsers for:

- **CSV**: Uses PapaParse library
- **Excel**: Uses XLSX library
- **PDF**: Basic text extraction
- **JSON**: Native JSON.parse with validation

## State Management

Uses Svelte stores for global state:

- `dataStore`: File, parsed data, normalized JSON
- `logsStore`: Activity logs

## Styling

Clean, academic theme with:
- Light/dark mode support (CSS variables)
- Responsive design
- Loading skeletons
- Error/success states

## Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required

## Notes

- For PDF parsing in production, consider using pdf.js library
- Backend must support CORS for cross-origin requests
- File size limit is configurable in api.config.js
