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

    const input = await getInput('inputDay7');
    // console.log(input);
    const ruleList = input.map(line => toRule(line));
    // console.log(ruleList);
    // const appropiateBags = ruleList.filter(bag => canContain(ruleList, bag, { color: 'shiny gold', number: 1}));
    const numberOfBags = countNumberOfBags(ruleList, ruleList.filter(rule => rule.color === 'shiny gold')[0]);
    // console.log(appropiateBags);
    console.log(numberOfBags);
};

function countNumberOfBags(ruleList, currentBag) {
    // console.log(currentBag);
    let number = 0;
    for (let content of currentBag.contents) {
        number += content.number;
        // console.log(`adding ${content.color}, ${number}`);
        const innerBag = ruleList.filter(rule => rule.color === content.color)[0];
        for (var i = 1; i <= content.number; i++) {
            number += countNumberOfBags(ruleList, innerBag);
            // console.log(`added inner bags of ${innerBag.color}, ${number}`);
        }
    }
    return number;
}

// { color, number }
function canContain(ruleList, currentBag, wantedBag) {
    // console.log(currentBag.contents);
    for (let content of currentBag.contents) {
        // console.log(content);
        if (content.color === wantedBag.color && content.number >= wantedBag.number) {
            return true;
        } else {
            // console.log(ruleList);
            const innerBag = ruleList.filter(rule => rule.color === content.color)[0];
            // console.log(innerBag);
            if (canContain(ruleList, innerBag, wantedBag)) {
                return true;
            }
        }
    }
    return false;
}

function toRule(line) {
    // console.log(line);
    const [bag, contents] = line.split(' contain ');
    const [_, bagColor] = /^(.*) bags$/.exec(bag);
    let bagContents = [];
    if (contents !== 'no other bags.') {
        const bagContentList = contents.split(", ");
        // console.log(bagContentList);
        for (let type of bagContentList) {
            let [_, number, color] = /^(\d+) (.*) bags?\.?$/.exec(type);
            bagContents.push({ number: parseInt(number), color });
        }
    }
    return ({ 'color': bagColor, 'contents': bagContents });
}

calcResult();