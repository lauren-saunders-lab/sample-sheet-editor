<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import UploadTsv from '$lib/components/UploadTsv.svelte';
	import { Select, Label } from 'flowbite-svelte';

	let samples = $state([]);
	let sample_index = $state(0);
	let items = $derived(
		samples.map((v, i) => {
			return { value: i, name: v[5] };
		})
	);
</script>

<div class="m-4 p-4">
	<h1 class="text-center font-bold">WIP sci-rocket samplesheet editor</h1>
	<div class="my-4">
		<UploadTsv bind:samples label="Upload a samplesheet" id="uploadSampleSheet" />
	</div>
	{#if samples.length > 0}
		<div class="my-4">
			<Label>
				Select a sample
				<Select class="mt-2" {items} bind:value={sample_index} placeholder="" />
			</Label>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
			<Plate str={samples[sample_index][2]} type="p5" plate_index={0} color="bg-red-400" />
			<Plate str={samples[sample_index][3]} type="p7" plate_index={0} color="bg-blue-400" />
			<Plate str={samples[sample_index][4]} type="rt" plate_index={0} color="bg-yellow-400" />
			<Plate str={samples[sample_index][4]} type="rt" plate_index={1} color="bg-yellow-400" />
		</div>
	{/if}
</div>
