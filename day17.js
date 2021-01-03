'use strict';

const fs = require('fs-extra');

async function getInput(file) {
    return await fs.readFile(file)
        .then(content => content.toString())
        .then(content => content.replace(/\r/g, ""))
        .then(content => content.split('\n'))
        .catch(error => console.log(`ERROR: ${pathToFile}, ${error.message}`));
}

async function calcResult() {

    const rawInput = await getInput('inputDay17');
    let sliceInput = rawInput.map(line => line.split(''));
    const turns = 6;
    let input = initArray(sliceInput, turns);
    // console.log(JSON.stringify(input));
    let output;
    for (let i = 0; i < turns; i++) {
        //     // count++
        output = doRound(input, sliceInput, turns);
        // console.log(JSON.stringify(output));
        input = output;
        //     // break;
    }
    console.log(
        output.reduce((x1, x2) => x1.concat(x2))
        .reduce((x1, x2) => x1.concat(x2))
        .reduce((x1, x2) => x1.concat(x2))
        .filter(e => e === '#')
        .length
    );
}

function initArray(slice, turns) {
    // initialize array
    // slice starting at 0,0. initialize with empty values no_turns around the slice in x, y, z dir
    const array = [];
    const l = slice[0].length;
    const slice_0 = turns + 1; // is 0,0,0 in example = 2,2,2  
    // 1,2,2 . => #
    // console.log(slice + ', ' + turns);
    for (let w = 0; w < (l + 2 * turns + 2); w++) {
        array[w] = []
        for (let z = 0; z < (l + 2 * turns + 2); z++) {
            // console.log(z);
            array[w][z] = [];
            for (let y = 0; y < (l + 2 * turns + 2); y++) {
                array[w][z][y] = [];
                for (let x = 0; x < (l + 2 * turns + 2); x++) {
                    if (w === slice_0 && z === slice_0 && y >= slice_0 && x >= slice_0) {
                        array[w][z][y][x] = (slice[y - slice_0] !== undefined && slice[y - slice_0][x - slice_0] !== undefined) ? slice[y - slice_0][x - slice_0] : '.';
                    } else {
                        array[w][z][y][x] = '.';
                    }
                    // console.log(x);
                }
            }
        }
    }
    return array;
}

function doRound(input, slice, turns) {
    const l = slice[0].length;
    const start_pos = 1;
    const end_pos = (l + 2 * turns);
    console.log('iterating over ' + start_pos + ' to ' + end_pos);
    let output = JSON.parse(JSON.stringify(input));
    // console.log(input);
    // console.log(output);
    for (let w_pos = start_pos; w_pos <= end_pos; w_pos++) {
        for (let z_pos = start_pos; z_pos <= end_pos; z_pos++) {
            for (let y_pos = start_pos; y_pos <= end_pos; y_pos++) {
                for (let x_pos = start_pos; x_pos <= end_pos; x_pos++) {
                    const state_start = input[w_pos][z_pos][y_pos][x_pos];
                    // console.log('state ' + state_start + ', pos: ' + [z_pos, y_pos, x_pos]);

                    output[w_pos][z_pos][y_pos][x_pos] = changeCube(state_start, getAdjacentCubes({ w_pos, z_pos, y_pos, x_pos }, input));
                }
            }
        }
    }
    return output;
}

function getAdjacentCubes({ w_pos, z_pos, y_pos, x_pos }, input) {

    const positions = [
        [w_pos - 1, z_pos - 1, y_pos - 1, x_pos - 1],
        [w_pos - 1, z_pos - 1, y_pos - 1, x_pos],
        [w_pos - 1, z_pos - 1, y_pos - 1, x_pos + 1],
        [w_pos - 1, z_pos - 1, y_pos, x_pos - 1],
        [w_pos - 1, z_pos - 1, y_pos, x_pos],
        [w_pos - 1, z_pos - 1, y_pos, x_pos + 1],
        [w_pos - 1, z_pos - 1, y_pos + 1, x_pos - 1],
        [w_pos - 1, z_pos - 1, y_pos + 1, x_pos],
        [w_pos - 1, z_pos - 1, y_pos + 1, x_pos + 1],
        [w_pos - 1, z_pos, y_pos - 1, x_pos - 1],
        [w_pos - 1, z_pos, y_pos - 1, x_pos],
        [w_pos - 1, z_pos, y_pos - 1, x_pos + 1],
        [w_pos - 1, z_pos, y_pos, x_pos - 1],
        [w_pos - 1, z_pos, y_pos, x_pos],
        [w_pos - 1, z_pos, y_pos, x_pos + 1],
        [w_pos - 1, z_pos, y_pos + 1, x_pos - 1],
        [w_pos - 1, z_pos, y_pos + 1, x_pos],
        [w_pos - 1, z_pos, y_pos + 1, x_pos + 1],
        [w_pos - 1, z_pos + 1, y_pos - 1, x_pos - 1],
        [w_pos - 1, z_pos + 1, y_pos - 1, x_pos],
        [w_pos - 1, z_pos + 1, y_pos - 1, x_pos + 1],
        [w_pos - 1, z_pos + 1, y_pos, x_pos - 1],
        [w_pos - 1, z_pos + 1, y_pos, x_pos],
        [w_pos - 1, z_pos + 1, y_pos, x_pos + 1],
        [w_pos - 1, z_pos + 1, y_pos + 1, x_pos - 1],
        [w_pos - 1, z_pos + 1, y_pos + 1, x_pos],
        [w_pos - 1, z_pos + 1, y_pos + 1, x_pos + 1],
        [w_pos, z_pos - 1, y_pos - 1, x_pos - 1],
        [w_pos, z_pos - 1, y_pos - 1, x_pos],
        [w_pos, z_pos - 1, y_pos - 1, x_pos + 1],
        [w_pos, z_pos - 1, y_pos, x_pos - 1],
        [w_pos, z_pos - 1, y_pos, x_pos],
        [w_pos, z_pos - 1, y_pos, x_pos + 1],
        [w_pos, z_pos - 1, y_pos + 1, x_pos - 1],
        [w_pos, z_pos - 1, y_pos + 1, x_pos],
        [w_pos, z_pos - 1, y_pos + 1, x_pos + 1],
        [w_pos, z_pos, y_pos - 1, x_pos - 1],
        [w_pos, z_pos, y_pos - 1, x_pos],
        [w_pos, z_pos, y_pos - 1, x_pos + 1],
        [w_pos, z_pos, y_pos, x_pos - 1],
        [w_pos, z_pos, y_pos, x_pos + 1],
        [w_pos, z_pos, y_pos + 1, x_pos - 1],
        [w_pos, z_pos, y_pos + 1, x_pos],
        [w_pos, z_pos, y_pos + 1, x_pos + 1],
        [w_pos, z_pos + 1, y_pos - 1, x_pos - 1],
        [w_pos, z_pos + 1, y_pos - 1, x_pos],
        [w_pos, z_pos + 1, y_pos - 1, x_pos + 1],
        [w_pos, z_pos + 1, y_pos, x_pos - 1],
        [w_pos, z_pos + 1, y_pos, x_pos],
        [w_pos, z_pos + 1, y_pos, x_pos + 1],
        [w_pos, z_pos + 1, y_pos + 1, x_pos - 1],
        [w_pos, z_pos + 1, y_pos + 1, x_pos],
        [w_pos, z_pos + 1, y_pos + 1, x_pos + 1],
        [w_pos + 1, z_pos - 1, y_pos - 1, x_pos - 1],
        [w_pos + 1, z_pos - 1, y_pos - 1, x_pos],
        [w_pos + 1, z_pos - 1, y_pos - 1, x_pos + 1],
        [w_pos + 1, z_pos - 1, y_pos, x_pos - 1],
        [w_pos + 1, z_pos - 1, y_pos, x_pos],
        [w_pos + 1, z_pos - 1, y_pos, x_pos + 1],
        [w_pos + 1, z_pos - 1, y_pos + 1, x_pos - 1],
        [w_pos + 1, z_pos - 1, y_pos + 1, x_pos],
        [w_pos + 1, z_pos - 1, y_pos + 1, x_pos + 1],
        [w_pos + 1, z_pos, y_pos - 1, x_pos - 1],
        [w_pos + 1, z_pos, y_pos - 1, x_pos],
        [w_pos + 1, z_pos, y_pos - 1, x_pos + 1],
        [w_pos + 1, z_pos, y_pos, x_pos - 1],
        [w_pos + 1, z_pos, y_pos, x_pos],
        [w_pos + 1, z_pos, y_pos, x_pos + 1],
        [w_pos + 1, z_pos, y_pos + 1, x_pos - 1],
        [w_pos + 1, z_pos, y_pos + 1, x_pos],
        [w_pos + 1, z_pos, y_pos + 1, x_pos + 1],
        [w_pos + 1, z_pos + 1, y_pos - 1, x_pos - 1],
        [w_pos + 1, z_pos + 1, y_pos - 1, x_pos],
        [w_pos + 1, z_pos + 1, y_pos - 1, x_pos + 1],
        [w_pos + 1, z_pos + 1, y_pos, x_pos - 1],
        [w_pos + 1, z_pos + 1, y_pos, x_pos],
        [w_pos + 1, z_pos + 1, y_pos, x_pos + 1],
        [w_pos + 1, z_pos + 1, y_pos + 1, x_pos - 1],
        [w_pos + 1, z_pos + 1, y_pos + 1, x_pos],
        [w_pos + 1, z_pos + 1, y_pos + 1, x_pos + 1],
    ];

    return positions.map(([w, z, y, x]) => input[w][z][y][x]);
}

function changeCube(currentCube, adjacentCubes) {
    const noActive = adjacentCubes.filter(s => s === '#').length;
    // console.log(noActive + ', ' + adjacentCubes);

    switch (currentCube) {
        case '#':
            return (noActive === 2 || noActive === 3) ? '#' : '.';
        case '.':
            return (noActive === 3) ? '#' : '.';
    }
}


calcResult();