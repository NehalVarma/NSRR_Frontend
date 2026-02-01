import { API_CONFIG } from '$lib/config/api.config.js';

class ApiService {
	constructor() {
		this.baseURL = API_CONFIG.baseURL;
		this.timeout = API_CONFIG.timeout;
	}

	/**
	 * Generic fetch wrapper with timeout and error handling
	 */
	async request(endpoint, options = {}) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				signal: controller.signal,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				}
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError') {
				throw new Error('Request timeout - server did not respond in time');
			}
			throw error;
		}
	}

	/**
	 * Send parsed data to backend for ingestion
	 */
	async ingestData(normalizedData) {
		try {
			const response = await this.request(API_CONFIG.endpoints.ingest, {
				method: 'POST',
				body: JSON.stringify(normalizedData)
			});

			return {
				success: true,
				data: response
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Send prediction request to backend
	 */
	async predict(inputData) {
		try {
			const response = await this.request(API_CONFIG.endpoints.predict, {
				method: 'POST',
				body: JSON.stringify(inputData)
			});

			return {
				success: true,
				data: response
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Check backend health
	 */
	async healthCheck() {
		try {
			const response = await fetch(`${this.baseURL}/health`, {
				method: 'GET'
			});
			return response.ok;
		} catch {
			return false;
		}
	}
}

export const apiService = new ApiService();
