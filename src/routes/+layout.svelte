<script>
	import '../app.css';
	import { page } from '$app/stores';

	let activeSection = 'upload';

	$: {
		const path = $page.url.pathname;
		if (path.includes('/preview')) activeSection = 'preview';
		else if (path.includes('/predict')) activeSection = 'predict';
		else if (path.includes('/logs')) activeSection = 'logs';
		else activeSection = 'upload';
	}
</script>

<div class="app">
	<nav class="navbar">
		<div class="container">
			<div class="nav-content">
				<h1 class="nav-title">NSRR</h1>
				<span class="nav-subtitle">Neuro-Symbolic Recursive Regression Framework</span>
			</div>
			<div class="nav-links">
				<a href="/" class:active={activeSection === 'upload'}>Upload</a>
				<a href="/preview" class:active={activeSection === 'preview'}>Preview</a>
				<a href="/predict" class:active={activeSection === 'predict'}>Prediction</a>
				<a href="/logs" class:active={activeSection === 'logs'}>Logs</a>
			</div>
		</div>
	</nav>

	<main class="main-content">
		<div class="container">
			<slot />
		</div>
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		padding: var(--spacing-md) 0;
		box-shadow: var(--shadow-sm);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-content {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
	}

	.nav-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		letter-spacing: -0.5px;
	}

	.nav-subtitle {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 400;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.nav-links {
		display: flex;
		gap: var(--spacing-md);
	}

	.nav-links a {
		text-decoration: none;
		color: var(--color-text-secondary);
		font-weight: 500;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: calc(var(--radius) / 2);
		transition: all 0.2s;
	}

	.nav-links a:hover {
		color: var(--color-text);
		background: var(--color-bg-secondary);
	}

	.nav-links a.active {
		color: var(--color-primary);
		background: rgba(13, 110, 253, 0.1);
	}

	.main-content {
		flex: 1;
		padding: var(--spacing-lg) 0;
		background: var(--color-bg-secondary);
	}

	@media (max-width: 768px) {
		.nav-subtitle {
			display: none;
		}

		.nav-links {
			width: 100%;
			justify-content: space-around;
		}
	}
</style>
