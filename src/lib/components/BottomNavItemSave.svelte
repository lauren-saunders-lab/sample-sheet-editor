<svelte:options runes={true} />

<script lang="ts">
	import { FloppyDiskSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import FileSaver from 'file-saver';
	import { type Sample, type Experiment, export_tsv } from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
	} = $props();

	function onclick() {
		let blob = new Blob([export_tsv(experiment, samples)], { type: 'text/plain;charset=utf-8' });
		FileSaver.saveAs(blob, 'samplesheet.tsv');
	}
</script>

<BottomNavItem btnName="Save" {onclick}>
	<FloppyDiskSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>
