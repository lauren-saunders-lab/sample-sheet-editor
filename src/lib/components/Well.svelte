<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		color: string;
		selected: boolean;
		selecting: boolean;
		disabled: boolean;
		cursor: string;
		onmouseenter?: () => void;
		onmousedown?: () => void;
		children?: Snippet;
	}

	const {
		color,
		selected,
		selecting,
		disabled,
		cursor,
		onmouseenter = () => {},
		onmousedown = () => {},
		children
	}: Props = $props();
</script>

<button
	class={`${cursor} flex h-full w-full items-center justify-center rounded p-2 text-center text-xs text-gray-800 shadow-lg transition-colors duration-200 ease-in-out ${selected || selecting ? color : 'bg-gray-400'} ${selected ? 'opacity-100' : disabled ? 'opacity-20' : 'opacity-50'}`}
	{onmousedown}
	{onmouseenter}
>
	{@render children?.()}
</button>
