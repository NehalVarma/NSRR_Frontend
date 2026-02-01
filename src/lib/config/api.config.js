export const API_CONFIG = {
	baseURL: 'http://localhost:5000',
	endpoints: {
		ingest: '/api/data/ingest',
		predict: '/api/predict'
	},
	timeout: 30000,
	maxFileSize: 50 * 1024 * 1024 // 50MB
};

export const ALLOWED_FILE_TYPES = {
	pdf: { ext: '.pdf', mime: 'application/pdf' },
	csv: { ext: '.csv', mime: 'text/csv' },
	xlsx: { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
	xls: { ext: '.xls', mime: 'application/vnd.ms-excel' },
	json: { ext: '.json', mime: 'application/json' }
};
