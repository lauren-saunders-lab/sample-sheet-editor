<svelte:options runes={true} />

<script lang="ts">
	import { FileImportSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import { type Sample, makeEmptySample } from '$lib/util';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Sample>;
	} = $props();

	let files: FileList | undefined = $state(undefined);
	let fileInput: HTMLInputElement;

	async function updateFile(event: Event) {
		samples = [];
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const txt = await target.files[0].text();
			let lines = [];
			for (const line of txt.trim().split('\n')) {
				lines.push(line.split('\t').map((l) => l.trim()));
			}
			const headers = lines[0];
			for (const line of lines.slice(1)) {
				const sample: Sample = makeEmptySample();
				for (let j = 0; j < Math.min(headers.length, line.length); j++) {
					sample[headers[j]] = line[j];
				}
				samples.push(sample as Sample);
			}
		}
	}
</script>

<BottomNavItem
	btnName="Open"
	onclick={() => {
		fileInput.click();
	}}
>
	<input
		type="file"
		bind:files
		accept=".tsv"
		multiple={false}
		onchange={updateFile}
		bind:this={fileInput}
	/>
	<FileImportSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>

<style>
	input {
		display: none;
	}
</style>
