<script>
	import DataPreview from '$lib/components/DataPreview.svelte';
	import JsonViewer from '$lib/components/JsonViewer.svelte';
	import { dataStore } from '$lib/stores/dataStore.js';
</script>

<svelte:head>
	<title>NSRR - Data Preview</title>
</svelte:head>

<div class="preview-page">
	<h1>Data Preview & Analysis</h1>

	{#if !$dataStore.parsedData}
		<div class="card empty-state">
			<p>No data available to preview.</p>
			<p class="helper">Please <a href="/">upload a file</a> first.</p>
		</div>
	{:else}
		<div class="content">
			<div class="left-panel">
				<DataPreview parsedData={$dataStore.parsedData} />
			</div>
			<div class="right-panel">
				<JsonViewer jsonData={$dataStore.normalizedJson} />
			</div>
		</div>
	{/if}
</div>

<style>
	.preview-page {
		max-width: 1600px;
		margin: 0 auto;
	}

	h1 {
		font-size: 1.75rem;
		margin-bottom: var(--spacing-lg);
		font-weight: 600;
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
	}

	.empty-state p {
		margin-bottom: var(--spacing-sm);
		color: var(--color-text-secondary);
	}

	.empty-state a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.empty-state a:hover {
		text-decoration: underline;
	}

	.content {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: var(--spacing-lg);
	}

	@media (max-width: 1024px) {
		.content {
			grid-template-columns: 1fr;
		}
	}
</style>
