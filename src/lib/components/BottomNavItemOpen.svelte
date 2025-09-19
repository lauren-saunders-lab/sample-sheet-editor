<svelte:options runes={true} />

<script lang="ts">
	import { FileImportSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import {
		type Sample,
		makeEmptySample,
		type Experiment,
		makeEmptyExperiment,
		count_rt_wells,
		count_rt_plates
	} from '$lib/util';

	let {
		samples = $bindable([]),
		experiment = $bindable(),
		num_plates = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
		num_plates: number;
	} = $props();

	let files: FileList | undefined = $state(undefined);
	let fileInput: HTMLInputElement;

	async function updateFile(event: Event) {
		samples = [];
		num_plates = 1;
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const txt = await target.files[0].text();
			let lines = [];
			for (const line of txt.trim().split('\n')) {
				lines.push(line.split('\t').map((l) => l.trim()));
			}
			const headers = lines[0];
			for (const line of lines.slice(1)) {
				// read tsv row
				let tsvRow: Record<string, string> = {};
				for (let j = 0; j < Math.min(headers.length, line.length); j++) {
					tsvRow[headers[j]] = line[j];
				}
				// create empty sample and update with data from row
				const sample: Sample = makeEmptySample();
				for (const key of Object.keys(sample)) {
					sample[key as keyof Sample] = tsvRow?.[key];
				}
				// calculate number of cells per well for this sample
				sample.cells_per_well = Math.floor(
					parseInt(tsvRow.n_expected_cells) / count_rt_wells(tsvRow.rt)
				);
				// ensure we display enough plates
				num_plates = Math.max(num_plates, count_rt_plates(tsvRow.rt));
				samples.push(sample);
				// create empty experiment and update with data from row
				experiment = makeEmptyExperiment();
				for (const key of Object.keys(experiment)) {
					experiment[key as keyof Experiment] = tsvRow?.[key];
				}
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
