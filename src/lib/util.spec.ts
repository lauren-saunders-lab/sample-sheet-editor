import { describe, it, expect } from 'vitest';
import {
	parse,
	countPlates,
	removePlate,
	type SeqType,
	type Sample,
	importTsv,
	exportTsv,
	additionalSelectionValid,
	makeDefaultSample,
	makeDefaultExperiment,
	makeEmptySample,
	makeEmptyExperiment,
	removeLastPlate,
	updateGlobalPCRIndices,
	mergeRtSelections
} from '$lib/util';

function countTrue(array: Array<Array<boolean>>): number {
	return array.flat().filter((e) => e).length;
}

function makeSample(overrides: Partial<Sample> = {}): Sample {
	return {
		...makeEmptySample(),
		...overrides
	};
}

describe('parse', () => {
	it('empty strings', () => {
		expect(countTrue(parse('', 'p5'))).toBe(0);
		expect(countTrue(parse('', 'p7'))).toBe(0);
		expect(countTrue(parse('', 'rt', 0))).toBe(0);
		expect(countTrue(parse('', 'rt', 1))).toBe(0);
		expect(countTrue(parse('', 'rt', 2))).toBe(0);
	});
	['p5', 'p7'].forEach((type) => {
		it(`valid ${type} wells`, () => {
			const a = parse('A02,H03', type as SeqType);
			// 2 selected wells
			expect(countTrue(a)).toBe(2);
			// A02
			expect(a[0][1]).toBe(true);
			// H03
			expect(a[7][2]).toBe(true);
		});
	});
	it('valid p5 columns', () => {
		const a = parse('A02:C02,B10:G10', 'p5');
		// 9 selected wells
		expect(countTrue(a)).toBe(9);
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
		expect(countTrue(a)).toBe(8);
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
		expect(countTrue(a1)).toBe(9);
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
		expect(countTrue(a2)).toBe(3);
		// C06:E06
		expect(a2[2][5]).toBe(true);
		expect(a2[3][5]).toBe(true);
		expect(a2[4][5]).toBe(true);
	});
	it('valid rt rows over two plates', () => {
		const str = 'P01-A01:P01-A12,P02-A02:P02-A05,P02-G07:P02-G10';
		// 1st plate (index 0):
		const a1 = parse(str, 'rt', 0);
		expect(countTrue(a1)).toBe(12);
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
		expect(countTrue(a2)).toBe(8);
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
		expect(countTrue(parse(str, 'rt', 0))).toBe(96);
		expect(countTrue(parse(str, 'rt', 1))).toBe(96);
		expect(countTrue(parse(str, 'rt', 2))).toBe(96);
		expect(countTrue(parse(str, 'rt', 3))).toBe(0);
	});
	it('invalid ranges or wells produce no selection', () => {
		expect(countTrue(parse('A00', 'p5'))).toBe(0);
		expect(countTrue(parse('I01', 'p5'))).toBe(0);
		expect(countTrue(parse('A13', 'p5'))).toBe(0);
		expect(countTrue(parse('B02:A02', 'p5'))).toBe(0);
		expect(countTrue(parse('A05:A02', 'p7'))).toBe(0);
		expect(countTrue(parse('P01-A01:P01-A00', 'rt', 0))).toBe(0);
	});
});

describe('count plates', () => {
	it('empty string: 1 plate', () => {
		const str = '';
		expect(countPlates(str)).toBe(1);
	});
	it('one well in plate 1: 1 plate', () => {
		const str = 'P01-A02';
		expect(countPlates(str)).toBe(1);
	});
	it('one well in plate 3: 3 plates', () => {
		const str = 'P03-C09';
		expect(countPlates(str)).toBe(3);
	});
	it('four wells in plate 1: 1 plate', () => {
		const str = 'P01-A02,P01-C07,P01-H11,P01-F07';
		expect(countPlates(str)).toBe(1);
	});
	it('two rows in 2 plates: 2 plates', () => {
		const str = 'P01-A01:P01-A12,P02-H01:P02-H12';
		expect(countPlates(str)).toBe(2);
	});
	it('two cols in 1 plate: 1 plate', () => {
		const str = 'P01-A01:P01-H01,P01-A09:P01-H09';
		expect(countPlates(str)).toBe(1);
	});
	it('all wells in 4 plates: 4 plates', () => {
		const str = 'P01-A01:P01-H12,P02-A01:P02-H12,P03-A01:P03-H12,P04-A01:P04-H12';
		expect(countPlates(str)).toBe(4);
	});
});

describe('remove a plate', () => {
	it('removes P02', () => {
		expect(removePlate('P01-A02,P02-B05:P02-C05,P02-A02,P01-B05:P01-C05', 1)).toBe(
			'P01-A02,P01-B05:P01-C05'
		);
		expect(removePlate('P01-A02,P02-B05:P02-C05,P01-B05:P01-C05,P02-A02', 1)).toBe(
			'P01-A02,P01-B05:P01-C05'
		);
	});
	it('removes P01', () => {
		expect(removePlate('P01-A02,P02-B05:P02-C05,P02-A02,P01-B05:P01-C05', 0)).toBe(
			'P02-B05:P02-C05,P02-A02'
		);
	});
	it('removes trailing commas', () => {
		expect(removePlate('P03-A01,P03-A02', 0)).toBe('P03-A01,P03-A02');
	});
	it('no-op when plate not present', () => {
		expect(removePlate('P03-A01,P03-A02', 0)).toBe('P03-A01,P03-A02');
	});
});

describe('remove last plate from samples', () => {
	it('no-op when only one plate', () => {
		const samples = [makeSample({ rt: 'P01-A01' }), makeSample()];
		expect(removeLastPlate(samples, 1)).toBe(1);
		expect(samples[0].rt).toBe('P01-A01');
		expect(samples[1].rt).toBe('');
	});

	it('removes the highest plate index and decrements count', () => {
		const samples = [
			makeSample({ rt: 'P01-A01,P03-B02,P02-C03' }),
			makeSample({ rt: 'P03-A01:P03-A02,P01-H12' })
		];
		expect(removeLastPlate(samples, 3)).toBe(2);
		expect(samples[0].rt).toBe('P01-A01,P02-C03');
		expect(samples[1].rt).toBe('P01-H12');
	});
});

describe('update global PCR indices', () => {
	it('copies p5/p7 to all samples when enabled', () => {
		const samples = [
			makeSample({ p5: 'A01', p7: 'B01' }),
			makeSample({ p5: 'A02', p7: 'B02' }),
			makeSample({ p5: 'A03', p7: 'B03' })
		];
		updateGlobalPCRIndices(samples, true);
		expect(samples[1].p5).toBe('A01');
		expect(samples[1].p7).toBe('B01');
		expect(samples[2].p5).toBe('A01');
		expect(samples[2].p7).toBe('B01');
	});

	it('no-op when disabled', () => {
		const samples = [makeSample({ p5: 'A01', p7: 'B01' }), makeSample({ p5: 'A02', p7: 'B02' })];
		updateGlobalPCRIndices(samples, false);
		expect(samples[1].p5).toBe('A02');
		expect(samples[1].p7).toBe('B02');
	});
});

describe('additional selection validity', () => {
	it('rejects no-op selections', () => {
		expect(additionalSelectionValid('A01', 'A01', 'p5')).toBe(false);
		expect(additionalSelectionValid('A01:B01', 'A01', 'p5')).toBe(false);
	});
	it('accepts selections that add new wells', () => {
		expect(additionalSelectionValid('A01', 'B01', 'p5')).toBe(true);
		expect(additionalSelectionValid('A01', 'A02', 'p7')).toBe(true);
	});
	it('respects plate index for rt', () => {
		const existing = 'P01-A01,P02-B01';
		expect(additionalSelectionValid(existing, 'P02-C01', 'rt', 0)).toBe(false);
		expect(additionalSelectionValid(existing, 'P02-C01', 'rt', 1)).toBe(true);
	});
});

describe('merge rt selections', () => {
	it('normalizes separators and whitespace', () => {
		expect(mergeRtSelections('', '')).toBe('');
		expect(mergeRtSelections('P01-A01', '')).toBe('P01-A01');
		expect(mergeRtSelections('', 'P01-A01')).toBe('P01-A01');
		expect(mergeRtSelections('P01-A01;', 'P01-B01')).toBe('P01-A01;P01-B01');
		expect(mergeRtSelections('P01-A01;;', ';P01-B01;')).toBe('P01-A01;P01-B01');
		expect(mergeRtSelections(' P01-A01 ; P01-B01 ', ' P01-C01 ')).toBe(
			'P01-A01;P01-B01;P01-C01'
		);
	});
});

describe('default/empty builders', () => {
	it('default sample and experiment values are stable', () => {
		expect(makeDefaultSample()).toEqual({
			sample_name: 'sample1',
			species: 'mouse',
			n_expected_cells: '100',
			p5: '',
			p7: '',
			rt: '',
			hashing: ''
		});
		expect(makeDefaultExperiment()).toEqual({
			path_reads: '/data',
			experiment_name: 'experiment',
			global_p5_p7: false
		});
	});
	it('empty sample and experiment values are blank', () => {
		expect(makeEmptySample()).toEqual({
			sample_name: '',
			species: '',
			n_expected_cells: '',
			p5: '',
			p7: '',
			rt: '',
			hashing: ''
		});
		expect(makeEmptyExperiment()).toEqual({
			path_reads: '',
			experiment_name: '',
			global_p5_p7: false
		});
	});
});

describe('tsv import / export', () => {
	it('single sample, contains both path_bcl and path_fastq', () => {
		const str =
			'p5\tp7\texperiment_name\tpath_fastq\tpath_bcl\tsample_name\tspecies\trt\thashing\tn_expected_cells\n' +
			'A01\tB03,C04\texperiment\t/data_fastq\t/data_bcl\tsample1\tmouse\tP01-A02,P01-B05:P01-C05\t\t99';
		const { samples, experiment, numPlates } = importTsv(str);
		expect(numPlates).toBe(1);
		expect(experiment.experiment_name).toBe('experiment');
		// path_fastq takes precedence over path_bcl if both are provided, and converted to path_reads
		expect(experiment.path_reads).toBe('/data_fastq');
		expect(samples.length).toBe(1);
		// sample 1
		expect(samples[0].sample_name).toBe('sample1');
		expect(samples[0].species).toBe('mouse');
		expect(samples[0].hashing).toBe('');
		expect(samples[0].n_expected_cells).toBe('99');
		expect(samples[0].p5).toBe('A01');
		expect(samples[0].p7).toBe('B03,C04');
		expect(samples[0].rt).toBe('P01-A02,P01-B05:P01-C05');
		// this is set to true if p5 and p7 are the same for all samples:
		expect(experiment.global_p5_p7).toBe(true);

		// round-trip export and import
		const tsv = exportTsv(experiment, samples);
		const roundTrip = importTsv(tsv);
		expect(roundTrip.samples).toEqual(samples);
		expect(roundTrip.experiment).toEqual(experiment);
		expect(roundTrip.numPlates).toEqual(numPlates);
	});

	it('two samples with different p5/p7, different column order', () => {
		const str =
			'experiment_name\tpath_bcl\tsample_name\tspecies\tp5\tp7\trt\thashing\tn_expected_cells\n' +
			'experiment\t/data\tsample1\tmouse\tA01\tB03,C04\tP01-A02,P01-B05:P01-C05\t\t27\n' +
			'experiment\t/data\tsample1\tmouse\tA09\tB01\tP02-H02:P02-H11\t\t100';
		const { samples, experiment, numPlates } = importTsv(str);
		expect(numPlates).toBe(2);
		expect(experiment.experiment_name).toBe('experiment');
		expect(experiment.path_reads).toBe('/data');
		expect(samples.length).toBe(2);
		// sample 1
		expect(samples[0].sample_name).toBe('sample1');
		expect(samples[0].species).toBe('mouse');
		expect(samples[0].hashing).toBe('');
		expect(samples[0].n_expected_cells).toBe('27');
		expect(samples[0].p5).toBe('A01');
		expect(samples[0].p7).toBe('B03,C04');
		expect(samples[0].rt).toBe('P01-A02,P01-B05:P01-C05');
		// this is set to true if p5 and p7 are the same for all samples:
		expect(experiment.global_p5_p7).toBe(false);
		// sample 2
		expect(samples[1].sample_name).toBe('sample1');
		expect(samples[1].species).toBe('mouse');
		expect(samples[1].hashing).toBe('');
		expect(samples[1].n_expected_cells).toBe('100');
		expect(samples[1].p5).toBe('A09');
		expect(samples[1].p7).toBe('B01');
		expect(samples[1].rt).toBe('P02-H02:P02-H11');
		// this is set to true if p5 and p7 are the same for all samples:
		expect(experiment.global_p5_p7).toBe(false);

		// round-trip export and import
		const tsv = exportTsv(experiment, samples);
		const roundTrip = importTsv(tsv);
		expect(roundTrip.samples).toEqual(samples);
		expect(roundTrip.experiment).toEqual(experiment);
		expect(roundTrip.numPlates).toEqual(numPlates);
	});

	it('merges duplicate rows that only differ by rt selections', () => {
		const str =
			'sample_name\tspecies\tp5\tp7\trt\thashing\tn_expected_cells\texperiment_name\tpath_bcl\n' +
			'sample1\tmouse\tA01\tB01\tP01-A01\t\t100\texperiment\t/data\n' +
			'sample1\tmouse\tA01\tB01\tP01-B01\t\t100\texperiment\t/data\n' +
			'sample1\tmouse\tA01\tB01\tP01-C01:P01-E01\t\t100\texperiment\t/data\n' +
			'sample1\tmouse\tA01\tB01\tP01-F01;P01-G01\t\t100\texperiment\t/data\n' +
			'sample1\tmouse\tA01\tB01\tP02-A02:P02-A05\t\t100\texperiment\t/data\n' +
			'sample1\tmouse\tA01\tB01\tP01-H12\t\t100\texperiment2\t/data\n' +
			'sample2\tmouse\tA01\tB01\tP01-A02\t\t100\texperiment\t/data';
		const { samples, experiment, numPlates } = importTsv(str);
		// includes P02 selections so we need two plates
		expect(numPlates).toBe(2);
		// sample1/experiment merged, plus one row for experiment2 and one for sample2
		expect(samples.length).toBe(3);
		// merged row: same sample/experiment/p5/p7/etc; rt concatenated in input order
		expect(samples[0]).toEqual({
			sample_name: 'sample1',
			species: 'mouse',
			n_expected_cells: '100',
			p5: 'A01',
			p7: 'B01',
			rt: 'P01-A01;P01-B01;P01-C01:P01-E01;P01-F01;P01-G01;P02-A02:P02-A05',
			hashing: ''
		});
		// different experiment name should not merge
		expect(samples[1]).toEqual({
			sample_name: 'sample1',
			species: 'mouse',
			n_expected_cells: '100',
			p5: 'A01',
			p7: 'B01',
			rt: 'P01-H12',
			hashing: ''
		});
		// different sample name should not merge
		expect(samples[2]).toEqual({
			sample_name: 'sample2',
			species: 'mouse',
			n_expected_cells: '100',
			p5: 'A01',
			p7: 'B01',
			rt: 'P01-A02',
			hashing: ''
		});
		// experiment fields should still reflect the last seen experiment values
		expect(experiment.experiment_name).toBe('experiment');
		// path_reads should be taken from path_bcl
		expect(experiment.path_reads).toBe('/data');
		// all samples still share p5/p7 values
		expect(experiment.global_p5_p7).toBe(true);
	});
});
