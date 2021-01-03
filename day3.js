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
    const input = await getInput('inputDay3');
    console.log(slopes.map(([step_x, step_y]) => calcTrees(input, step_x, step_y)).reduce((x1, x2) => x1 * x2));
};

function calcTrees(input, step_x, step_y) {
    let number_of_trees = 0;
    const y_length = input.length;
    const x_length = input[0].length;
    
    let x_cur = 0;
    let y_cur = 0;

    while (y_cur < y_length) {
        const tree = input[y_cur][x_cur];
        if (tree === '#') {
            number_of_trees++;
        }
        x_cur = (x_cur + step_x) % x_length;
        y_cur += step_y;
    }
    return number_of_trees;
}

calcResult();