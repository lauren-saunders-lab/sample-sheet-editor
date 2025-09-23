<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import {
		Accordion,
		AccordionItem,
		Banner,
		Button,
		Checkbox,
		Input,
		Label
	} from 'flowbite-svelte';
	import { GridPlusSolid, CirclePlusSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import {
		getOccupiedWells,
		makeDefaultExperiment,
		makeDefaultSample,
		removePlate
	} from '$lib/util';
	import favicon from '$lib/assets/favicon.jpeg';

	let samples = $state([makeDefaultSample()]);
	let experiment = $state(makeDefaultExperiment());
	let numPlates = $state(1);
	let occupiedWells = $derived.by(() => {
		let occupied = [];
		for (let plateIndex = 0; plateIndex < numPlates; plateIndex++) {
			occupied.push(getOccupiedWells(samples, plateIndex));
		}
		return occupied;
	});

	function removeLastPlate() {
		const plateIndex = numPlates - 1;
		if (plateIndex < 1) {
			return;
		}
		for (const sample of samples) {
			sample.rt = removePlate(sample.rt, plateIndex);
		}
		--numPlates;
	}
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
			<Plate bind:str={samples[0].p5} type="p5" occupied={occupiedWells[0]} />
			<Plate bind:str={samples[0].p7} type="p7" occupied={occupiedWells[0]} />
		{/if}
	</div>
	<Accordion multiple>
		{#each samples as sample, sampleIndex (sampleIndex)}
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
						<Plate bind:str={sample.p5} type="p5" occupied={occupiedWells[0]} />
						<Plate bind:str={sample.p7} type="p7" occupied={occupiedWells[0]} />
					{/if}
					{#each occupiedWells as occupied, plateIndex (plateIndex)}
						<Plate bind:str={sample.rt} type="rt" {plateIndex} {occupied} />
					{/each}
					<div class="">
						<Button
							color="light"
							class="m-2 w-full p-2"
							disabled={numPlates === 1}
							onclick={removeLastPlate}
						>
							<TrashBinSolid
								class="mr-1 mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
							/>
							Remove plate
						</Button>
						<Button
							color="light"
							class="m-2 w-full p-2"
							onclick={() => {
								++numPlates;
							}}
						>
							<GridPlusSolid
								class="mr-1 mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
							/>
							Add plate
						</Button>
					</div>
				</div>
			</AccordionItem>
		{/each}
	</Accordion>
	<Button
		class="mt-8 w-full"
		color="light"
		onclick={() => {
			samples.push(makeDefaultSample());
		}}
	>
		<CirclePlusSolid class="me-2 h-5 w-5" /> Add sample
	</Button>
</div>
<BottomNavBar bind:samples bind:experiment bind:numPlates />
