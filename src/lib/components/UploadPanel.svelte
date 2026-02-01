<script>
	import { createEventDispatcher } from 'svelte';
	import { ALLOWED_FILE_TYPES, API_CONFIG } from '$lib/config/api.config.js';
	import { parseFile } from '$lib/utils/fileParser.js';
	import { dataStore, logsStore } from '$lib/stores/dataStore.js';

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let fileInput;
	let isProcessing = false;
	let uploadProgress = null;

	const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).map(t => t.ext).join(', ');
	const maxSizeMB = API_CONFIG.maxFileSize / (1024 * 1024);

	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		isDragging = false;
	}

	async function handleDrop(e) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			await processFile(files[0]);
		}
	}

	async function handleFileSelect(e) {
		const files = e.target.files;
		if (files.length > 0) {
			await processFile(files[0]);
		}
	}

	async function processFile(file) {
		// Validate file
		const validation = validateFile(file);
		if (!validation.valid) {
			dataStore.setError(validation.error);
			logsStore.addLog('error', 'File validation failed', validation.error);
			return;
		}

		isProcessing = true;
		uploadProgress = { fileName: file.name, size: formatFileSize(file.size), status: 'Processing...' };

		try {
			logsStore.addLog('info', `Processing file: ${file.name}`);
			
			// Parse the file
			const parsedData = await parseFile(file);
			
			dataStore.setFile(file);
			dataStore.setParsedData(parsedData);
			dataStore.setUploadStatus('success');

			uploadProgress.status = 'Complete';
			logsStore.addLog('success', `File parsed successfully: ${file.name}`, {
				type: parsedData.type,
				...parsedData.meta
			});

			dispatch('fileProcessed', { file, parsedData });
		} catch (error) {
			uploadProgress.status = 'Failed';
			dataStore.setError(error.message);
			logsStore.addLog('error', `File processing failed: ${file.name}`, error.message);
		} finally {
			isProcessing = false;
		}
	}

	function validateFile(file) {
		// Check file extension
		const extension = '.' + file.name.split('.').pop().toLowerCase();
		const isValidType = Object.values(ALLOWED_FILE_TYPES).some(t => t.ext === extension);

		if (!isValidType) {
			return {
				valid: false,
				error: `Invalid file type. Allowed: ${allowedExtensions}`
			};
		}

		// Check file size
		if (file.size > API_CONFIG.maxFileSize) {
			return {
				valid: false,
				error: `File too large. Max size: ${maxSizeMB}MB`
			};
		}

		return { valid: true };
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	function clearFile() {
		dataStore.reset();
		uploadProgress = null;
		if (fileInput) fileInput.value = '';
		logsStore.addLog('info', 'File cleared');
	}
</script>

<div class="upload-panel card">
	<h2>Upload Data File</h2>
	<p class="helper-text">
		Supported formats: <strong>{allowedExtensions}</strong> (max {maxSizeMB}MB)
	</p>

	<div
		class="drop-zone"
		class:dragging={isDragging}
		class:has-file={uploadProgress}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		role="button"
		tabindex="0"
	>
		{#if !uploadProgress}
			<svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="17 8 12 3 7 8" />
				<line x1="12" y1="3" x2="12" y2="15" />
			</svg>
			<p class="drop-text">Drag & drop your file here</p>
			<p class="or-text">or</p>
			<input
				type="file"
				bind:this={fileInput}
				on:change={handleFileSelect}
				accept={Object.values(ALLOWED_FILE_TYPES).map(t => t.ext).join(',')}
				style="display: none;"
			/>
			<button class="btn btn-primary" on:click={() => fileInput.click()}>Browse Files</button>
		{:else}
			<div class="file-info">
				<div class="file-details">
					<svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
						<polyline points="13 2 13 9 20 9" />
					</svg>
					<div>
						<p class="file-name">{uploadProgress.fileName}</p>
						<p class="file-size">{uploadProgress.size}</p>
					</div>
				</div>
				<div class="file-status" class:processing={isProcessing} class:complete={uploadProgress.status === 'Complete'}>
					{#if isProcessing}
						<span class="loading"></span>
					{/if}
					<span>{uploadProgress.status}</span>
				</div>
				{#if !isProcessing}
					<button class="btn btn-secondary" on:click={clearFile}>Clear</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if $dataStore.error}
		<div class="error">
			<strong>Error:</strong> {$dataStore.error}
		</div>
	{/if}
</div>

<style>
	.upload-panel {
		margin-bottom: var(--spacing-md);
	}

	h2 {
		margin-bottom: var(--spacing-xs);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.helper-text {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin-bottom: var(--spacing-md);
	}

	.drop-zone {
		border: 2px dashed var(--color-border);
		border-radius: var(--radius);
		padding: var(--spacing-xl);
		text-align: center;
		transition: all 0.3s;
		cursor: pointer;
		background: var(--color-bg-secondary);
	}

	.drop-zone.dragging {
		border-color: var(--color-primary);
		background: rgba(13, 110, 253, 0.05);
	}

	.drop-zone.has-file {
		cursor: default;
	}

	.upload-icon {
		width: 48px;
		height: 48px;
		color: var(--color-text-secondary);
		margin: 0 auto var(--spacing-sm);
	}

	.drop-text {
		font-size: 1rem;
		color: var(--color-text);
		margin-bottom: var(--spacing-xs);
	}

	.or-text {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin: var(--spacing-sm) 0;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		justify-content: space-between;
	}

	.file-details {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex: 1;
	}

	.file-icon {
		width: 32px;
		height: 32px;
		color: var(--color-primary);
	}

	.file-name {
		font-weight: 500;
		margin-bottom: 2px;
	}

	.file-size {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.file-status {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: calc(var(--radius) / 2);
		background: var(--color-bg-secondary);
		font-size: 0.875rem;
	}

	.file-status.processing {
		color: var(--color-primary);
	}

	.file-status.complete {
		color: var(--color-success);
		background: rgba(25, 135, 84, 0.1);
	}
</style>
