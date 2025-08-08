<svelte:options runes={true} />

<script lang="ts">
	import BottomNavItemOpen from '$lib/components/BottomNavItemOpen.svelte';
	import BottomNavItemNew from '$lib/components/BottomNavItemNew.svelte';
	import BottomNavItemSave from '$lib/components/BottomNavItemSave.svelte';
	import { BottomNav, Tooltip } from 'flowbite-svelte';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Array<string>>;
	} = $props();
</script>

<BottomNav position="fixed" navType="border" classes={{ inner: 'grid-cols-3' }}>
	<BottomNavItemNew bind:samples />
	<Tooltip arrow={false}>Create a new samplesheet</Tooltip>
	<BottomNavItemOpen bind:samples />
	<Tooltip arrow={false}>Open an existing samplesheet</Tooltip>
	<BottomNavItemSave bind:samples />
	<Tooltip arrow={false}>Save the samplesheet</Tooltip>
</BottomNav>
