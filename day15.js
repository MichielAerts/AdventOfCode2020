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

    const rawInput = await getInput('inputDay15');
    const input = rawInput[0].split(',').map(n => parseInt(n));
    console.log(input);
    const spokenNumbers = new Map();
    let lastNumber;
    let counter = 0;
    for (let no of input) {
        // console.log(no);
        lastNumber = spokenNumbers.merge(no, counter++);
    }
    for (;;) {
        if (spokenNumbers.has(lastNumber) && spokenNumbers.get(lastNumber).length === 1) {
            // console.log('0');
            lastNumber = spokenNumbers.merge(0, counter++);
        } else {
            const turns = spokenNumbers.get(lastNumber);
            const apart = turns[1] - turns[0]
            // console.log(apart)
            lastNumber = spokenNumbers.merge(apart, counter++);
        }
        if (counter % 100000 === 0) {
            console.log(counter);
        }
        if (counter === 30000000) {
        // if (counter === 2020) {
            console.log(lastNumber);
            break;
        }
    }
}

Map.prototype.merge = function(no, counter) {
    if (!this.has(no)) {
        this.set(no, [counter]);
    } else {
        const l = this.get(no).length;
        this.set(no, [this.get(no)[l - 1], counter]);
    }
    return no;
}

calcResult();