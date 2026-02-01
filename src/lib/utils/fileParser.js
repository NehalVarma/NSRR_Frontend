import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse CSV file to JSON
 */
export async function parseCSV(file) {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				if (results.errors.length > 0) {
					reject(new Error(`CSV parsing errors: ${results.errors[0].message}`));
				} else {
					resolve({
						type: 'table',
						data: results.data,
						meta: {
							rows: results.data.length,
							columns: results.meta.fields || []
						}
					});
				}
			},
			error: (error) => reject(error)
		});
	});
}

/**
 * Parse Excel file (.xlsx, .xls) to JSON
 */
export async function parseExcel(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: 'array' });

				// Get first sheet
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				// Convert to JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

				// Get column names
				const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

				resolve({
					type: 'table',
					data: jsonData,
					meta: {
						rows: jsonData.length,
						columns: columns,
						sheetName: firstSheetName,
						totalSheets: workbook.SheetNames.length
					}
				});
			} catch (error) {
				reject(new Error(`Excel parsing error: ${error.message}`));
			}
		};

		reader.onerror = () => reject(new Error('Failed to read Excel file'));
		reader.readAsArrayBuffer(file);
	});
}

/**
 * Parse PDF file - extract text content
 * Note: For production, consider using pdf.js or similar library
 * This is a simplified version
 */
export async function parsePDF(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (e) => {
			try {
				// Simple text extraction from PDF
				// In production, use pdf.js library for better extraction
				const text = e.target.result;
				
				// Split into paragraphs
				const paragraphs = text
					.split('\n\n')
					.filter(p => p.trim().length > 0)
					.map(p => p.trim());

				resolve({
					type: 'text',
					data: {
						fullText: text,
						paragraphs: paragraphs,
						preview: paragraphs.slice(0, 5)
					},
					meta: {
						totalParagraphs: paragraphs.length,
						totalCharacters: text.length
					}
				});
			} catch (error) {
				reject(new Error(`PDF parsing error: ${error.message}`));
			}
		};

		reader.onerror = () => reject(new Error('Failed to read PDF file'));
		reader.readAsText(file);
	});
}

/**
 * Parse JSON file
 */
export async function parseJSON(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const jsonData = JSON.parse(e.target.result);
				
				resolve({
					type: 'json',
					data: jsonData,
					meta: {
						isArray: Array.isArray(jsonData),
						size: Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length
					}
				});
			} catch (error) {
				reject(new Error(`Invalid JSON: ${error.message}`));
			}
		};

		reader.onerror = () => reject(new Error('Failed to read JSON file'));
		reader.readAsText(file);
	});
}

/**
 * Main parser function - routes to appropriate parser based on file type
 */
export async function parseFile(file) {
	const extension = file.name.split('.').pop().toLowerCase();

	switch (extension) {
		case 'csv':
			return await parseCSV(file);
		case 'xlsx':
		case 'xls':
			return await parseExcel(file);
		case 'pdf':
			return await parsePDF(file);
		case 'json':
			return await parseJSON(file);
		default:
			throw new Error(`Unsupported file type: ${extension}`);
	}
}

/**
 * Convert parsed data to normalized JSON format for backend
 */
export function normalizeData(parsedData, fileName) {
	const normalized = {
		fileName: fileName,
		timestamp: new Date().toISOString(),
		dataType: parsedData.type,
		metadata: parsedData.meta,
		payload: null
	};

	if (parsedData.type === 'table') {
		normalized.payload = {
			columns: parsedData.meta.columns,
			rows: parsedData.data
		};
	} else if (parsedData.type === 'json') {
		normalized.payload = parsedData.data;
	} else if (parsedData.type === 'text') {
		normalized.payload = {
			text: parsedData.data.fullText,
			paragraphs: parsedData.data.paragraphs
		};
	}

	return normalized;
}
