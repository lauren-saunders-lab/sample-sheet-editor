const nCols = 12;
const nRows = 8;

type SeqType = 'p5' | 'p7' | 'rt';

type Experiment = {
	experiment_name: string;
	path_fastq: string;
	path_bcl: string;
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
	cells_per_well: number;
};

type TsvRow = Experiment & Sample;

const tsvHeaders: Array<keyof TsvRow> = [
	'path_fastq',
	'path_bcl',
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
		hashing: '',
		cells_per_well: 1000
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
		hashing: '',
		cells_per_well: 0
	};
}

function makeDefaultExperiment(): Experiment {
	return {
		path_fastq: '/data',
		path_bcl: '/data',
		experiment_name: 'experiment',
		global_p5_p7: false
	};
}

function makeEmptyExperiment(): Experiment {
	return { path_fastq: '', path_bcl: '', experiment_name: '', global_p5_p7: false };
}

function getPlateIndex(str: string, type: SeqType): number {
	// returns zero-based index of plate
	if (type !== 'rt') {
		return 0;
	}
	const plate_index = parseInt(str.split('-')[0].substring(1), 10) - 1;
	if (plate_index >= 0) {
		return plate_index;
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
	plate_index: number = 0,
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
			if (getPlateIndex(start, type) === plate_index) {
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
			if (getPlateIndex(start, type) === plate_index) {
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

function getOccupiedWells(samples: Array<Sample>, plate_index: number): Array<Array<boolean>> {
	let occupied = parse(samples[0].rt, 'rt', plate_index);
	if (plate_index === 0) {
		occupied = parse(samples[0].p5, 'p5', plate_index, occupied);
		occupied = parse(samples[0].p7, 'p7', plate_index, occupied);
	}
	for (const sample of samples.slice(1)) {
		occupied = parse(sample.rt, 'rt', plate_index, occupied);
	}
	return occupied;
}

function additionalSelectionValid(
	str: string,
	additional_str: string,
	type: SeqType,
	plate_index: number = 0,
	occupied: Array<Array<boolean>>
): boolean {
	const existing_wells = parse(str, type, plate_index);
	const new_wells = parse(additional_str, type, plate_index);
	let no_op = true;
	for (let col = 0; col < nCols; col++) {
		for (let row = 0; row < nRows; row++) {
			if (new_wells[row][col] && occupied[row][col]) {
				// selection is invalid if it includes a well that is already taken by another sample
				return false;
			}
			if (!existing_wells[row][col] && new_wells[row][col]) {
				// if a new well differs from the existing well this is not a no-op
				no_op = false;
			}
		}
	}
	// selection is only valid if it modifies the existing selection
	return !no_op;
}

function count_rt_plates(str: string): number {
	// returns the number of plates needed to display the given string
	const regex = /P(\d{2})-/g;
	let match;
	let count = 1;
	while ((match = regex.exec(str)) !== null) {
		// We want to find the plate with the highest index
		count = Math.max(count, parseInt(match[1]));
	}
	return count;
}

function count_rt_wells(str: string): number {
	const type = 'rt';
	const max_plate_index = count_rt_plates(str);
	let sum = 0;
	for (let plate_index = 0; plate_index < max_plate_index; plate_index++) {
		sum += parse(str, type, plate_index)
			.flat()
			.filter((e) => e).length;
	}
	return sum;
}

function import_tsv(tsv: string) {
	const experiment = makeEmptyExperiment();
	const samples: Array<Sample> = [];
	let num_plates = 1;
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
		// calculate number of cells per well for this sample
		sample.cells_per_well = Math.floor(
			parseInt(tsvRow.n_expected_cells) / count_rt_wells(tsvRow.rt)
		);
		// ensure we display enough plates
		num_plates = Math.max(num_plates, count_rt_plates(tsvRow.rt));
		samples.push(sample);
		// update experiment
		for (const [key, value] of Object.entries(experiment)) {
			experiment[key] = tsvRow?.[key] ?? value;
		}
	}
	// if all samples have the same p5/p7 assume they are defined for the whole experiment
	if (
		samples.filter((e) => {
			return e.p5 !== samples[0].p5 || e.p7 !== samples[0].p7;
		}).length === 0
	) {
		experiment.global_p5_p7 = true;
	}
	return { experiment: experiment, samples: samples, num_plates: num_plates };
}

function export_tsv(experiment: Experiment, samples: Array<Sample>): string {
	const lines = [tsvHeaders.join('\t')];
	for (const sample of samples) {
		// values set in experiment take precedence over those set in the sample
		const tsvRow = { ...sample, ...experiment };
		// if p5 and p7 are global, use the values from the first sample for all samples
		if (experiment.global_p5_p7) {
			tsvRow.p5 = samples[0].p5;
			tsvRow.p7 = samples[0].p7;
		}
		// calculate number of cells
		tsvRow.n_expected_cells = Math.floor(
			tsvRow.cells_per_well * count_rt_wells(tsvRow.rt)
		).toString();
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
	count_rt_wells,
	count_rt_plates,
	tsvHeaders,
	makeDefaultSample,
	makeDefaultExperiment,
	makeEmptyExperiment,
	makeEmptySample,
	additionalSelectionValid,
	getOccupiedWells,
	import_tsv,
	export_tsv
};
