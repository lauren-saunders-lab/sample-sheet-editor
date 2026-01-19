const nCols = 12;
const nRows = 8;

type SeqType = 'p5' | 'p7' | 'rt';

type Experiment = {
	experiment_name: string;
	path_reads: string;
	global_p5_p7: boolean;
};

type Sample = {
	sample_name: string;
	species: string;
	n_expected_cells: string;
	p5: string;
	p7: string;
	rt: string;
	hashing?: string;
};

type TsvRow = Experiment & Sample;

const tsvHeaders: Array<keyof TsvRow> = [
	'path_reads',
	'experiment_name',
	'sample_name',
	'species',
	'n_expected_cells',
	'p5',
	'p7',
	'rt',
	'hashing'
];

function makeDefaultSample(): Sample {
	return {
		sample_name: 'sample1',
		species: 'mouse',
		n_expected_cells: '100',
		p5: '',
		p7: '',
		rt: '',
		hashing: ''
	};
}

function makeEmptySample(): Sample {
	return {
		sample_name: '',
		species: '',
		n_expected_cells: '',
		p5: '',
		p7: '',
		rt: '',
		hashing: ''
	};
}

function makeDefaultExperiment(): Experiment {
	return {
		path_reads: '/data',
		experiment_name: 'experiment',
		global_p5_p7: false
	};
}

function makeEmptyExperiment(): Experiment {
	return { path_reads: '', experiment_name: '', global_p5_p7: false };
}

function getPlateIndex(str: string, type: SeqType): number {
	// returns zero-based index of plate
	if (type !== 'rt') {
		return 0;
	}
	const plateIndex = parseInt(str.split('-')[0].substring(1), 10) - 1;
	if (plateIndex >= 0) {
		return plateIndex;
	} else {
		return -1;
	}
}

function getRowIndex(str: string, type: SeqType): number {
	if (type === 'rt') {
		str = str.split('-')[1];
	}
	const row = str.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	if (row >= 0 && row < nRows) {
		return row;
	}
	return -1;
}

function getColIndex(str: string, type: SeqType): number {
	if (type === 'rt') {
		str = str.split('-')[1];
	}
	const col = parseInt(str.substring(1), 10);
	if (col > 0 && col <= nCols) {
		return col - 1;
	}
	return -1;
}

function parse(
	str: string,
	type: SeqType,
	plateIndex: number = 0,
	array = Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => false))
): Array<Array<boolean>> {
	for (const region of str.split(',')) {
		if (region === '') {
			return array;
		}
		const [start, end] = region.split(':');
		if (!start) {
			// invalid
			return array;
		}
		if (!end) {
			// single cell
			const row = getRowIndex(start, type);
			const col = getColIndex(start, type);
			if (row < 0 || col < 0) {
				return array;
			}
			if (getPlateIndex(start, type) === plateIndex) {
				array[row][col] = true;
			}
		} else {
			// range of cells
			const rowStart = getRowIndex(start, type);
			const colStart = getColIndex(start, type);
			const rowEnd = getRowIndex(end, type);
			const colEnd = getColIndex(end, type);
			if (rowStart < 0 || rowEnd < 0 || colStart < 0 || colEnd < 0) {
				return array;
			}
			if (rowStart > rowEnd || colStart > colEnd) {
				return array;
			}
			if (getPlateIndex(start, type) === plateIndex) {
				for (let row = rowStart; row <= rowEnd; ++row) {
					for (let col = colStart; col <= colEnd; ++col) {
						array[row][col] = true;
					}
				}
			}
		}
	}
	return array;
}

function removePlate(str: string, plateIndex: number): string {
	// remove all assignments to the given plate from the string, where plateIndex is 0-based
	const plate = `P${String(plateIndex + 1).padStart(2, '0')}`;
	const regex = new RegExp(`${plate}-.{3}(?:,|:|$)`, 'g');
	// remove any trailing commas
	return str.replace(regex, '').split(',').filter(Boolean).join(',');
}

function additionalSelectionValid(
	str: string,
	additionalStr: string,
	type: SeqType,
	plateIndex: number = 0
): boolean {
	const existingWells = parse(str, type, plateIndex);
	const additionalWells = parse(additionalStr, type, plateIndex);
	let isNoOp = true;
	for (let col = 0; col < nCols; col++) {
		for (let row = 0; row < nRows; row++) {
			if (!existingWells[row][col] && additionalWells[row][col]) {
				// if an additional well differs from the existing well this is not a no-op
				isNoOp = false;
			}
		}
	}
	// additional selection is only valid if it modifies the existing selection
	return !isNoOp;
}

function countPlates(str: string): number {
	// returns the number of plates needed to display the given rt string
	const regex = /P(\d{2})-/g;
	let match;
	let count = 1;
	while ((match = regex.exec(str)) !== null) {
		// We want to find the plate with the highest index
		count = Math.max(count, parseInt(match[1]));
	}
	return count;
}

function getPathReads(tsvRow: Record<string, string>): string {
	// Returns path_reads
	for (const key of ['path_reads', 'path_fastq', 'path_bcl']) {
		const value = tsvRow?.[key]?.trim();
		if (value) {
			return value;
		}
	}
	return '';
}

function importTsv(tsv: string) {
	const experiment = makeEmptyExperiment();
	const samples: Array<Sample> = [];
	let numPlates = 1;
	const lines = [];
	for (const line of tsv.trim().split('\n')) {
		lines.push(line.split('\t').map((l) => l.trim()));
	}
	const headers = lines[0];
	for (const line of lines.slice(1)) {
		// read tsv row
		const tsvRow: Record<string, string> = {};
		for (let j = 0; j < Math.min(headers.length, line.length); j++) {
			tsvRow[headers[j]] = line[j];
		}
		// create empty sample and update with data from row
		const sample: Sample = makeEmptySample();
		for (const [key, value] of Object.entries(sample)) {
			sample[key] = tsvRow?.[key] ?? value;
		}
		// ensure we display enough plates
		numPlates = Math.max(numPlates, countPlates(tsvRow.rt));
		samples.push(sample);
		// update experiment
		for (const [key, value] of Object.entries(experiment)) {
			experiment[key] = tsvRow?.[key] ?? value;
		}
		experiment.path_reads = getPathReads(tsvRow);
	}
	// if all samples have the same p5/p7 assume they are defined for the whole experiment
	if (
		samples.filter((e) => {
			return e.p5 !== samples[0].p5 || e.p7 !== samples[0].p7;
		}).length === 0
	) {
		experiment.global_p5_p7 = true;
	}
	return { experiment: experiment, samples: samples, numPlates: numPlates };
}

function exportTsv(experiment: Experiment, samples: Array<Sample>): string {
	const lines = [tsvHeaders.join('\t')];
	for (const sample of samples) {
		// values set in experiment take precedence over those set in the sample
		const tsvRow = { ...sample, ...experiment };
		// if p5 and p7 are global, use the values from the first sample for all samples
		if (experiment.global_p5_p7) {
			tsvRow.p5 = samples[0].p5;
			tsvRow.p7 = samples[0].p7;
		}
		lines.push(
			tsvHeaders
				.map((header) => {
					return tsvRow[header] ?? '';
				})
				.join('\t')
		);
	}
	return lines.join('\n');
}

export {
	type Experiment,
	type Sample,
	type SeqType,
	type TsvRow,
	parse,
	countPlates,
	tsvHeaders,
	makeDefaultSample,
	makeDefaultExperiment,
	makeEmptyExperiment,
	makeEmptySample,
	additionalSelectionValid,
	removePlate,
	importTsv,
	exportTsv
};
