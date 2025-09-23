<svelte:options runes={true} />

<script lang="ts">
	import Well from '$lib/components/Well.svelte';
	import { additionalSelectionValid, parse, type SeqType, remove_plate } from '$lib/util';
	import { Button } from 'flowbite-svelte';

	interface Props {
		str: string;
		type: SeqType;
		plate_index?: number;
		occupied: Array<Array<boolean>>;
	}

	let { str = $bindable(''), type, plate_index = 0, occupied }: Props = $props();

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

	let selection_start = $state('');
	let selection_start_row = $state('');
	let selection_start_col = $state('');
	let selection_end = $state('');
	let plate_prefix = $derived(type === 'rt' ? `P${String(plate_index + 1).padStart(2, '0')}-` : '');
	let selection = $derived.by(() => {
		const start = `${selection_start ? plate_prefix : ''}${selection_start}`;
		const end = `${selection_end ? plate_prefix : ''}${selection_end}`;
		return [start, end].filter(Boolean).join(':');
	});
	let selection_array = $derived(parse(selection, type, plate_index));
	let array = $derived(parse(str, type, plate_index));
	let selecting = $state(false);
	let cursor = $state('cursor-pointer');

	function mousedown(row_index: number, col_index: number, disabled: boolean) {
		if (!disabled && !selecting) {
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

	function mouseenter(row_index: number, col_index: number, disabled: boolean) {
		if (!disabled && selecting) {
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
			if (additionalSelectionValid(str, selection, type, plate_index, occupied)) {
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
			{plate_prefix.slice(0, -1)}
		</h1>
		<Button
			color="light"
			size="xs"
			onclick={() => {
				str = remove_plate(str, plate_index);
			}}>Clear</Button
		>
	</div>
	<div
		class="grid grid-cols-12 content-center items-center justify-items-center gap-[1px]"
		{onmouseup}
	>
		{#each rows as row, row_index (row)}
			{#each cols as col, col_index (col)}
				<Well
					{color}
					selected={array[row_index][col_index]}
					selecting={selection_array[row_index][col_index]}
					disabled={occupied[row_index][col_index]}
					cursor={occupied[row_index][col_index] ? 'cursor-not-allowed' : cursor}
					onmouseenter={() => mouseenter(row_index, col_index, occupied[row_index][col_index])}
					onmousedown={() => mousedown(row_index, col_index, occupied[row_index][col_index])}
					>{row}{col}</Well
				>
			{/each}
		{/each}
	</div>
</div>
