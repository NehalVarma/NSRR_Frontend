<script>
	import { apiService } from '$lib/services/apiService.js';
	import { dataStore, logsStore } from '$lib/stores/dataStore.js';

	let inputMode = 'manual'; // manual or uploaded
	let manualInputs = {};
	let predictionResult = null;
	let isLoading = false;
	let error = null;

	$: columns = $dataStore.parsedData?.type === 'table' 
		? $dataStore.parsedData.meta.columns 
		: [];

	$: canUseUploaded = $dataStore.parsedData?.type === 'table' && $dataStore.parsedData.data.length > 0;

	// Initialize manual inputs based on columns
	$: if (columns.length > 0 && Object.keys(manualInputs).length === 0) {
		manualInputs = columns.reduce((acc, col) => {
			acc[col] = '';
			return acc;
		}, {});
	}

	async function handlePredict() {
		error = null;
		isLoading = true;
		predictionResult = null;

		try {
			let inputData;

			if (inputMode === 'manual') {
				// Validate manual inputs
				const emptyFields = Object.entries(manualInputs).filter(([k, v]) => !v);
				if (emptyFields.length > 0) {
					throw new Error(`Please fill all fields: ${emptyFields.map(([k]) => k).join(', ')}`);
				}
				inputData = { input: manualInputs };
			} else {
				// Use uploaded dataset
				inputData = {
					input: $dataStore.parsedData.data
				};
			}

			logsStore.addLog('info', 'Sending prediction request to backend');

			const response = await apiService.predict(inputData);

			if (response.success) {
				predictionResult = response.data;
				logsStore.addLog('success', 'Prediction completed successfully', response.data);
			} else {
				throw new Error(response.error);
			}
		} catch (err) {
			error = err.message;
			logsStore.addLog('error', 'Prediction failed', err.message);
		} finally {
			isLoading = false;
		}
	}

	function resetPrediction() {
		predictionResult = null;
		error = null;
		if (inputMode === 'manual') {
			manualInputs = columns.reduce((acc, col) => {
				acc[col] = '';
				return acc;
			}, {});
		}
	}

	function formatPredictionValue(value) {
		if (typeof value === 'number') {
			return value.toFixed(4);
		}
		return value;
	}
</script>

<div class="prediction-panel card">
	<h2>Prediction</h2>

	<div class="mode-selector">
		<label>
			<input type="radio" bind:group={inputMode} value="manual" />
			Manual Input
		</label>
		<label>
			<input type="radio" bind:group={inputMode} value="uploaded" disabled={!canUseUploaded} />
			Use Uploaded Data {!canUseUploaded ? '(upload table data first)' : ''}
		</label>
	</div>

	{#if inputMode === 'manual'}
		<div class="manual-inputs">
			<h3>Enter Input Values</h3>
			{#if columns.length === 0}
				<p class="info-text">Upload a CSV or Excel file first to see input fields</p>
			{:else}
				<div class="input-grid">
					{#each columns as column}
						<div class="input-field">
							<label for={column}>{column}</label>
							<input
								id={column}
								type="text"
								bind:value={manualInputs[column]}
								placeholder={`Enter ${column}`}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="uploaded-info">
			<p>Using uploaded dataset with <strong>{$dataStore.parsedData?.data.length || 0}</strong> rows</p>
		</div>
	{/if}

	<div class="actions">
		<button 
			class="btn btn-primary" 
			on:click={handlePredict}
			disabled={isLoading || (inputMode === 'manual' && columns.length === 0)}
		>
			{#if isLoading}
				<span class="loading"></span>
				Predicting...
			{:else}
				Run Prediction
			{/if}
		</button>
		{#if predictionResult}
			<button class="btn btn-secondary" on:click={resetPrediction}>
				Reset
			</button>
		{/if}
	</div>

	{#if error}
		<div class="error">
			<strong>Error:</strong> {error}
		</div>
	{/if}

	{#if predictionResult}
		<div class="results">
			<h3>Prediction Results</h3>
			
			{#if Array.isArray(predictionResult.predictions)}
				<div class="table-container">
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Prediction</th>
								{#if predictionResult.confidence}
									<th>Confidence</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each predictionResult.predictions.slice(0, 100) as pred, i}
								<tr>
									<td>{i + 1}</td>
									<td>{formatPredictionValue(pred)}</td>
									{#if predictionResult.confidence?.[i]}
										<td>{formatPredictionValue(predictionResult.confidence[i])}</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
					{#if predictionResult.predictions.length > 100}
						<p class="more-indicator">Showing first 100 of {predictionResult.predictions.length} results</p>
					{/if}
				</div>
			{:else if typeof predictionResult.prediction !== 'undefined'}
				<div class="single-result">
					<div class="result-item">
						<span class="label">Prediction:</span>
						<span class="value">{formatPredictionValue(predictionResult.prediction)}</span>
					</div>
					{#if predictionResult.confidence}
						<div class="result-item">
							<span class="label">Confidence:</span>
							<span class="value">{formatPredictionValue(predictionResult.confidence)}</span>
						</div>
					{/if}
					{#if predictionResult.error}
						<div class="result-item">
							<span class="label">Error:</span>
							<span class="value">{formatPredictionValue(predictionResult.error)}</span>
						</div>
					{/if}
				</div>
			{:else}
				<pre><code>{JSON.stringify(predictionResult, null, 2)}</code></pre>
			{/if}

			{#if predictionResult.metadata}
				<div class="metadata">
					<h4>Metadata</h4>
					<pre><code>{JSON.stringify(predictionResult.metadata, null, 2)}</code></pre>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.prediction-panel h2 {
		margin-bottom: var(--spacing-md);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.mode-selector {
		display: flex;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-sm);
		background: var(--color-bg-secondary);
		border-radius: var(--radius);
	}

	.mode-selector label {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
		font-size: 0.95rem;
	}

	.mode-selector input[type='radio'] {
		width: auto;
	}

	.manual-inputs h3,
	.results h3 {
		font-size: 1.1rem;
		margin-bottom: var(--spacing-md);
	}

	.info-text {
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.input-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-md);
	}

	.input-field label {
		display: block;
		font-weight: 500;
		margin-bottom: var(--spacing-xs);
		font-size: 0.9rem;
	}

	.uploaded-info {
		padding: var(--spacing-md);
		background: var(--color-bg-secondary);
		border-radius: var(--radius);
		margin-bottom: var(--spacing-md);
	}

	.actions {
		display: flex;
		gap: var(--spacing-sm);
		margin-top: var(--spacing-md);
	}

	.results {
		margin-top: var(--spacing-lg);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}

	.table-container {
		max-height: 400px;
		overflow: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.more-indicator {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin-top: var(--spacing-sm);
	}

	.single-result {
		background: var(--color-bg-secondary);
		padding: var(--spacing-md);
		border-radius: var(--radius);
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-sm) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item .label {
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.result-item .value {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--color-primary);
	}

	.metadata {
		margin-top: var(--spacing-md);
	}

	.metadata h4 {
		font-size: 1rem;
		margin-bottom: var(--spacing-sm);
	}
</style>
