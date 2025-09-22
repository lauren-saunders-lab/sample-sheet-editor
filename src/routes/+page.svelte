<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import {
		Banner,
		Card,
		Label,
		Input,
		Checkbox,
		AccordionItem,
		Accordion,
		Button
	} from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import { makeDefaultExperiment, makeDefaultSample } from '$lib/util';
	import favicon from '$lib/assets/favicon.jpeg';

	let samples = $state([makeDefaultSample()]);
	let experiment = $state(makeDefaultExperiment());
	let num_plates = $state(1);
	let plates_indices = $derived(
		num_plates > 0 ? Array.from({ length: num_plates }, (_, i) => i) : [0]
	);
</script>

<Banner dismissable={false} class="fixed bg-[#d2d2d2]">
	<img src={favicon} alt="sci-rocket" class="absolute top-0 left-2 h-14" />
	<h1 class="font-bold">{experiment.experiment_name}</h1>
</Banner>
<div class="my-20 p-4">
	<div
		class="mb-8 grid grid-cols-1 gap-4 rounded-xl border-1 border-gray-200 p-4 lg:grid-cols-2 dark:border-b-gray-700"
	>
		<div>
			<Label>
				Experiment name
				<Input bind:value={experiment.experiment_name} />
			</Label>
		</div>
		<div>
			<Label>
				Number of plates
				<Input bind:value={num_plates} type="number" />
			</Label>
		</div>
		<div>
			<Label>
				Path BCL
				<Input bind:value={experiment.path_bcl} />
			</Label>
		</div>
		<div>
			<Label>
				Path FASTQ
				<Input bind:value={experiment.path_fastq} />
			</Label>
		</div>
		<div class="col-span-2">
			<Checkbox bind:checked={experiment.global_p5_p7}
				>Use the same PCR indices for all samples</Checkbox
			>
		</div>
		{#if experiment.global_p5_p7}
			<Plate bind:str={samples[0].p5} type="p5" />
			<Plate bind:str={samples[0].p7} type="p7" />
		{/if}
	</div>
	<Accordion multiple>
		{#each samples as sample, sample_index (sample_index)}
			<AccordionItem open>
				{#snippet header()}{sample.sample_name}{/snippet}
				<div class="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-2">
					<div>
						<Label>
							Sample name
							<Input bind:value={sample.sample_name} />
						</Label>
					</div>
					<div>
						<Label>
							Species
							<Input bind:value={sample.species} />
						</Label>
					</div>
					<div>
						<Label>
							Cells per well
							<Input type="number" bind:value={sample.cells_per_well} />
						</Label>
					</div>
					<div>
						<Label>
							Hashing sheet (optional)
							<Input bind:value={sample.hashing} />
						</Label>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{#if !experiment.global_p5_p7}
						<Plate bind:str={sample.p5} type="p5" />
						<Plate bind:str={sample.p7} type="p7" />
					{/if}
					{#each plates_indices as plate_index}
						<Plate bind:str={sample.rt} type="rt" {plate_index} />
					{/each}
				</div>
			</AccordionItem>
		{/each}
	</Accordion>
	<Button
		class="m-2"
		color="light"
		size="xs"
		onclick={() => {
			samples.push(makeDefaultSample());
		}}
	>
		<CirclePlusOutline class="me-2 h-5 w-5" /> Add sample
	</Button>
</div>
<BottomNavBar bind:samples bind:experiment bind:num_plates />
