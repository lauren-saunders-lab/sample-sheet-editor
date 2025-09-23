<svelte:options runes={true} />

<script lang="ts">
	import { Button, Modal } from "flowbite-svelte";
	import {ExclamationCircleOutline} from "flowbite-svelte-icons";

	let {
		open = $bindable(false),
		message = "Are you sure?",
		onConfirm,
	}: {
		open: boolean;
		message?: string;
		onConfirm: () => void;
	} = $props();
</script>

<Modal bind:open size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{message}
		</h3>
		<Button color="blue" class="me-2" onclick={onConfirm}>
			Yes
		</Button>
		<Button color="alternative" onclick={() => {open = false}}>Cancel</Button>
	</div>
</Modal>
