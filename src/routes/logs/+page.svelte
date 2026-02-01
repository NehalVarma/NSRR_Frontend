<script>
	import LogsPanel from '$lib/components/LogsPanel.svelte';
</script>

<svelte:head>
	<title>NSRR - Activity Logs</title>
</svelte:head>

<div class="logs-page">
	<h1>Activity Logs</h1>
	<p class="subtitle">Track all system activities and events</p>

	<LogsPanel />
</div>

<style>
	.logs-page {
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
