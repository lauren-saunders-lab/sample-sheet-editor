<svelte:options runes={true} />

<script lang="ts">
	import { Fileupload, Label } from 'flowbite-svelte';

	let {
		samples = $bindable([]),
		label,
		id
	}: {
		samples: Array<Array<string>>;
		label: string;
		id: string;
	} = $props();

	let files: FileList | undefined = $state(undefined);

	async function updateFile(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const txt = await target.files[0].text();
			let lines = [];
			for (const line of txt.split('\n')) {
				lines.push(line.split('\t'));
			}
			samples = lines.slice(1);
		} else {
			samples = [];
		}
	}
</script>

<div class="flex flex-col">
	<Label for={id}>{label}</Label>
	<Fileupload {id} bind:files accept=".tsv" multiple={false} onchange={updateFile} required />
</div>
