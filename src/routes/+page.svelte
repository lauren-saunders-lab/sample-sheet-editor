<script lang="ts">
	import Cell from '$lib/components/Cell.svelte';
	import { parse } from '$lib/util';
	const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'H'] as const;
	const cols = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;

	let p5 = $state('');
	let p7 = $state('');
	let rt = $state('');
	let selection_start = $state('');
	let selection_end = $state('');
	let selection_array = $derived(parse(`${selection_start}:${selection_end}`, '', ''));
	let array = $derived(parse(p5, p7, rt));
	let selecting = $state(false);

	function mousedown(row_index: number, col_index: number) {
		if (!selecting) {
			selecting = true;
			selection_start = `${rows[row_index]}${cols[col_index]}`;
			selection_end = '';
		}
	}

	function mouseup(row_index: number, col_index: number) {
		if (selecting) {
			const new_str = [selection_start, selection_end].filter(Boolean).join(':');
			p5 = [p5, new_str].filter(Boolean).join(',');
			selecting = false;
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

<h1>Samplesheet editor</h1>

<div class="flex flex-row">
	<input bind:value={p5} />
	<input bind:value={p7} />
	<input bind:value={rt} />
</div>
<div class="grid grid-cols-12">
	{#each rows as row, row_index (row)}
		{#each cols as col, col_index (col)}
			<Cell
				type={array[row_index][col_index]}
				selecting={selection_array[row_index][col_index]}
				onmouseenter={() => mouseenter(row_index, col_index)}
				onmousedown={() => mousedown(row_index, col_index)}
				onmouseup={() => mouseup(row_index, col_index)}>{row}{col}</Cell
			>
		{/each}
	{/each}
</div>
