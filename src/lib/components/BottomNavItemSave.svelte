<svelte:options runes={true} />

<script lang="ts">
	import { FloppyDiskSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import FileSaver from 'file-saver';
	import { sampleHeaders, type Sample } from '$lib/util';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Sample>;
	} = $props();

	function onclick() {
		let lines = [sampleHeaders.join('\t')];
		for (const sample of samples) {
			lines.push(sampleHeaders.map(header => {return sample[header as keyof Sample] ?? ''}).join('\t'));
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
