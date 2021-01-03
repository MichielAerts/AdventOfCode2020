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

    const input = await getInput('inputDay12');
    // console.log(input);

    // let { coor: [x, y] } = input
    // .map(getAction)
    // .reduce((coorAndDir, action) => performMove(coorAndDir, action), { coor: [0, 0], dir: [1, 0] });

    let { coor: [x, y] } = input
    .map(getAction)
    .reduce((coorAndWaypoint, action) => 
        performMoveWithWaypoint(coorAndWaypoint, action), { coor: [0, 0], waypoint: [10, 1] });

    console.log(`end coordinates: ${x}, ${y}, Manhatten distance = ${Math.abs(x) + Math.abs(y)}`);
}

    // Action L means to turn left the given number of degrees. (x, y) -> (-y, x)
    // oost [1, 0] => noord [0, 1]
    // noord [0, 1] => west [-1, 0]
    // west [-1, 0] => zuid [0, -1]
    // zuid [0, -1] => oost [1, 0]
    // Action R means to turn right the given number of degrees. clockwise (x, y) -> (y, -x)

function rotateVector(vec, ang)
{
    ang = ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
};

function performMove({ coor: [x, y], dir: [x_dir, y_dir] }, { op, amount }) {
    // console.log(`before move: coor: ${x}, ${y}, direction: ${x_dir}, ${y_dir}, move: ${op} with ${amount}`);
    switch (op) {
        case 'N': return {coor: [x, y + amount], dir: [x_dir, y_dir]};
        case 'S': return {coor: [x, y - amount], dir: [x_dir, y_dir]};
        case 'E': return {coor: [x + amount, y], dir: [x_dir, y_dir]};
        case 'W': return {coor: [x - amount, y], dir: [x_dir, y_dir]};
        case 'L': return {coor: [x, y], dir: rotateVector([x_dir, y_dir], amount)};
        case 'R': return {coor: [x, y], dir: rotateVector([x_dir, y_dir], -amount)};
        case 'F': return {coor: [x + x_dir * amount, y + y_dir * amount], dir: [x_dir, y_dir]};
    }

    //     Action N means to move north by the given value.
    // Action S means to move south by the given value.
    // Action E means to move east by the given value.
    // Action W means to move west by the given value.
    // Action L means to turn left the given number of degrees. (x, y) -> (-y, x)
    // oost [1, 0] => noord [0, 1]
    // noord [0, 1] => west [-1, 0]
    // west [-1, 0] => zuid [0, -1]
    // zuid [0, -1] => oost [1, 0]
    // Action R means to turn right the given number of degrees. clockwise (x, y) -> (y, -x)
    // Action F means to move forward by the given value in the direction the ship is currently facing.
}

function performMoveWithWaypoint({ coor: [x, y], waypoint: [x_wp, y_wp] }, { op, amount }) {
    // console.log(`before move: coor: ${x}, ${y}, waypoint: ${x_wp}, ${y_wp}, move: ${op} with ${amount}`);
    switch (op) {
        case 'N': return {coor: [x, y], waypoint: [x_wp, y_wp + amount]};
        case 'S': return {coor: [x, y], waypoint: [x_wp, y_wp - amount]};
        case 'E': return {coor: [x, y], waypoint: [x_wp + amount, y_wp]};
        case 'W': return {coor: [x, y], waypoint: [x_wp - amount, y_wp]};
        case 'L': return {coor: [x, y], waypoint: rotateVector([x_wp, y_wp], amount)};
        case 'R': return {coor: [x, y], waypoint: rotateVector([x_wp, y_wp], -amount)};
        case 'F': return {coor: [x + x_wp * amount, y + y_wp * amount], waypoint: [x_wp, y_wp]};
    }
    // Action N means to move the waypoint north by the given value.
    // Action S means to move the waypoint south by the given value.
    // Action E means to move the waypoint east by the given value.
    // Action W means to move the waypoint west by the given value.
    // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
    // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
    // Action F means to move forward to the waypoint a number of times equal to the given value.
}

function getAction(line) {
    // con/^([A-Z])(\d+)$/.exec(line);sole.log(line);
    // console.log(/^([A-Z])(\d+)$/.exec(line));
    let [_, op, amount] = /^([A-Z])(\d+)$/.exec(line);
    return { op, amount: parseInt(amount) };
}

calcResult();