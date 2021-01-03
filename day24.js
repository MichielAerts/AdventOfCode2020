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

    const rawInput = await getInput('inputDay24');
    const list = rawInput.map(l => toSteps(l));
    // console.log(list);
    const blackTiles = new Set();
    for (const steps of list) {
        const tile = flipTile(steps);
        const stringRepTile = JSON.stringify(tile);
        if (blackTiles.has(stringRepTile)) {
            blackTiles.delete(stringRepTile);
        } else {
            blackTiles.add(stringRepTile);
        }
    }

    console.log(blackTiles);
    // console.log(blackTiles.size);

    const days = 100;
    let [floor, size] = initFloor(blackTiles, days);
    console.log('number of black tiles:' + [...floor.entries()].filter(([k, v]) => v === 'b').length);
    // print(floor, size);
    // console.log(floor);
    for (let d = 1; d <= days; d++) {
        console.log('day ' + d);

        floor = doDay(floor, size);
        // print(floor, size);
        const numberOfBlackTiles = [...floor.entries()].filter(([k, v]) => v === 'b').length;
        // console.log(floor);
        console.log('number of black tiles:' + numberOfBlackTiles);
    }
}

function doDay(floor, size) {
    const newFloor = new Map();
    for (const tileJson of [...floor.keys()]) {
        const [q, r] = JSON.parse(tileJson);
        if (Math.abs(q) === size || Math.abs(r) === size) {
            // on edge, skip
            continue;
        }
        const newStatus = flip(tileJson, floor);
        newFloor.set(tileJson, newStatus);
    }
    return newFloor;
}

function flip(tileJson, floor) {
    const neighbours = [
        [+1, 0], //e
        [+1, -1], //ne
        [0, +1], // se
        [-1, 0], // w
        [0, -1], // nw
        [-1, +1] // sw
    ]
    // console.log(tileJson);
    const [q_t, r_t] = JSON.parse(tileJson);
    const currentStatus = floor.get(tileJson);
    const adjacentTiles = neighbours
        .map(([q_n, r_n]) => [q_n + q_t, r_n + r_t])
        .map(c => JSON.stringify(c));
    const adjacentTileStatusses = adjacentTiles.map(cJson => floor.get(cJson));    
    const numberOfAdjacentBlackTiles = adjacentTileStatusses.filter(s => s === 'b').length;
    
    let newStatus = currentStatus;
    if (currentStatus === 'b' && (numberOfAdjacentBlackTiles === 0 || numberOfAdjacentBlackTiles > 2)) {
        newStatus = 'w';
    } else if (currentStatus === 'w' && numberOfAdjacentBlackTiles === 2) {
        newStatus = 'b';
    }
    // console.log(tileJson + ', current: ' + currentStatus + ', new: ' + newStatus + ', neighbours: ' + adjacentTiles + ', ' + adjacentTileStatusses);
    
    return newStatus;
}

function initFloor(blackTilesJson, days) {
    const blackTiles = [...blackTilesJson].map(x => JSON.parse(x));

    const maxCoor = blackTiles
        .reduce((x1, x2) => x1.concat(x2))
        .reduce((x1, x2) => (Math.abs(x1) > Math.abs(x2)) ? Math.abs(x1) : Math.abs(x2));
    const size = maxCoor + days + 2;
    // console.log(blackTiles);
    const floor = new Map();
    for (let q = -size; q <= size; q++) {
        for (let r = -size; r <= size; r++) {
            const coorJson = JSON.stringify([q, r]);
            floor.set(coorJson, blackTilesJson.has(coorJson) ? 'b' : 'w');
        }
    }
    return [floor, size];
}

Array.prototype.doStep = function(step) {

    // axial coordinates

    switch (step) {
        case 'e':
            return [this[0] + 1, this[1]];
        case 'ne':
            return [this[0] + 1, this[1] - 1];
        case 'se':
            return [this[0], this[1] + 1];
        case 'w':
            return [this[0] - 1, this[1]];
        case 'nw':
            return [this[0], this[1] - 1];
        case 'sw':
            return [this[0] - 1, this[1] + 1];
    }
};

function flipTile(steps) {
    let coor = [0, 0];
    // console.log('starting coor: ' + coor);
    for (let step of steps) {
        coor = coor.doStep(step);
        // console.log(step + ', resulting coor: ' + coor);
    }
    // console.log('final coor: ' + coor);
    return coor;
}


function print(floor, size) {
    for (let q = -size; q <= size; q++) {
        let line = '';
        for (let r = -size; r <= size; r++) {
            const coorJson = JSON.stringify([q, r]);
            const status = floor.get(coorJson);
            line += ((q === 0 || r === 0) ? status.toUpperCase() : status) + ' ';
        }
        console.log(line);
    }
}


function toSteps(line) {
    const steps = line.match(/(se)|(ne)|(e)|(sw)|(nw)|(w)/g);
    return steps;
}
calcResult();