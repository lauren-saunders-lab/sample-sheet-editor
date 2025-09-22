<svelte:options runes={true} />

<script lang="ts">
	import BottomNavItemOpen from '$lib/components/BottomNavItemOpen.svelte';
	import BottomNavItemNew from '$lib/components/BottomNavItemNew.svelte';
	import BottomNavItemSave from '$lib/components/BottomNavItemSave.svelte';
	import { BottomNav, Tooltip } from 'flowbite-svelte';
	import { type Experiment, type Sample } from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable(),
		num_plates = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
		num_plates: number;
	} = $props();
</script>

<BottomNav position="fixed" navType="border" classes={{ inner: 'grid-cols-3' }}>
	<BottomNavItemNew bind:samples bind:experiment bind:num_plates />
	<Tooltip arrow={false}>Create a new sample-sheet</Tooltip>
	<BottomNavItemOpen bind:samples bind:experiment bind:num_plates />
	<Tooltip arrow={false}>Open an existing sample-sheet</Tooltip>
	<BottomNavItemSave bind:samples bind:experiment />
	<Tooltip arrow={false}>Save the sample-sheet</Tooltip>
</BottomNav>
