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

    const rawInput = await getInput('inputDay10');
    const rawSortedInput = rawInput.map(a => parseInt(a)).sort(function(a, b) { return a - b });
    const input = [0, ...rawSortedInput, rawSortedInput[rawSortedInput.length - 1] + 3];
    console.log(input);

    let diffs = [];
    for (let i = 1; i < input.length; i++) {
        const diff = input[i] - input[i - 1];
        diffs.push(diff);
    }
    console.log(diffs);
    let ones = 0;
    console.log(diffs.toString()
        .split('3'));
    const one_seq_length =
        diffs.toString()
        .split('3')
        .filter(e => !e.includes('3'))
        .reduce(
            (map, obj) => {
                const number_of_ones = (obj.match(/1/g) || []).length;
                if (map.has(number_of_ones)) {
                    map.set(number_of_ones, (map.get(number_of_ones) + 1));
                } else {
                    map.set(number_of_ones, 1);
                }
                return map;
            }, new Map());
    console.log(one_seq_length);
    for (const entry of one_seq_length.entries()) {
        console.log(entry);
    }
    // const number = one_seq_length.get(2) + 2 * one_seq_length.get(3) + 3 * one_seq_length.get(4);
    // const number = 2 ^ one_seq_length.get(2) * 3 ^ one_seq_length.get(3) * 7 * one_seq_length.get(4);
    const number = Math.pow(2, one_seq_length.get(2)) * Math.pow(4, one_seq_length.get(3)) * Math.pow(7, one_seq_length.get(4));
    // 2 ^ aantal_2 * 4 ^ aantal_3 * 7 ^aantal_4? 
    console.log(number);
}
calcResult();