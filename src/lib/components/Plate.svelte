<svelte:options runes={true} />

<script lang="ts">
	import Cell from '$lib/components/Cell.svelte';
	import { additionalSelectionValid, parse, type SeqType } from '$lib/util';
	import { Button } from 'flowbite-svelte';

	interface Props {
		str: string;
		type: SeqType;
		plate_index: number;
		color: string;
	}

	let { str = $bindable(''), type, plate_index, color }: Props = $props();

	const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
	const cols = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;

	let selection_start = $state('');
	let selection_start_row = $state('');
	let selection_start_col = $state('');
	let selection_end = $state('');
	let selection = $derived.by(() => {
		const start = `${selection_start && type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_start}`;
		const end = `${selection_end && type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_end}`;
		return [start, end].filter(Boolean).join(':');
	});
	let selection_array = $derived(parse(selection, type, plate_index));
	let array = $derived(parse(str, type, plate_index));
	let selecting = $state(false);
	let cursor = $state('cursor-pointer');

	function mousedown(row_index: number, col_index: number) {
		if (!selecting) {
			selecting = true;
			if (type === 'p5') {
				// column only
				cursor = 'cursor-s-resize';
			} else if (type === 'p7') {
				// row only
				cursor = 'cursor-e-resize';
			} else if (type === 'rt') {
				cursor = 'cursor-se-resize';
			}
			selection_start_row = rows[row_index];
			selection_start_col = cols[col_index];
			selection_start = `${selection_start_row}${selection_start_col}`;
			selection_end = '';
		}
	}

	function mouseenter(row_index: number, col_index: number) {
		if (selecting) {
			let new_selection_end = '';
			if (type === 'p5') {
				// column only
				new_selection_end = `${rows[row_index]}${selection_start_col}`;
			} else if (type === 'p7') {
				// row only
				new_selection_end = `${selection_start_row}${cols[col_index]}`;
			} else if (type === 'rt') {
				new_selection_end = `${rows[row_index]}${cols[col_index]}`;
			}
			if (new_selection_end !== selection_start) {
				selection_end = new_selection_end;
			}
		}
	}

	function onmouseup() {
		if (selecting) {
			if (additionalSelectionValid(str, selection, type, plate_index)) {
				str = [str, selection].filter(Boolean).join(',');
			}
			selecting = false;
			cursor = 'cursor-pointer';
			selection_start = '';
			selection_end = '';
		}
	}
</script>

<div class="flex flex-col rounded border-1 border-gray-400 p-2 shadow-lg">
	<div class="mb-2 flex flex-row items-stretch">
		<h1 class={`mr-2 w-full rounded text-center text-lg font-extrabold ${color}`}>
			{type}
			{type === 'rt' ? `P${cols[plate_index]}` : ''}
		</h1>
		<Button
			color="light"
			size="xs"
			onclick={() => {
				str = '';
			}}>Clear</Button
		>
	</div>
	<div
		class="grid grid-cols-12 content-center items-center justify-items-center gap-[1px]"
		{onmouseup}
	>
		{#each rows as row, row_index (row)}
			{#each cols as col, col_index (col)}
				<Cell
					{color}
					selected={array[row_index][col_index]}
					selecting={selection_array[row_index][col_index]}
					{cursor}
					onmouseenter={() => mouseenter(row_index, col_index)}
					onmousedown={() => mousedown(row_index, col_index)}>{row}{col}</Cell
				>
			{/each}
		{/each}
	</div>
</div>
