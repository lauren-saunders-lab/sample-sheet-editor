<svelte:options runes={true} />

<script lang="ts">
	import { FileCirclePlusSolid } from 'flowbite-svelte-icons';
	import { BottomNavItem } from 'flowbite-svelte';

	let {
		samples = $bindable([])
	}: {
		samples: Array<Array<string>>;
	} = $props();

	function onclick() {
		samples = [['data', 'experiment', '', '', '', 'sample', 'mouse', '10000']];
	}
</script>

<BottomNavItem btnName="New" {onclick}>
	<FileCirclePlusSolid
		class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
	/>
</BottomNavItem>
