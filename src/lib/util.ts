const nCols = 12;
const nRows = 8;

type SeqType = 'p5' | 'p7' | 'rt';

type Sample = {
	path_fastq?: string;
	path_bcl?: string;
	experiment_name: string;
	sample_name: string;
	species: string;
	n_expected_cells: string;
	p5: string;
	p7: string;
	rt: string;
	hashing?: string;
};

const sampleHeaders = [
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
		path_fastq: 'data',
		path_bcl: 'data',
		experiment_name: 'experiment',
		sample_name: 'sample',
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
		path_fastq: '',
		experiment_name: '',
		sample_name: '',
		species: '',
		n_expected_cells: '',
		p5: '',
		p7: '',
		rt: ''
	};
}

function getPlateIndex(str: string, type: SeqType): number {
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

function parse(str: string, type: SeqType, plate_index: number = 0): Array<Array<boolean>> {
	const array = Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => false));
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

function additionalSelectionValid(
	str: string,
	additional_str: string,
	type: SeqType,
	plate_index: number = 0
): boolean {
	const a = parse(str, type, plate_index);
	const b = parse(additional_str, type, plate_index);
	for (let col = 0; col < nCols; col++) {
		for (let row = 0; row < nRows; row++) {
			if (!a[row][col] && b[row][col]) {
				return true;
			}
		}
	}
	return false;
}

export {
	type Sample,
	type SeqType,
	parse,
	sampleHeaders,
	makeDefaultSample,
	makeEmptySample,
	additionalSelectionValid
};
