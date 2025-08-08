<svelte:options runes={true} />

<script lang="ts">
	import { FileImportSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Array<string>>;
	} = $props();

	let files: FileList | undefined = $state(undefined);
	let fileInput: HTMLInputElement;

	async function updateFile(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const txt = await target.files[0].text();
			let lines = [];
			for (const line of txt.trim().split('\n')) {
				lines.push(line.split('\t'));
			}
			// todo: check first line has the correct column names
			samples = lines.slice(1);
		} else {
			samples = [];
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
