<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	type?: string;
	selecting?: string;
	onmouseenter?: () => void;
	onmousedown?: () => void;
	onmouseup?: () => void;
	children?: Snippet;
}

const { type = '', selecting = '', onmouseenter = ()=>{}, onmousedown = ()=>{}, onmouseup = ()=>{}, children } : Props = $props();

let classes = $derived.by(()=>{
	if(!type && !selecting){
		return 'opacity-50 bg-gray-200';
	}
	if(type == 'p5'){
		return 'opacity-100 bg-red-400';
	}
	if(selecting == 'p5'){
		return 'opacity-50 bg-red-400';
	}
	if(type == 'p7'){
		return 'opacity-100 bg-blue-400';
	}
	if(selecting == 'p7'){
		return 'opacity-50 bg-blue-400';
	}
	if(type == 'rt'){
		return 'opacity-100 bg-green-400';
	}
	if(selecting == 'rt'){
		return 'opacity-50 bg-green-400';
	}
});
</script>

<button
class="
flex items-center justify-center p-4 m-1 rounded shadow-lg
text-center text-gray-800
transition-colors duration-200 ease-in-out
{classes}
"
{onmouseenter}
{onmousedown}
{onmouseup}
>

{@render children?.()}
</button>