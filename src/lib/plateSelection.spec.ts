import { describe, expect, it } from 'vitest';
import {
	applySelection,
	buildSelection,
	getCursorForType,
	getPlatePrefix,
	getSelectionEnd
} from '$lib/plateSelection';

describe('plate selection helpers', () => {
	it('builds plate prefixes', () => {
		expect(getPlatePrefix('p5', 0)).toBe('');
		expect(getPlatePrefix('p7', 3)).toBe('');
		expect(getPlatePrefix('rt', 0)).toBe('P01-');
		expect(getPlatePrefix('rt', 11)).toBe('P12-');
	});

	it('builds selection strings with prefixes', () => {
		expect(buildSelection('A01', '', 'p5', 0)).toBe('A01');
		expect(buildSelection('A01', 'B02', 'p7', 0)).toBe('A01:B02');
		expect(buildSelection('A01', 'B02', 'rt', 0)).toBe('P01-A01:P01-B02');
		expect(buildSelection('', '', 'rt', 0)).toBe('');
		expect(buildSelection('', 'B02', 'rt', 0)).toBe('P01-B02');
		expect(buildSelection('A01', '', 'rt', 1)).toBe('P02-A01');
	});

	it('calculates selection end by type', () => {
		expect(getSelectionEnd('p5', 'A', '01', 'C', '12')).toBe('C01');
		expect(getSelectionEnd('p7', 'A', '01', 'C', '12')).toBe('A12');
		expect(getSelectionEnd('rt', 'A', '01', 'C', '12')).toBe('C12');
		expect(getSelectionEnd('p5', 'H', '12', 'H', '12')).toBe('H12');
	});

	it('chooses correct cursor', () => {
		expect(getCursorForType('p5')).toBe('cursor-s-resize');
		expect(getCursorForType('p7')).toBe('cursor-e-resize');
		expect(getCursorForType('rt')).toBe('cursor-se-resize');
	});

	it('applies selections only when they add new wells', () => {
		expect(applySelection('A01', 'A01', 'p5', 0)).toBe('A01');
		expect(applySelection('A01', 'B01', 'p5', 0)).toBe('A01,B01');
		expect(applySelection('', '', 'p5', 0)).toBe('');
	});

	it('respects plate index for rt selections', () => {
		expect(applySelection('P01-A01', 'P02-B01', 'rt', 0)).toBe('P01-A01');
		expect(applySelection('P01-A01', 'P02-B01', 'rt', 1)).toBe('P01-A01,P02-B01');
		expect(applySelection('', 'P02-B01', 'rt', 1)).toBe('P02-B01');
	});
});
