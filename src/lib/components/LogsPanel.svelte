<script>
	import { logsStore } from '$lib/stores/dataStore.js';

	let filterType = 'all'; // all, info, success, error, warning

	$: filteredLogs = $logsStore.filter(log => 
		filterType === 'all' || log.type === filterType
	);

	function formatTime(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	}

	function getLogIcon(type) {
		switch (type) {
			case 'success': return '✓';
			case 'error': return '✕';
			case 'warning': return '⚠';
			default: return 'ℹ';
		}
	}

	function clearLogs() {
		logsStore.clear();
	}
</script>

<div class="logs-panel card">
	<div class="header">
		<h2>Activity Logs</h2>
		<div class="controls">
			<select bind:value={filterType}>
				<option value="all">All Logs</option>
				<option value="info">Info</option>
				<option value="success">Success</option>
				<option value="error">Errors</option>
				<option value="warning">Warnings</option>
			</select>
			<button class="btn btn-secondary" on:click={clearLogs}>Clear</button>
		</div>
	</div>

	<div class="logs-container">
		{#if filteredLogs.length === 0}
			<div class="empty-state">
				<p>No logs to display</p>
			</div>
		{:else}
			{#each filteredLogs as log (log.id)}
				<div class="log-entry {log.type}">
					<div class="log-header">
						<span class="log-icon">{getLogIcon(log.type)}</span>
						<span class="log-time">{formatTime(log.timestamp)}</span>
						<span class="log-type">{log.type.toUpperCase()}</span>
					</div>
					<div class="log-message">{log.message}</div>
					{#if log.details}
						<div class="log-details">
							<pre><code>{typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}</code></pre>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.logs-panel {
		max-height: 600px;
		display: flex;
		flex-direction: column;
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

	.controls {
		display: flex;
		gap: var(--spacing-sm);
	}

	.controls select {
		width: auto;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 0.875rem;
	}

	.logs-container {
		flex: 1;
		overflow-y: auto;
		max-height: 500px;
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.log-entry {
		padding: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
		border-left: 3px solid var(--color-border);
		background: var(--color-bg-secondary);
		border-radius: calc(var(--radius) / 2);
	}

	.log-entry.info {
		border-left-color: var(--color-primary);
	}

	.log-entry.success {
		border-left-color: var(--color-success);
	}

	.log-entry.error {
		border-left-color: var(--color-danger);
	}

	.log-entry.warning {
		border-left-color: var(--color-warning);
	}

	.log-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
		font-size: 0.875rem;
	}

	.log-icon {
		font-weight: bold;
	}

	.log-time {
		color: var(--color-text-secondary);
	}

	.log-type {
		font-weight: 600;
		font-size: 0.75rem;
		padding: 2px 6px;
		border-radius: 3px;
		background: var(--color-bg);
	}

	.log-message {
		font-size: 0.95rem;
		margin-bottom: var(--spacing-xs);
	}

	.log-details {
		margin-top: var(--spacing-xs);
		padding: var(--spacing-xs);
		background: var(--color-bg);
		border-radius: calc(var(--radius) / 2);
		font-size: 0.85rem;
	}

	.log-details pre {
		margin: 0;
		padding: 0;
		background: none;
		border: none;
	}
