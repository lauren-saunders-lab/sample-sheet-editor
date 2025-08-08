<svelte:options runes={true} />

<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';
	import { Banner, Label, Input, Tabs, TabItem, Button } from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import { defaultSample } from '$lib/util';
	import favicon from '$lib/assets/favicon.jpeg';

	let samples = $state([defaultSample]);
</script>

<Banner dismissable={false} class="fixed bg-[#d2d2d2]">
	<img src={favicon} alt="sci-rocket" class="absolute top-0 left-2 h-14" />
	<h1 class="font-bold">sci-rocket samplesheet editor</h1>
</Banner>
<div class="my-20">
	<Tabs>
		{#each samples as sample, sample_index (sample_index)}
			<TabItem title={sample[5]} open={sample_index === 0}>
				<div class="flex flex-col space-y-4 p-4">
					<div>
						<Label>
							Sample name
							<Input bind:value={sample[5]} />
						</Label>
					</div>
					<div>
						<Label>
							Path
							<Input bind:value={sample[0]} />
						</Label>
					</div>
					<div>
						<Label>
							Experiment name
							<Input bind:value={sample[1]} />
						</Label>
					</div>
					<div>
						<Label>
							Species
							<Input bind:value={sample[6]} />
						</Label>
					</div>
					<div>
						<Label>
							Num expected cells
							<Input bind:value={sample[7]} />
						</Label>
					</div>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
						<Plate bind:str={sample[2]} type="p5" plate_index={0} color="bg-red-400" />
						<Plate bind:str={sample[3]} type="p7" plate_index={0} color="bg-blue-400" />
						<!-- TODO: Can there be more than two plates for RT? -->
						<Plate bind:str={sample[4]} type="rt" plate_index={0} color="bg-yellow-400" />
						<Plate bind:str={sample[4]} type="rt" plate_index={1} color="bg-yellow-400" />
					</div>
				</div>
			</TabItem>
		{/each}
		<Button
			class="m-2"
			color="light"
			size="xs"
			onclick={() => {
				samples.push(defaultSample);
			}}
		>
			<CirclePlusOutline class="me-2 h-5 w-5" /> Add sample
		</Button>
	</Tabs>
</div>
<BottomNavBar bind:samples />
