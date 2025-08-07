const nCols = 12;
const nRows = 8;

function getPlateIndex(str: string, type: string): number {
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

function getRowIndex(str: string, type: string): number {
	if (type === 'rt') {
		str = str.split('-')[1];
	}
	const row = str.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	if (row >= 0 && row < nRows) {
		return row;
	}
	return -1;
}

function getColIndex(str: string, type: string): number {
	if (type === 'rt') {
		str = str.split('-')[1];
	}
	const col = parseInt(str.substring(1), 10);
	if (col > 0 && col <= nCols) {
		return col - 1;
	}
	return -1;
}

export function parse(str: string, type: string, plate_index: number = 0): Array<Array<boolean>> {
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
