<svelte:options runes={true} />

<script lang="ts">
	import { FileImportSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import { type Sample, type Experiment, importTsv } from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable(),
		numPlates = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
		numPlates: number;
	} = $props();

	let files: FileList | undefined = $state(undefined);
	let fileInput: HTMLInputElement;

	async function onchange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			({ samples, experiment, numPlates: numPlates } = importTsv(await target.files[0].text()));
		}
	}
</script>

<BottomNavItem
	btnName="Open"
	onclick={() => {
		fileInput.click();
	}}
>
	<input type="file" bind:files accept=".tsv" multiple={false} {onchange} bind:this={fileInput} />
	<FileImportSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>

<style>
	input {
		display: none;
	}
</style>
