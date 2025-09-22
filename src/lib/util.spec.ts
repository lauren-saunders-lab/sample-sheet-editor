import { describe, it, expect } from 'vitest';
import { parse, count_rt_wells, count_rt_plates, type SeqType } from '$lib/util';

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
	['p5', 'p7'].forEach((type) => {
		it(`valid ${type} wells`, () => {
			const a = parse('A02,H03', type as SeqType);
			// 2 selected wells
			expect(count_true(a)).toBe(2);
			// A02
			expect(a[0][1]).toBe(true);
			// H03
			expect(a[7][2]).toBe(true);
		});
	});
	it('valid p5 columns', () => {
		const a = parse('A02:C02,B10:G10', 'p5');
		// 9 selected wells
		expect(count_true(a)).toBe(9);
		// A02:C02
		expect(a[0][1]).toBe(true);
		expect(a[1][1]).toBe(true);
		expect(a[2][1]).toBe(true);
		// B10:G10
		expect(a[1][9]).toBe(true);
		expect(a[2][9]).toBe(true);
		expect(a[3][9]).toBe(true);
		expect(a[4][9]).toBe(true);
		expect(a[5][9]).toBe(true);
		expect(a[6][9]).toBe(true);
	});
	it('valid p7 rows', () => {
		const a = parse('A02:A05,G07:G10', 'p7');
		// 8 selected wells
		expect(count_true(a)).toBe(8);
		// A02:A05
		expect(a[0][1]).toBe(true);
		expect(a[0][2]).toBe(true);
		expect(a[0][3]).toBe(true);
		expect(a[0][4]).toBe(true);
		// G07:G10
		expect(a[6][6]).toBe(true);
		expect(a[6][7]).toBe(true);
		expect(a[6][8]).toBe(true);
		expect(a[6][9]).toBe(true);
	});
	it('valid rt columns over two plates', () => {
		const str = 'P01-A02:P01-C02,P01-B10:P01-G10,P02-C06:P02-E06';
		// 1st plate (index 0):
		const a1 = parse(str, 'rt', 0);
		// 9 selected wells
		expect(count_true(a1)).toBe(9);
		// A02:C02
		expect(a1[0][1]).toBe(true);
		expect(a1[1][1]).toBe(true);
		expect(a1[2][1]).toBe(true);
		// B10:G10
		expect(a1[1][9]).toBe(true);
		expect(a1[2][9]).toBe(true);
		expect(a1[3][9]).toBe(true);
		expect(a1[4][9]).toBe(true);
		expect(a1[5][9]).toBe(true);
		expect(a1[6][9]).toBe(true);
		// 2nd plate (index 1):
		const a2 = parse(str, 'rt', 1);
		// 3 selected wells
		expect(count_true(a2)).toBe(3);
		// C06:E06
		expect(a2[2][5]).toBe(true);
		expect(a2[3][5]).toBe(true);
		expect(a2[4][5]).toBe(true);
	});
	it('valid rt rows over two plates', () => {
		const str = 'P01-A01:P01-A12,P02-A02:P02-A05,P02-G07:P02-G10';
		// 1st plate (index 0):
		const a1 = parse(str, 'rt', 0);
		expect(count_true(a1)).toBe(12);
		expect(a1[0][0]).toBe(true);
		expect(a1[0][1]).toBe(true);
		expect(a1[0][2]).toBe(true);
		expect(a1[0][3]).toBe(true);
		expect(a1[0][4]).toBe(true);
		expect(a1[0][5]).toBe(true);
		expect(a1[0][6]).toBe(true);
		expect(a1[0][7]).toBe(true);
		expect(a1[0][8]).toBe(true);
		expect(a1[0][9]).toBe(true);
		expect(a1[0][10]).toBe(true);
		expect(a1[0][11]).toBe(true);
		// 2nd plate (index 1):
		const a2 = parse(str, 'rt', 1);
		// 8 selected wells
		expect(count_true(a2)).toBe(8);
		// A02:A05
		expect(a2[0][1]).toBe(true);
		expect(a2[0][2]).toBe(true);
		expect(a2[0][3]).toBe(true);
		expect(a2[0][4]).toBe(true);
		// G07:G10
		expect(a2[6][6]).toBe(true);
		expect(a2[6][7]).toBe(true);
		expect(a2[6][8]).toBe(true);
		expect(a2[6][9]).toBe(true);
	});
	it('rt select entirety of three plates', () => {
		const str = 'P01-A01:P01-H12,P02-A01:P02-H12,P03-A01:P03-H12';
		expect(count_true(parse(str, 'rt', 0))).toBe(96);
		expect(count_true(parse(str, 'rt', 1))).toBe(96);
		expect(count_true(parse(str, 'rt', 2))).toBe(96);
		expect(count_true(parse(str, 'rt', 3))).toBe(0);
	});
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
