import { describe, it, expect } from 'vitest';
import { parse } from '$lib/util';

describe('parse', () => {
	it('valid p5 cells', () => {
		const a = parse('A02,H03', 'p5');
		// A02
		expect(a[0][0]).toBe(false);
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(false);
		// H03
		expect(a[7][1]).toBe(false);
		expect(a[7][2]).toBe(true);
		expect(a[7][3]).toBe(false);
	});
	it('valid p7 cells', () => {
		const a = parse('A02,H03', 'p7');
		// A02
		expect(a[0][0]).toBe(false);
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(false);
		// H03
		expect(a[7][1]).toBe(false);
		expect(a[7][2]).toBe(true);
		expect(a[7][3]).toBe(false);
	});
	it('valid p5 cols', () => {
		const a = parse('A02:C02,B10:G10', 'p5');
		// A02:C02
		expect(a[0][0]).toBe(false);
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(false);
		expect(a[1][0]).toBe(false);
		expect(a[1][1]).toBe(true);
		expect(a[1][2]).toBe(false);
		expect(a[2][0]).toBe(false);
		expect(a[2][1]).toBe(true);
		expect(a[2][2]).toBe(false);
		// B10:G10
		expect(a[0][9]).toBe(false);
		expect(a[1][9]).toBe(true);
		expect(a[2][9]).toBe(true);
		expect(a[3][9]).toBe(true);
		expect(a[4][9]).toBe(true);
		expect(a[5][9]).toBe(true);
		expect(a[6][9]).toBe(true);
		expect(a[7][9]).toBe(false);
	});
	// todo: add tests that p7 col or p5 row or p5/p7 rectangles are rejected as invalid
	// todo: more invalid inputs
	// todo: rt tests
});
