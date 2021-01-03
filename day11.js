// day 1
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

    const rawInput = await getInput('inputDay11');
    let input = rawInput.map(line => line.split(''));
    console.log(input);
    let output;
    // let count = 0;
    for (;;) {
        // count++
        output = doRound(input);
        // console.log(output);
        if (JSON.stringify(output) === JSON.stringify(input)) {
            break;
        }
        input = output;
        // break;
    }
    // console.log('c ' + count);
    const flat_output = output.reduce((x1, x2) => x1.concat(x2));
    // console.log(flat_output);
    console.log(flat_output.filter(e => e === '#').length);
}

function doRound(input) {
    let output = JSON.parse(JSON.stringify(input));
    const row_length = input.length;
    const col_length = input[0].length;

    for (let row_pos = 0; row_pos < row_length; row_pos++) {
        for (let col_pos = 0; col_pos < col_length; col_pos++) {
            // console.log('r: ' + row_pos + ', c: ' + col_pos);
            const seat_start = input[row_pos][col_pos];
            // output[row_pos][col_pos] = changeSeat(seat_start, getAdjacentSeats({ row_pos, col_pos }, input));
            output[row_pos][col_pos] = changeSeatV2(seat_start, getSeatsInSight({ row_pos, col_pos }, input));

        }
    }
    return output;
}

function getSeatsInSight({ row_pos, col_pos }, input) {
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, +1],
        [0, -1],
        [0, +1],
        [+1, -1],
        [+1, 0],
        [+1, +1]
    ];
    // return directions.map(([r, c]) => getFirstSeatInDirection({ row_pos, col_pos }, [r, c], input)).filter(s => s);

    return directions.map(([r, c]) => getFirstSeatInDirection({ row_pos, col_pos }, [r, c], input))
        .filter(s => s)
}

function getFirstSeatInDirection({ row_pos, col_pos }, [r_dir, c_dir], input) {
    let new_row_pos = row_pos + r_dir;
    let new_col_pos = col_pos + c_dir;
    let potential_seat;
    for (;;) {
        if (!input[new_row_pos] || !input[new_row_pos][new_col_pos]) {
            return undefined;
        }
        potential_seat = input[new_row_pos][new_col_pos];
        // console.log('new r: ' + new_row_pos + ', new c:' + new_col_pos + ', pot seat: ' + potential_seat);
        if (potential_seat !== '.') {
            return potential_seat;
        }
        new_row_pos += r_dir;
        new_col_pos += c_dir;
    }
}

function getAdjacentSeats({ row_pos, col_pos }, input) {
    const positions = [
        [row_pos - 1, col_pos - 1],
        [row_pos - 1, col_pos],
        [row_pos - 1, col_pos + 1],
        [row_pos, col_pos - 1],
        [row_pos, col_pos + 1],
        [row_pos + 1, col_pos - 1],
        [row_pos + 1, col_pos],
        [row_pos + 1, col_pos + 1]
    ];
    return positions.filter(([r, c]) => input[r] && input[r][c]).map(([r, c]) => input[r][c]);
}

function changeSeatV2(currentSeat, firstSeatsInSight) {
    switch (currentSeat) {
        case '.':
            return '.';
        case 'L':
            return (firstSeatsInSight.filter(s => s === '#').length === 0) ? '#' : 'L';
        case '#':
            return (firstSeatsInSight.filter(s => s === '#').length >= 5) ? 'L' : '#';
    }
}

function changeSeat(currentSeat, adjacentSeats) {
    switch (currentSeat) {
        case '.':
            return '.';
        case 'L':
            return (adjacentSeats.filter(s => s === '#').length === 0) ? '#' : 'L';
        case '#':
            return (adjacentSeats.filter(s => s === '#').length >= 4) ? 'L' : '#';
    }
}


calcResult();