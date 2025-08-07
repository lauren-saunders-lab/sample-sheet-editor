<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		color: string;
		selected: boolean;
		selecting: boolean;
		cursor: string;
		onmouseenter?: () => void;
		onmousedown?: () => void;
		onmouseup?: () => void;
		children?: Snippet;
	}

	const {
		color,
		selected,
		selecting,
		cursor,
		onmouseenter = () => {},
		onmousedown = () => {},
		onmouseup = () => {},
		children
	}: Props = $props();
</script>

<button
	class={`${cursor} m-1 flex items-center justify-center rounded p-1 text-center text-xs text-gray-800 shadow-lg transition-colors duration-200 ease-in-out ${selected || selecting ? color : 'bg-gray-400'} ${selected ? 'opacity-100' : 'opacity-50'}`}
	{onmouseenter}
	{onmousedown}
	{onmouseup}
>
	{@render children?.()}
</button>
