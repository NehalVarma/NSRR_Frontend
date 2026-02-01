<script>
	import UploadPanel from '$lib/components/UploadPanel.svelte';
	import DataPreview from '$lib/components/DataPreview.svelte';
	import JsonViewer from '$lib/components/JsonViewer.svelte';
	import { dataStore, logsStore } from '$lib/stores/dataStore.js';
	import { normalizeData } from '$lib/utils/fileParser.js';
	import { apiService } from '$lib/services/apiService.js';
	import { goto } from '$app/navigation';

	let isSending = false;
	let sendError = null;
	let sendSuccess = false;

	$: normalizedJson = $dataStore.parsedData && $dataStore.file
		? normalizeData($dataStore.parsedData, $dataStore.file.name)
		: null;

	$: {
		if (normalizedJson) {
			dataStore.setNormalizedJson(normalizedJson);
		}
	}

	async function sendToBackend() {
		if (!normalizedJson) return;

		isSending = true;
		sendError = null;
		sendSuccess = false;

		try {
			logsStore.addLog('info', 'Sending data to backend for ingestion');
			
			const response = await apiService.ingestData(normalizedJson);

			if (response.success) {
				sendSuccess = true;
				logsStore.addLog('success', 'Data ingested successfully', response.data);
				
				// Navigate to preview page after successful send
				setTimeout(() => {
					goto('/preview');
				}, 1500);
			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			sendError = error.message;
			logsStore.addLog('error', 'Data ingestion failed', error.message);
		} finally {
			isSending = false;
		}
	}

	function handleFileProcessed() {
		sendSuccess = false;
		sendError = null;
	}
</script>

<svelte:head>
	<title>NSRR - Upload</title>
</svelte:head>

<div class="upload-page">
	<div class="step-indicator">
		<div class="step active">
			<span class="step-number">1</span>
			<span class="step-label">Upload</span>
		</div>
		<div class="step-line"></div>
		<div class="step" class:active={$dataStore.parsedData}>
			<span class="step-number">2</span>
			<span class="step-label">Preview</span>
		</div>
		<div class="step-line"></div>
		<div class="step" class:active={sendSuccess}>
			<span class="step-number">3</span>
			<span class="step-label">Send</span>
		</div>
		<div class="step-line"></div>
		<div class="step">
			<span class="step-number">4</span>
			<span class="step-label">Predict</span>
		</div>
	</div>

	<div class="content">
		<div class="left-panel">
			<UploadPanel on:fileProcessed={handleFileProcessed} />

			{#if normalizedJson}
				<JsonViewer jsonData={normalizedJson} />
				
				<div class="send-section">
					<button 
						class="btn btn-primary btn-large" 
						on:click={sendToBackend}
						disabled={isSending || sendSuccess}
					>
						{#if isSending}
							<span class="loading"></span>
							Sending to Backend...
						{:else if sendSuccess}
							✓ Sent Successfully
						{:else}
							Send to Backend
						{/if}
					</button>

					{#if sendError}
						<div class="error">
							<strong>Error:</strong> {sendError}
						</div>
					{/if}

					{#if sendSuccess}
						<div class="success">
							Data sent successfully! Redirecting to preview...
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="right-panel">
			<DataPreview parsedData={$dataStore.parsedData} />
		</div>
	</div>
</div>

<style>
	.upload-page {
		max-width: 1600px;
		margin: 0 auto;
	}

	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--spacing-lg);
		padding: var(--spacing-md);
		background: var(--color-bg);
		border-radius: var(--radius);
		box-shadow: var(--shadow-sm);
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		opacity: 0.4;
		transition: opacity 0.3s;
	}

	.step.active {
		opacity: 1;
	}

	.step-number {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.step.active .step-number {
		background: var(--color-primary);
		color: white;
	}

	.step-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.step.active .step-label {
		color: var(--color-text);
	}

	.step-line {
		width: 60px;
		height: 2px;
		background: var(--color-border);
		margin: 0 var(--spacing-sm);
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-lg);
	}

	.send-section {
		margin-top: var(--spacing-md);
	}

	.btn-large {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
	}

	@media (max-width: 1024px) {
		.content {
			grid-template-columns: 1fr;
		}

		.step-indicator {
			overflow-x: auto;
		}
	}
</style>
