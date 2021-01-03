// day 1
'use strict';

const fs = require('fs-extra');

async function getInput(file) {
    return await fs.readFile(file)
        .then(content => content.toString())
        .then(content => content.replace(/\r/g, ""))
        .then(content => content.split('\n\n'))
        .catch(error => console.log(`ERROR: ${pathToFile}, ${error.message}`));
}

async function calcResult() {
    const input = await getInput('inputDay6');
    // console.log(input);

    // const total = input.map(toSet).map(s => s.size).reduce((x1, x2) => x1 + x2);
    const total = input.map(toSetPlusIndividualAnswers).map(everyoneAnswered).reduce((x1, x2) => x1 + x2);
    console.log(total);
};

function everyoneAnswered([letters, answers]) {
    return [...letters].filter(letter => answers.every(a => a.includes(letter))).length;
}

function toSetPlusIndividualAnswers(line) {
    const letters = new Set(line.replace(/\n/g, "").split(""));
    const answers = line.split("\n");
    return [ letters, answers];
}

function toSet(line) {
    const answers = new Set(line.replace(/\n/g, "").split(""));
    return answers;
}
calcResult();