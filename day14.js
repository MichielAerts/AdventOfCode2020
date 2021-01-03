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

    const instructions = await getInput('inputDay14');
    // console.log(instructions);
    let mask;
    let memory = new Map();
    // for (let i = 0; i < instructions.length; i++) {
    //     const { type, initialAddressDec, value } = toOperation(instructions[i]);
    //     // console.log([type, initialAddressDec, value]);
    //     if (type === 'mask') {
    //         mask = value;
    //     } else {
    //         // mem
    //         const input = parseInt(value).toString(2).padStart(36, '0');
    //         // console.log(input)
    //         const masked = parseInt(input.applyMask(mask), 2);
    //         memory[initialAddressDec] = masked;
    //     }
    // }

    // Chip V2
    for (let i = 0; i < instructions.length; i++) {
    // for (let i = 0; i < 10; i++) {
        const { type, initialAddressDec, value } = toOperation(instructions[i]);
        // console.log([type, initialAddressDec, value]);
        if (type === 'mask') {
            mask = value;
            // console.log('current mask: ' + mask);
        } else {
            // mem
            const initialAddressBits = parseInt(initialAddressDec).toString(2).padStart(36, '0');
            const addresses = initialAddressBits.applyMaskWithFloatingBits(mask);
            // console.log(addresses)
            // const masked = parseInt(input.applyMask(mask), 2);
            for (let address of addresses) {
                const address_d = parseInt(address, 2) + 0;
                const value_d = parseInt(value);
                // console.log('address: ' + address_d + ', value ' + value_d);
                memory.set(address_d, value_d);
            }
        }
    }

    // console.log(memory);
    console.log([...memory.values()].reduce((x1, x2) => x1 + x2, 0));
}


String.prototype.applyMaskWithFloatingBits = function(mask) {
    if (this.length !== mask.length) {
        console.log('nope');
    }
    // console.log(this);
    // console.log(mask);

    let inputArr = this.split('');
    let outputArrays = [];
    const x_positions = getAllIndexes(mask, "X");
    const x_length = x_positions.size;
    for (let i = 0; i < Math.pow(2, x_length); i++) {
        const i_str = i.toString(2).padStart(x_length, '0');
        let outputArray = inputArr.slice();
        for (let j = 0; j < this.length; j++) {
            if (x_positions.has(j)) {
                outputArray[j] = i_str[x_positions.get(j)];
            } else if (mask[j] == '1') {
                outputArray[j] = '1';
            }
        }
        outputArrays.push(outputArray.reduce((a, b) => a.concat(b)));
    }
    return outputArrays;
}

function getAllIndexes(arr, val) {
    let indexes = new Map();
    let count = 0; 
    for (let i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.set(i, count++);
    return indexes;
}

String.prototype.applyMask = function(mask) {
    if (this.length !== mask.length) {
        console.log('nope');
    }
    let inputArr = this.split('');
    // console.log( inputArr );
    for (let i = 0; i < this.length; i++) {
        if (mask[i] !== 'X') {
            inputArr[i] = mask[i];
        }
    }
    return inputArr.reduce((a, b) => a.concat(b));
}

function toOperation(line) {
    let _, type, value, initialAddressDec;
    // console.log(line);
    if (line.startsWith('mask')) {
        [_, type, value] = /^(mask) = ([X01]+)$/.exec(line)
    } else {
        [_, type, initialAddressDec, value] = /^(mem)\[(\d+)\] = (\d+)$/.exec(line);
    }
    return { type, initialAddressDec, value };
}

calcResult();