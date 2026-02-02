import { additionalSelectionValid, type SeqType } from '$lib/util';

function getPlatePrefix(type: SeqType, plateIndex: number): string {
	return type === 'rt' ? `P${String(plateIndex + 1).padStart(2, '0')}-` : '';
}

function getCursorForType(type: SeqType): string {
	if (type === 'p5') {
		return 'cursor-s-resize';
	}
	if (type === 'p7') {
		return 'cursor-e-resize';
	}
	return 'cursor-se-resize';
}

function getSelectionEnd(
	type: SeqType,
	startRow: string,
	startCol: string,
	rowLabel: string,
	colLabel: string
): string {
	if (type === 'p5') {
		return `${rowLabel}${startCol}`;
	}
	if (type === 'p7') {
		return `${startRow}${colLabel}`;
	}
	return `${rowLabel}${colLabel}`;
}

function buildSelection(
	selectionStart: string,
	selectionEnd: string,
	type: SeqType,
	plateIndex: number
): string {
	const platePrefix = getPlatePrefix(type, plateIndex);
	const start = `${selectionStart ? platePrefix : ''}${selectionStart}`;
	const end = `${selectionEnd ? platePrefix : ''}${selectionEnd}`;
	return [start, end].filter(Boolean).join(':');
}

function applySelection(str: string, selection: string, type: SeqType, plateIndex: number): string {
	if (!selection) {
		return str;
	}
	if (additionalSelectionValid(str, selection, type, plateIndex)) {
		return [str, selection].filter(Boolean).join(',');
	}
	return str;
}

export { getPlatePrefix, getCursorForType, getSelectionEnd, buildSelection, applySelection };
