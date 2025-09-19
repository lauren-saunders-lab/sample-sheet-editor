import { describe, it, expect } from 'vitest';
import { parse, count_rt_wells, count_rt_plates } from '$lib/util';

function count_true(array: Array<Array<boolean>>): number {
	return array.flat().filter((e) => e).length;
}

describe('parse', () => {
	it('empty strings', () => {
		expect(count_true(parse('', 'p5'))).toBe(0);
		expect(count_true(parse('', 'p7'))).toBe(0);
		expect(count_true(parse('', 'rt', 0))).toBe(0);
		expect(count_true(parse('', 'rt', 1))).toBe(0);
		expect(count_true(parse('', 'rt', 2))).toBe(0);
	});
	it('valid p5 wells', () => {
		const a = parse('A02,H03', 'p5');
		// A02
		expect(a[0][0]).toBe(false);
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(false);
		// H03
		expect(a[7][1]).toBe(false);
		expect(a[7][2]).toBe(true);
		expect(a[7][3]).toBe(false);
		// 2 selected wells
		expect(count_true(a)).toBe(2);
	});
	it('valid p7 wells', () => {
		const a = parse('A02,H03', 'p7');
		// A02
		expect(a[0][0]).toBe(false);
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(false);
		// H03
		expect(a[7][1]).toBe(false);
		expect(a[7][2]).toBe(true);
		expect(a[7][3]).toBe(false);
		// 2 selected wells
		expect(count_true(a)).toBe(2);
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
		// 9 selected wells
		expect(count_true(a)).toBe(9);
	});
	// todo: add tests that p7 col or p5 row or p5/p7 rectangles are rejected as invalid
	// todo: more invalid inputs
	// todo: rt tests
});

describe('count', () => {
	it('empty string: 0 wells, 1 plate', () => {
		const str = '';
		expect(count_rt_plates(str)).toBe(1);
		expect(count_rt_wells(str)).toBe(0);
	});
	it('one well in plate 1: 1 well, 1 plate', () => {
		const str = 'P01-A02';
		expect(count_rt_plates(str)).toBe(1);
		expect(count_rt_wells(str)).toBe(1);
	});
	it('one well in plate 3: 1 well, 3 plates', () => {
		const str = 'P03-C09';
		expect(count_rt_plates(str)).toBe(3);
		expect(count_rt_wells(str)).toBe(1);
	});
	it('four wells in plate 1: 4 wells, 1 plate', () => {
		const str = 'P01-A02,P01-C07,P01-H11,P01-F07';
		expect(count_rt_plates(str)).toBe(1);
		expect(count_rt_wells(str)).toBe(4);
	});
	it('two rows in 2 plates: 24 wells, 2 plates', () => {
		const str = 'P01-A01:P01-A12,P02-H01:P02-H12';
		expect(count_rt_plates(str)).toBe(2);
		expect(count_rt_wells(str)).toBe(24);
	});
	it('two cols in 1 plate: 16 wells, 1 plate', () => {
		const str = 'P01-A01:P01-H01,P01-A09:P01-H09';
		expect(count_rt_plates(str)).toBe(1);
		expect(count_rt_wells(str)).toBe(16);
	});
	it('all wells in 4 plates: 384 well, 4 plates', () => {
		const str = 'P01-A01:P01-H12,P02-A01:P02-H12,P03-A01:P03-H12,P04-A01:P04-H12';
		expect(count_rt_plates(str)).toBe(4);
		expect(count_rt_wells(str)).toBe(384);
	});
});
