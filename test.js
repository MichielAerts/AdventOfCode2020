const m =
[
  [1,2,3],
  [4,5,6], 
  [7,8,9]
]

function rotate(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

function flipHorizontally(matrix) {
	return matrix.map(row => row.reverse());
}

function flipVertically(matrix) {
	return matrix.reverse();
}

// const m2 = rotate(m);
// const m3 = rotate(m2);
// console.log(m2);
// console.log(m3);

console.log(flipVertically(m));