<script>
	import PredictionPanel from '$lib/components/PredictionPanel.svelte';
</script>

<svelte:head>
	<title>NSRR - Prediction</title>
</svelte:head>

<div class="predict-page">
	<h1>Model Prediction</h1>
	<p class="subtitle">Run predictions using your trained model</p>

	<PredictionPanel />
</div>

<style>
	.predict-page {
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		font-size: 1.75rem;
		margin-bottom: var(--spacing-xs);
		font-weight: 600;
	}

	.subtitle {
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-lg);
	}
</style>
