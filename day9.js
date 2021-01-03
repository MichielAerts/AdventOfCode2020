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

    const rawInput = await getInput('inputDay9');
    const input = rawInput.map(a => parseInt(a));
    // console.log(input);
    const no = 25;
    // for (let i = no; i < input.length; i++) {
    //     if (!checkSum(input.slice(i - no, i), input[i])) {
    //         // 127
    //         // 133015568
    //         console.log(input[i]);
    //         break;
    //     }
    // }
    const sum = 133015568;

    for (let i = 0; i < input.length; i++) {
        if (checkSumTotal(input.slice(i), sum).result) {
            const numbers = checkSumTotal(input.slice(i), sum).sum_numbers;
            console.log(numbers);
            const smallest = numbers.reduce((x1, x2) => x1 < x2 ? x1 : x2);
            const largest = numbers.reduce((x1, x2) => x1 < x2 ? x2 : x1);
            console.log(`adding them: ${smallest + largest}`);
            break;
        }
    } 
};

function checkSumTotal(numbers, check) {
    let sum = 0;
    let i = 0;
    while (sum < check) {
        sum += numbers[i++];
        // console.log(sum);
        if (sum === check) {
            return { result: true, sum_numbers: numbers.slice(0, i) };
        }
    }
    return { result: false, numbers: []};
}

function checkSum(numbers, next) {
    // console.log(`input array: ${numbers} and number to be checked: ${next}`);
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] + numbers[j] === next) {
                // console.log(`match: ${numbers[i]} & ${numbers[j]}`);
                return true;
            }
        }
    }
    return false;
}

calcResult();