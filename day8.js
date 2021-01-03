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

    const instructions = await getInput('inputDay8');
    // console.log(instructions);

    // for (let o = 0; o < instructions.length; o++) {
    //     console.log(o);

    let acc = 0;
    let idx = 0;
    let instruction;

    const no_steps = 30000;
    const executedInstructions = new Set();

    for (let i = 0; i < no_steps; i++) {
        instruction = instructions[idx];
        let [_, op, sign, amountStr] = /^(\w{3}) (\+|-)(\d+)$/.exec(instruction);
        const amount = parseInt(amountStr);

        // if (idx === o) {
        //     if (op === 'nop') {
        //         op = 'jmp';
        //     }
        //     if (op === 'jmp') {
        //         op = 'nop';
        //     }
        // }
        switch (op) {
            case 'nop':
                {
                    idx += 1;
                    break;
                }
            case 'acc':
                {
                    idx += 1;
                    acc += (sign === '+') ? amount : -amount;
                    break;
                }
            case 'jmp':
                {
                    idx += (sign === '+') ? amount : -amount;
                    break;
                }
        }
        if (idx = 633) {
            console.log(idx);
            break;
        }
        if (executedInstructions.has(idx)) {
            console.log('loopie');
            break;
        }
        executedInstructions.add(idx);
    }
    console.log(acc);
    // };
}

async function looper() {

    const instructions = await getInput('inputDay8');
    // console.log(instructions);

    for (let o = 0; o < instructions.length; o++) {
        console.log(o);

        let acc = 0;
        let idx = 0;
        let instruction;

        const no_steps = 30000;
        const executedInstructions = new Set();

        for (let i = 0; i < no_steps; i++) {
            instruction = instructions[idx];
            let [_, op, sign, amountStr] = /^(\w{3}) (\+|-)(\d+)$/.exec(instruction);
            const amount = parseInt(amountStr);

            if (idx === o) {
                if (op === 'nop') {
                    op = 'jmp';
                }
                if (op === 'jmp') {
                    op = 'nop';
                }
            }
            switch (op) {
                case 'nop':
                    {
                        idx += 1;
                        break;
                    }
                case 'acc':
                    {
                        idx += 1;
                        acc += (sign === '+') ? amount : -amount;
                        break;
                    }
                case 'jmp':
                    {
                        idx += (sign === '+') ? amount : -amount;
                        break;
                    }
            }
            if (idx === 633) {
                console.log('last instruction');
                break;
            }
            if (executedInstructions.has(idx)) {
                console.log('in loop');
                break;
            }
            executedInstructions.add(idx);
        }
        console.log(acc);
    };
}
looper();
// calcResult();