<svelte:options runes={true} />

<script lang="ts">
	import { FloppyDiskSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import FileSaver from 'file-saver';
	import { tsvHeaders, type Sample, type Experiment, type TsvRow } from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
	} = $props();

	function onclick() {
		let lines = [tsvHeaders.join('\t')];
		for (const sample of samples) {
			let tsvRow = sample as TsvRow;
			// set experiment data that applies to all samples
			for(const [key, value] of Object.entries(experiment) ) {
				tsvRow[key as keyof Experiment] = value;
			}
			lines.push(
				tsvHeaders
					.map((header) => {
						return tsvRow[header] ?? '';
					})
					.join('\t')
			);
		}
		let blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
		FileSaver.saveAs(blob, 'samplesheet.tsv');
	}
</script>

<BottomNavItem btnName="Save" {onclick}>
	<FloppyDiskSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>
