<script>
	export let jsonData = null;
	export let title = "Normalized JSON";

	let copied = false;

	$: formattedJson = jsonData ? JSON.stringify(jsonData, null, 2) : '';

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(formattedJson);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function downloadJson() {
		const blob = new Blob([formattedJson], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `nsrr_data_${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<div class="json-viewer card">
	<div class="header">
		<h2>{title}</h2>
		{#if jsonData}
			<div class="actions">
				<button class="btn btn-secondary" on:click={copyToClipboard}>
					{copied ? '✓ Copied' : 'Copy'}
				</button>
				<button class="btn btn-secondary" on:click={downloadJson}>
					Download
				</button>
			</div>
		{/if}
	</div>

	{#if !jsonData}
		<div class="empty-state">
			<p>No JSON data available</p>
		</div>
	{:else}
		<div class="json-container">
			<pre><code>{formattedJson}</code></pre>
		</div>
	{/if}
</div>

<style>
	.json-viewer {
		height: 100%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.actions {
		display: flex;
		gap: var(--spacing-xs);
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.json-container {
		max-height: 500px;
		overflow: auto;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	pre {
		margin: 0;
		padding: var(--spacing-md);
	}

	code {
		font-size: 0.85rem;
		line-height: 1.6;
	}
</style>
