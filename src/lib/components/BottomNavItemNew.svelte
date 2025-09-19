<svelte:options runes={true} />

<script lang="ts">
	import { FileCirclePlusSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import { type Experiment, makeDefaultExperiment, makeDefaultSample, type Sample } from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
	} = $props();

	function onclick() {
		samples = [makeDefaultSample()];
		experiment = makeDefaultExperiment();
	}
</script>

<BottomNavItem btnName="New" {onclick}>
	<FileCirclePlusSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>
