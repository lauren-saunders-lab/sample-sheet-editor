<svelte:options runes={true} />

<script lang="ts">
	import { FloppyDiskSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import FileSaver from 'file-saver';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Array<string>>;
	} = $props();

	function onclick() {
		let lines = [
			[
				'path_fastq',
				'experiment_name',
				'p5',
				'p7',
				'rt',
				'sample_name',
				'species',
				'n_expected_cells'
			].join('\t')
		];
		for (const sample of samples) {
			lines.push(sample.join('\t'));
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
