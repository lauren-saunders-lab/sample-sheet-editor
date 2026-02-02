<svelte:options runes={true} />

<script lang="ts">
	import Well from '$lib/components/Well.svelte';
	import { parse, type SeqType, removePlate } from '$lib/util';
	import {
		applySelection,
		buildSelection,
		getCursorForType,
		getPlatePrefix,
		getSelectionEnd
	} from '$lib/plateSelection';
	import { Button } from 'flowbite-svelte';

	interface Props {
		str: string;
		type: SeqType;
		plateIndex?: number;
	}

	let { str = $bindable(''), type, plateIndex = 0 }: Props = $props();

	const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
	const cols = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;
	let color = $derived.by(() => {
		if (type === 'p5') {
			return 'bg-red-400';
		} else if (type === 'p7') {
			return 'bg-blue-400';
		} else if (type === 'rt') {
			return 'bg-yellow-400';
		} else {
			return 'gb-gray-400';
		}
	});

	let selectionStart = $state('');
	let selectionStartRow = $state('');
	let selectionStartCol = $state('');
	let selectionEnd = $state('');
	let platePrefix = $derived(getPlatePrefix(type, plateIndex));
	let selection = $derived(buildSelection(selectionStart, selectionEnd, type, plateIndex));
	let selectionArray = $derived(parse(selection, type, plateIndex));
	let array = $derived(parse(str, type, plateIndex));
	let selecting = $state(false);
	let cursor = $state('cursor-pointer');

	function mousedown(rowIndex: number, colIndex: number) {
		if (!selecting) {
			selecting = true;
			cursor = getCursorForType(type);
			selectionStartRow = rows[rowIndex];
			selectionStartCol = cols[colIndex];
			selectionStart = `${selectionStartRow}${selectionStartCol}`;
			selectionEnd = '';
		}
	}

	function mouseenter(rowIndex: number, colIndex: number) {
		if (selecting) {
			const newSelectionEnd = getSelectionEnd(
				type,
				selectionStartRow,
				selectionStartCol,
				rows[rowIndex],
				cols[colIndex]
			);
			if (newSelectionEnd !== selectionStart) {
				selectionEnd = newSelectionEnd;
			}
		}
	}

	function onmouseup() {
		if (selecting) {
			str = applySelection(str, selection, type, plateIndex);
			selecting = false;
			cursor = 'cursor-pointer';
			selectionStart = '';
			selectionEnd = '';
		}
	}
</script>

<div class="flex flex-col rounded border-1 border-gray-400 p-2 shadow-lg">
	<div class="mb-2 flex flex-row items-stretch">
		<h1 class={`mr-2 w-full rounded text-center text-lg font-extrabold ${color}`}>
			{type}
			{platePrefix.slice(0, -1)}
		</h1>
		<Button
			color="light"
			size="xs"
			onclick={() => {
				str = removePlate(str, plateIndex);
			}}>Clear</Button
		>
	</div>
	<div
		class="grid grid-cols-12 content-center items-center justify-items-center gap-[1px]"
		{onmouseup}
	>
		{#each rows as row, rowIndex (row)}
			{#each cols as col, colIndex (col)}
				<Well
					{color}
					selected={array[rowIndex][colIndex]}
					selecting={selectionArray[rowIndex][colIndex]}
					{cursor}
					onmouseenter={() => mouseenter(rowIndex, colIndex)}
					onmousedown={() => mousedown(rowIndex, colIndex)}>{row}{col}</Well
				>
			{/each}
		{/each}
	</div>
</div>
