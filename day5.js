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
    const input = await getInput('inputDay5');
    // console.log(input);

    const allSeatIds = input
        .map(code => getSeat(code))
        .map(seat => getSeatId(seat));

    const maxSeatId = allSeatIds
        .reduce((a1, a2) => a1 > a2 ? a1 : a2);

    for (var i = 0; i < maxSeatId; i++) {
        if (!allSeatIds.includes(i)) {
            console.log('missing ' + i);
        }
    }
};

function getSeatId([row, column]) {
    return row * 8 + column;
}

function getSeat(code, lower, upper) {
    const row = getIndex("F", code.substring(0, 8), 0, 127);
    const column = getIndex("L", code.substring(7, 10), 0, 7);
    return [row, column];
}

function getIndex(left, code, lower, upper) {
    const halfRange = (upper - lower + 1) / 2;
    if (code.length === 1) {
        return (code === left) ? lower : upper;
    } else {
        if (code[0] === left) {
            return getIndex(left, code.substring(1), lower, upper - halfRange);
        }
        return getIndex(left, code.substring(1), lower + halfRange, upper);
    }
}

calcResult();