<svelte:options runes={true} />

<script lang="ts">
	import {
		type Experiment,
		makeDefaultSample,
		removeLastPlate,
		updateGlobalPCRIndices,
		type Sample
	} from '$lib/util';
	import Plate from '$lib/components/Plate.svelte';
	import {
		Accordion,
		AccordionItem,
		Button,
		Checkbox,
		Input,
		Label,
		Tooltip
	} from 'flowbite-svelte';
	import { CirclePlusSolid, GridPlusSolid, TrashBinSolid } from 'flowbite-svelte-icons';

	let {
		samples = $bindable([]),
		experiment = $bindable(),
		numPlates = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
		numPlates: number;
	} = $props();

	let platesIndices = $derived(
		numPlates > 0 ? Array.from({ length: numPlates }, (_, i) => i) : [0]
	);

	function handleRemoveLastPlate() {
		numPlates = removeLastPlate(samples, numPlates);
	}

	function handleUpdateGlobalPCRIndices(event: Event) {
		const currentTarget = event.currentTarget as HTMLInputElement;
		updateGlobalPCRIndices(samples, currentTarget.checked);
	}
</script>

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
			Path reads
			<Tooltip>
				<p>The path where the FASTQ / Illumina / AVITI reads are located.</p>
				<p>
					This can also be multiple paths separated by a semicolon, e.g.
					"/data/reads1;/data/reads2". In this case the reads from all provided paths will be
					merged.
				</p>
				<p>
					For Illumina the directory name will be something like "240115_A01234_0042_ABCDHDSXY" and
					will contain a "RunInfo.xml" file.
				</p>
				<p>
					For AVITI the directory will contain a "RunManifest.csv/json" and a "BaseCalls"
					sub-directory.
				</p>
				<p>
					For FASTQ the folder should contain two .fastq.gz files, one with "R1" somewhere in the
					filename and the other with "R2".
				</p>
			</Tooltip>
			<Input bind:value={experiment.path_reads} />
		</Label>
	</div>
	<div class="col-span-2">
		<Checkbox bind:checked={experiment.global_p5_p7} onchange={handleUpdateGlobalPCRIndices}
			>Use the same PCR indices for all samples</Checkbox
		>
	</div>
	{#if experiment.global_p5_p7}
		<Plate bind:str={samples[0].p5} type="p5" />
		<Plate bind:str={samples[0].p7} type="p7" />
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
						Expected cells
						<Tooltip>
							<p>
								Your best estimate of the number of single cells you expect to be represented in the
								final sequencing data for this sample.
							</p>
							<p>
								Start with the number of cells loaded at RT, then multiply by your typical recovery
								rate (often 20–50%).
							</p>
							<p>
								If sequencing depth is limited or samples are diluted, reduce this number
								accordingly.
							</p>
							<p>When in doubt, use values from similar past experiments.</p>
						</Tooltip>
						<Input type="number" bind:value={sample.n_expected_cells} />
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
				{#each platesIndices as plateIndex (plateIndex)}
					<Plate bind:str={sample.rt} type="rt" {plateIndex} />
				{/each}
				<div class="">
					<Button
						color="light"
						class="m-2 w-full p-2"
						disabled={numPlates === 1}
						onclick={handleRemoveLastPlate}
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
