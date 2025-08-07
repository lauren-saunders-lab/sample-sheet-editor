<svelte:options runes={true} />

<script lang="ts">
	import Cell from '$lib/components/Cell.svelte';
	import { parse } from '$lib/util';

	interface Props {
		str: string;
		type: string;
		plate_index: number;
		color: string;
	}

	let {
		str = $bindable(''),
		type = 'p5',
		plate_index = 0,
		color = 'bg-gray-400'
	}: Props = $props();

	const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
	const cols = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;

	let selection_start = $state('');
	let selection_end = $state('');
	let selection_array = $derived(
		parse(
			`${type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_start}:${type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_end}`,
			type,
			plate_index
		)
	);
	let array = $derived(parse(str, type, plate_index));
	let selecting = $state(false);
	let cursor = $state('cursor-pointer');

	function mousedown(row_index: number, col_index: number) {
		if (!selecting) {
			selecting = true;
			cursor = 'cursor-nwse-resize';
			selection_start = `${rows[row_index]}${cols[col_index]}`;
			selection_end = '';
		}
	}

	function mouseup(row_index: number, col_index: number) {
		if (selecting) {
			const start = `${type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_start}`;
			const end = `${type === 'rt' ? `P${cols[plate_index]}-` : ''}${selection_end}`;
			const new_str = [start, end].filter(Boolean).join(':');
			str = [str, new_str].filter(Boolean).join(',');
			selecting = false;
			cursor = 'cursor-pointer';
			selection_start = '';
			selection_end = '';
		}
	}

	function mouseenter(row_index: number, col_index: number) {
		if (selecting) {
			const new_selection_end = `${rows[row_index]}${cols[col_index]}`;
			if (new_selection_end !== selection_start) {
				selection_end = new_selection_end;
			}
		}
	}
</script>

<div class="m-2 flex flex-col rounded border-1 border-gray-400 p-2 shadow-lg">
	<h1 class={`m-2 rounded text-center text-lg font-extrabold ${color}`}>
		{type}
		{type === 'rt' ? `P${cols[plate_index]}` : ''}
	</h1>
	<div class="grid grid-cols-12">
		{#each rows as row, row_index (row)}
			{#each cols as col, col_index (col)}
				<Cell
					{color}
					selected={array[row_index][col_index]}
					selecting={selection_array[row_index][col_index]}
					{cursor}
					onmouseenter={() => mouseenter(row_index, col_index)}
					onmousedown={() => mousedown(row_index, col_index)}
					onmouseup={() => mouseup(row_index, col_index)}>{row}{col}</Cell
				>
			{/each}
		{/each}
	</div>
	<div class="text-center">
		{str}
	</div>
</div>
