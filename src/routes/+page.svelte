<svelte:options runes={true} />

<script lang="ts">
	import { Banner} from 'flowbite-svelte';
	import {
		makeDefaultExperiment,
		makeDefaultSample,
	} from '$lib/util';
	import favicon from '$lib/assets/favicon.jpeg';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import SampleSheet from '$lib/components/SampleSheet.svelte';

	let samples = $state([makeDefaultSample()]);
	let experiment = $state(makeDefaultExperiment());
	let numPlates = $state(1);
</script>

<Banner dismissable={false} class="fixed bg-[#d2d2d2]">
	<img src={favicon} alt="sci-rocket" class="absolute top-0 left-2 h-14" />
	<h1 class="font-bold">{experiment.experiment_name}</h1>
</Banner>
<div class="my-20 p-4">
	<SampleSheet {experiment} {samples} {numPlates} />
</div>
<BottomNavBar bind:samples bind:experiment bind:numPlates />
