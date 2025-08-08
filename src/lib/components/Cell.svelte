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
		children?: Snippet;
	}

	const {
		color,
		selected,
		selecting,
		cursor,
		onmouseenter = () => {},
		onmousedown = () => {},
		children
	}: Props = $props();
</script>

<button
	class={`${cursor} flex h-full w-full items-center justify-center rounded p-2 text-center text-xs text-gray-800 shadow-lg transition-colors duration-200 ease-in-out ${selected || selecting ? color : 'bg-gray-400'} ${selected ? 'opacity-100' : 'opacity-50'}`}
	{onmouseenter}
	{onmousedown}
>
	{@render children?.()}
</button>
