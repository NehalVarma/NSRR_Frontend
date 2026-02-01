# NSRR Frontend - Quick Start Guide

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd NSRR_FRONTEND
npm install
```

### 2. Configure Backend URL (Optional)

Copy the environment example file:

```bash
copy .env.example .env
```

Edit `.env` to set your backend URL:

```
VITE_API_BASE_URL=http://localhost:5000
```

Or directly edit `src/lib/config/api.config.js`.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Project Overview

### Key Components

1. **UploadPanel** - Drag & drop file upload with validation
2. **DataPreview** - Display parsed data (tables, text, JSON)
3. **JsonViewer** - Show normalized JSON with copy/download
4. **PredictionPanel** - Run predictions (manual or batch)
5. **LogsPanel** - Track all system activities

### File Parsing Support

- ✅ CSV (using PapaParse)
- ✅ Excel (.xlsx, .xls) (using XLSX)
- ✅ PDF (basic text extraction)
- ✅ JSON (native parsing)

### Pages

- `/` - Upload & Send Data
- `/preview` - Data Preview & Analysis
- `/predict` - Model Prediction
- `/logs` - Activity Logs

## 🔧 Backend Integration

Your backend should provide these endpoints:

```
POST /api/data/ingest
Request: { fileName, timestamp, dataType, metadata, payload }
Response: { success, message, data }

POST /api/predict
Request: { input: {...} }
Response: { prediction, confidence, error, metadata }
```

## 📊 Data Flow

1. User uploads file → Client-side parsing
2. Parsed data → Normalized JSON
3. JSON → Preview & Review
4. Send JSON → Backend ingestion
5. Prediction → Backend model → Results

## 🎨 Customization

### Change Theme Colors

Edit `src/app.css` CSS variables:

```css
:root {
	--color-primary: #0d6efd;
	--color-success: #198754;
	/* ... */
}
```

### Adjust File Size Limit

Edit `src/lib/config/api.config.js`:

```javascript
maxFileSize: 50 * 1024 * 1024  // 50MB
```

## 🏗️ Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📦 Dependencies

- **SvelteKit** - Framework
- **PapaParse** - CSV parsing
- **XLSX** - Excel parsing
- **Vite** - Build tool

## 🐛 Troubleshooting

### CORS Issues

If you see CORS errors, your backend needs to allow cross-origin requests:

```python
# Flask example
from flask_cors import CORS
CORS(app)
```

### File Upload Fails

Check:
1. File size within limit
2. File type is supported
3. Backend endpoint is reachable

### Preview Not Working

Verify:
1. File was parsed successfully
2. No JavaScript errors in console
3. Data store is populated

## 📝 Next Steps

1. ✅ Install dependencies
2. ✅ Configure backend URL
3. ✅ Run development server
4. ✅ Upload a test file
5. ✅ Review parsed data
6. ✅ Send to backend
7. ✅ Test predictions

For detailed documentation, see `DEVELOPMENT.md`.
