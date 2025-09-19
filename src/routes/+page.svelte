<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import { Banner, Label, Input, Tabs, TabItem, Button } from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import { makeDefaultSample } from '$lib/util';
	import favicon from '$lib/assets/favicon.jpeg';

	let samples = $state([makeDefaultSample()]);
</script>

<Banner dismissable={false} class="fixed bg-[#d2d2d2]">
	<img src={favicon} alt="sci-rocket" class="absolute top-0 left-2 h-14" />
	<h1 class="font-bold">sci-rocket sample-sheet editor</h1>
</Banner>
<div class="my-20">
	<Tabs>
		{#each samples as sample, sample_index (sample_index)}
			<TabItem title={sample.sample_name} open={sample_index === 0}>
				<div class="flex flex-col space-y-4 p-4">
					<div>
						<Label>
							Sample name
							<Input bind:value={sample.sample_name} />
						</Label>
					</div>
					<div>
						<Label>
							Path
							<Input bind:value={sample.path_fastq} />
						</Label>
					</div>
					<div>
						<Label>
							Experiment name
							<Input bind:value={sample.experiment_name} />
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
							Num expected cells
							<Input bind:value={sample.n_expected_cells} />
						</Label>
					</div>
					<div>
						<Label>
							Hashing sheet (optional)
							<Input bind:value={sample.hashing} />
						</Label>
					</div>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
						<Plate bind:str={sample.p5} type="p5" />
						<Plate bind:str={sample.p7} type="p7" />
						<!-- TODO: Can there be more than two plates for RT? -->
						<Plate bind:str={sample.rt} type="rt" plate_index={0} />
						<Plate bind:str={sample.rt} type="rt" plate_index={1} />
					</div>
				</div>
			</TabItem>
		{/each}
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
	</Tabs>
</div>
<BottomNavBar bind:samples />
