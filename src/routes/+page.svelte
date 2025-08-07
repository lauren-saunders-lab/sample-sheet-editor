<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import UploadTsv from '$lib/components/UploadTsv.svelte';
	import { Select, Label, Input } from 'flowbite-svelte';

	let samples = $state([]);
	let sample_index = $state(0);
	let items = $derived(
		samples.map((v, i) => {
			return { value: i, name: v[5] };
		})
	);
</script>

<div class="flex flex-col space-y-4 p-4">
	<h1 class="text-center font-bold">WIP sci-rocket samplesheet editor</h1>
	<UploadTsv bind:samples label="Upload a samplesheet" id="uploadSampleSheet" />
	{#if samples.length > 0}
		<div>
			<Label>
				Select a sample
				<Select class="mt-2" {items} bind:value={sample_index} placeholder="" />
			</Label>
		</div>
		<div>
			<Label> Path
				<Input bind:value={samples[sample_index][0]} />
			</Label>
		</div>
		<div>
			<Label> Experiment name
				<Input bind:value={samples[sample_index][1]} />
			</Label>
		</div>
		<div>
			<Label> Species
				<Input bind:value={samples[sample_index][6]} />
			</Label>
		</div>
		<div>
			<Label> Num expected cells
				<Input bind:value={samples[sample_index][7]} />
			</Label>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
			<Plate str={samples[sample_index][2]} type="p5" plate_index={0} color="bg-red-400" />
			<Plate str={samples[sample_index][3]} type="p7" plate_index={0} color="bg-blue-400" />
			<!--			TODO: loop over plate indices here & separate sample text for each-->
			<Plate str={samples[sample_index][4]} type="rt" plate_index={0} color="bg-yellow-400" />
			<Plate str={samples[sample_index][4]} type="rt" plate_index={1} color="bg-yellow-400" />
		</div>
	{/if}
</div>
