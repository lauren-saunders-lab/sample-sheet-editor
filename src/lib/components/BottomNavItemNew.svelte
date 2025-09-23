<svelte:options runes={true} />

<script lang="ts">
	import { FileCirclePlusSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';
	import {
		type Experiment,
		makeDefaultExperiment,
		makeDefaultSample,
		type Sample
	} from '$lib/util';
	import AreYouSureModal from '$lib/components/AreYouSureModal.svelte';

	let {
		samples = $bindable([]),
		experiment = $bindable(),
		numPlates = $bindable()
	}: {
		samples: Array<Sample>;
		experiment: Experiment;
		numPlates: number;
	} = $props();

	let areYouSureModalOpen = $state(false);

	function createNewExperiment() {
		samples = [makeDefaultSample()];
		experiment = makeDefaultExperiment();
		numPlates = 1;
	}
</script>

<BottomNavItem btnName="New" onclick={() => {areYouSureModalOpen=true}}>
	<FileCirclePlusSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>

<AreYouSureModal bind:open={areYouSureModalOpen} onConfirm={createNewExperiment} message="Creating a new sample sheet will replace the current one - do you want to continue?" />