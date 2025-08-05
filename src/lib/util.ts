const nCols = 12;
const nRows = 8;

function getRowIndex(str: string): number {
	const row = str.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	if (row >=0 && row < nRows) {
		return row;
	}
	return -1;
}

function getColIndex(str: string): number {
	const col = parseInt(str.substring(1), 10);
	if (col>0 && col <= nCols) {
		return col-1;
	}
	return -1;
}

export function append_to_array(str: string, label: string, array: Array<Array<string>>) {
	for (const region of str.split(',')){
		if (region === '') {
			return;
		}
		const [start, end] = region.split(':');
		if(!start){
			// invalid
			return;
		}
		if(!end){
			// single cell
			const row = getRowIndex(start);
			const col = getColIndex(start);
			if(row<0 || col<0){
				return;
			}
			array[row][col] = label;
		}
		else {
			// range of cells
		const rowStart = getRowIndex(start);
		const colStart = getColIndex(start);
		const rowEnd = getRowIndex(end);
		const colEnd = getColIndex(end);
		if(rowStart<0 || rowEnd<0 || colStart<0 || colEnd<0){
			return;
		}
		if(rowStart > rowEnd || colStart > colEnd){
			return;
		}
		console.log(rowStart, rowEnd, colStart, colEnd);
		for (let row = rowStart; row <= rowEnd; ++row){
			for (let col = colStart; col <= colEnd; ++col){
				console.log(row, col);
				array[row][col] = label;
			}
		}
		}
	}
}

export function parse(p5: string, p7: string, rt: string): Array<Array<string>> {
	const array = Array.from({ length: nRows }, () =>
		Array.from({ length: nCols }, () => '')
	);
	append_to_array(p5, "p5", array);
	append_to_array(p7, "p7", array);
	append_to_array(rt, "rt", array);
	return array;
}