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

    const rawInput = await getInput('inputDay25');
    const [card_pk, door_pk] = rawInput.map(n => parseInt(n));
    console.log([card_pk, door_pk]);

    const cardLoopSize = findLoopSize(card_pk);
    console.log(cardLoopSize);

    const doorLoopSize = findLoopSize(door_pk);
    console.log(doorLoopSize);
    
    const encKey1 = transform(cardLoopSize, door_pk);
    console.log(encKey1);  

    const encKey2 = transform(doorLoopSize, card_pk);
    console.log(encKey2);  
} 

function findLoopSize(pk, subjectNumber = 7) {
    let i = 0;
    let result = 1;
    while(result !== pk) {
        if (i++ % 1000 === 0) {
            // console.log(i);
        } 
        result = (result * subjectNumber) % 20201227;
    }
    return i;
}

function transform(loopSize, subjectNumber = 7) {
    let value = 1;
    for (let i = 1; i <= loopSize; i++) {
        // console.log(value);
        value = (value * subjectNumber) % 20201227;
    }
    return value;
}


calcResult();