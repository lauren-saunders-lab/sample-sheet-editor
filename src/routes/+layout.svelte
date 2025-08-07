<svelte:options runes={true} />

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.jpeg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
