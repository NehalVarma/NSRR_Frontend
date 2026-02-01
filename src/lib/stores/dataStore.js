import { writable } from 'svelte/store';

function createDataStore() {
	const { subscribe, set, update } = writable({
		file: null,
		parsedData: null,
		normalizedJson: null,
		uploadStatus: 'idle', // idle, uploading, success, error
		error: null
	});

	return {
		subscribe,
		setFile: (file) => update(state => ({ ...state, file, error: null })),
		setParsedData: (data) => update(state => ({ ...state, parsedData: data })),
		setNormalizedJson: (json) => update(state => ({ ...state, normalizedJson: json })),
		setUploadStatus: (status) => update(state => ({ ...state, uploadStatus: status })),
		setError: (error) => update(state => ({ ...state, error, uploadStatus: 'error' })),
		reset: () => set({
			file: null,
			parsedData: null,
			normalizedJson: null,
			uploadStatus: 'idle',
			error: null
		})
	};
}

export const dataStore = createDataStore();

function createLogsStore() {
	const { subscribe, update } = writable([]);

	return {
		subscribe,
		addLog: (type, message, details = null) => {
			update(logs => [
				{
					id: Date.now(),
					timestamp: new Date().toISOString(),
					type, // info, success, error, warning
					message,
					details
				},
				...logs
			].slice(0, 100)); // Keep last 100 logs
		},
		clear: () => update(() => [])
	};
}

export const logsStore = createLogsStore();
