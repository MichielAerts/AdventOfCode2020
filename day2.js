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
    const input = await getInput('inputDay2');
    // first part console.log(input.map(composeRegex).filter(testRegex).length);
    console.log(input.map(composeRegex2).filter(testRegex2).length);
};

function composeRegex(line) {
    const [full, o_min, o_max, letter, pw] = /^(\d+)-(\d+) (\w+): (\w+)$/.exec(line);
    const regExp = new RegExp(`${letter}`, 'g');
    return { regExp, o_min, o_max, pw };
}


function composeRegex2(line) {
    const [full, o_min, o_max, letter, pw] = /^(\d+)-(\d+) (\w+): (\w+)$/.exec(line);
    return { letter, o_min, o_max, pw };
}

function testRegex({ regExp, o_min, o_max, pw }) {
    console.log({ regExp, o_min, o_max, pw });
    const occurence = pw.match(regExp) ? pw.match(regExp).length: 0;
    return occurence >= o_min && occurence <= o_max;
}


function testRegex2({ letter, o_min, o_max, pw }) {
    let numberOfMatches = 0;
    
    if (pw[o_min - 1] === letter) numberOfMatches++;
    if (pw[o_max - 1] === letter) numberOfMatches++;
    // console.log({ letter, o_min, o_max, pw, numberOfMatches });
    return numberOfMatches === 1;
}

calcResult();