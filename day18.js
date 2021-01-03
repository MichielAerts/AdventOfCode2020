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

    const rawInput = await getInput('inputDay18');
    const input = rawInput.map(line => line.replace(/ /g, '').split('').map(x => toOp(x)));
    // console.log(
    //     input.map(l => solve(l).map(e => e.type))
    //     .reduce((x1, x2) => x1.concat(x2))
    //     .reduce((x1, x2) => x1 + x2, 0));
    console.log(
        input.map(l => solveWithNewRules(l).map(e => e.type))
        .reduce((x1, x2) => x1.concat(x2))
        .reduce((x1, x2) => x1 + x2, 0));

}

function solve(input) {
    // console.log(input);
    if (input.length === 3) {
        if (input[0].cat !== 'no' || input[1].cat !== 'op' || input[2].cat !== 'no') {
            console.log('can\'t do this');
        }
        const result = (input[1].type === '+') ? input[0].type + input[2].type : input[0].type * input[2].type;
        return [{ cat: 'no', type: result }]
    }
    if (input.filter(i => i.cat === 'p').length > 0) {
        let [start, finish] = findParentheses(input);
        // console.log([start, finish]);
        return solve(input.slice(0, start).concat(solve(input.slice(start + 1, finish))).concat(input.slice(finish + 1)));
    }
    return solve(solve(input.slice(0, 3)).concat(input.slice(3)));

}


function solveWithNewRules(input) {
    // console.log(input);
    if (input.length === 3) {
        if (input[0].cat !== 'no' || input[1].cat !== 'op' || input[2].cat !== 'no') {
            console.log('can\'t do this');
        }
        const result = (input[1].type === '+') ? input[0].type + input[2].type : input[0].type * input[2].type;
        return [{ cat: 'no', type: result }]
    }
    if (input.filter(i => i.cat === 'p').length > 0) {
        let [start, finish] = findParentheses(input);
        // console.log([start, finish]);
        return solveWithNewRules(input.slice(0, start).concat(solveWithNewRules(input.slice(start + 1, finish))).concat(input.slice(finish + 1)));
    }
    if (input.filter(i => i.type === '+').length > 0) {
        let pos = findPlus(input);
        // console.log(pos);
        // console.log(input.slice(pos + 2));
        return solveWithNewRules(input.slice(0, pos - 1).concat(solveWithNewRules(input.slice(pos - 1, pos + 2))).concat(input.slice(pos + 2)));
    }
    return solveWithNewRules(solveWithNewRules(input.slice(0, 3)).concat(input.slice(3)));

}

function findPlus(input) {
    for (let [i, e] of input.entries()) {
        if (e.type === '+') {
            return i;
        }
    }
}

function findParentheses(input) {
    let start, finish;
    let level = 0;
    for (let [i, e] of input.entries()) {
        if (e.type === '(') {
            if (start === undefined) {
                start = i;
            } else {
                level++;
            }
        }
        if (e.type === ')') {
            if (level === 0) {
                finish = i;
                break;
            } else {
                level--;
            }
        }
    }
    return [start, finish];
}

function toOp(input) {
    switch (input) {
        case '+':
            return { cat: 'op', type: '+' };
        case '*':
            return { cat: 'op', type: '*' };
        case '(':
            return { cat: 'p', type: '(' };
        case ')':
            return { cat: 'p', type: ')' };
        default:
            return { cat: 'no', type: parseInt(input) };
    }
}

calcResult();