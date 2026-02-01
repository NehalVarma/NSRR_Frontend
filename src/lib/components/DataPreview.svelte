<script>
	export let parsedData = null;

	let currentPage = 1;
	const rowsPerPage = 20;

	$: totalPages = parsedData?.type === 'table' 
		? Math.ceil(parsedData.data.length / rowsPerPage) 
		: 1;

	$: paginatedData = parsedData?.type === 'table'
		? parsedData.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
		: [];

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}
</script>

<div class="preview-panel card">
	<h2>Data Preview</h2>

	{#if !parsedData}
		<div class="empty-state">
			<p>No data to preview. Upload a file to get started.</p>
		</div>
	{:else if parsedData.type === 'table'}
		<div class="table-info">
			<span><strong>Rows:</strong> {parsedData.meta.rows}</span>
			<span><strong>Columns:</strong> {parsedData.meta.columns.length}</span>
		</div>

		<div class="table-container">
			<table>
				<thead>
					<tr>
						{#each parsedData.meta.columns as column}
							<th>{column}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each paginatedData as row}
						<tr>
							{#each parsedData.meta.columns as column}
								<td>{row[column] ?? ''}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if totalPages > 1}
			<div class="pagination">
				<button class="btn btn-secondary" on:click={prevPage} disabled={currentPage === 1}>
					Previous
				</button>
				<span class="page-info">Page {currentPage} of {totalPages}</span>
				<button class="btn btn-secondary" on:click={nextPage} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		{/if}

	{:else if parsedData.type === 'text'}
		<div class="text-info">
			<span><strong>Paragraphs:</strong> {parsedData.meta.totalParagraphs}</span>
			<span><strong>Characters:</strong> {parsedData.meta.totalCharacters}</span>
		</div>

		<div class="text-preview">
			{#each parsedData.data.preview as paragraph, i}
				<p class="paragraph">{paragraph}</p>
			{/each}
			{#if parsedData.data.paragraphs.length > parsedData.data.preview.length}
				<p class="more-indicator">... and {parsedData.data.paragraphs.length - parsedData.data.preview.length} more paragraphs</p>
			{/if}
		</div>

	{:else if parsedData.type === 'json'}
		<div class="json-info">
			<span><strong>Type:</strong> {parsedData.meta.isArray ? 'Array' : 'Object'}</span>
			<span><strong>Size:</strong> {parsedData.meta.size} {parsedData.meta.isArray ? 'items' : 'keys'}</span>
		</div>

		<div class="json-preview">
			<pre><code>{JSON.stringify(parsedData.data, null, 2)}</code></pre>
		</div>
	{/if}
</div>

<style>
	.preview-panel {
		height: 100%;
	}

	h2 {
		margin-bottom: var(--spacing-md);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.table-info,
	.text-info,
	.json-info {
		display: flex;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-sm);
		background: var(--color-bg-secondary);
		border-radius: calc(var(--radius) / 2);
		font-size: 0.875rem;
	}

	.table-container {
		overflow-x: auto;
		max-height: 500px;
		overflow-y: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	table {
		margin: 0;
	}

	th {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	td {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.page-info {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.text-preview {
		max-height: 500px;
		overflow-y: auto;
		padding: var(--spacing-md);
		background: var(--color-bg-secondary);
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
	}

	.paragraph {
		margin-bottom: var(--spacing-sm);
		line-height: 1.7;
	}

	.more-indicator {
		color: var(--color-text-secondary);
		font-style: italic;
		text-align: center;
		margin-top: var(--spacing-md);
	}

	.json-preview {
		max-height: 500px;
		overflow: auto;
	}

	.json-preview pre {
		margin: 0;
	}
</style>
