import { describe, it, expect } from 'vitest';
import { parse } from '$lib/util';

describe('parse', () => {
	it('parses single cells', () => {
		const a = parse('A02,H03', 'B03,B04,G12', '');
		expect(a[0][1]).toBe('p5');
		expect(a[7][2]).toBe('p5');
	});
});
