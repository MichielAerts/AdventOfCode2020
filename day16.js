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

    const rawInput = await getInput('inputDay16');
    const [ rules, myTicket, nearbyTickets ] = processInput(rawInput);
    const ruleRanges = rules.map(rule => rule.range).reduce((t1, t2) => t1.concat(t2));

//     console.log(nearbyTickets.reduce((t1, t2) => t1.concat(t2))
//         .filter(number => notInRange(ruleRanges, number))
//         .reduce((n1, n2) => n1 + n2));

    const validNearbyTickets = nearbyTickets.filter(t => isValid(ruleRanges, t));
    
    // create map with index and all values for the valid tickets 
    let map = new Map();
    for (let ticket of validNearbyTickets) {
        for (let [i, val] of ticket.entries()) {
            map.merge(i, val);
        }
    }
    // determine possible positions/indexes of the field based on the values and field ranges  
    let possiblePositionsOfField = rules.map(rule => ({ field: rule.field, positions: findPossiblePositionsOfField(rule, map)}));
    
    // sort out the field based on possible positions
    const fieldsToBePlaced = possiblePositionsOfField.length;
    let currentPlacements = 0
    const finalResult = new Map();
    for (;;) {
        if (currentPlacements === fieldsToBePlaced) {
            break;
        }
        for (let {field, positions} of possiblePositionsOfField) {
            if (positions.length === 1) {
                const no = positions[0]
                finalResult.set(field, no);
                currentPlacements++;
                possiblePositionsOfField = possiblePositionsOfField.filter(f => f.field !== field)
                .map((({field, positions}) => ({ field, positions: positions.filter(v => v !== no)})));
                break;
            }
        }
    }

    console.log(finalResult);

    // get the values for departure fields for my ticket
    console.log([...finalResult.entries()].filter(([k, v]) => k.startsWith('departure'))
        .map(([k, v]) => myTicket[v]).reduce((x1, x2) => x1 * x2)
        )
}

function findPossiblePositionsOfField({ field, range }, map) {
    // console.log(range);
    return [...map.entries()].filter(([k, vs]) => vs.every(v => v.inRange(range))).map(([k, vs]) => k);
}

Number.prototype.inRange = function(validRanges) {
    // console.log(this + ', ' + validRanges);
    return validRanges.some(([low, up]) => this >= low && this <= up)
}

Map.prototype.merge = function(idx, no) {
    if (!this.has(idx)) {
        this.set(idx, [no]);
    } else {
        this.set(idx, this.get(idx).concat(no));
    }
}

function isValid(ruleRanges, ticket) {
    return !ticket.some(n => notInRange(ruleRanges, n));
}

function notInRange(ruleRanges, number) {
    // console.log(number);
    return !ruleRanges.some(([low, up]) => number >= low && number <= up);
}

function processInput([ rawRules, rawMyTicket, rawNearbyTickets]) {
    const rules = rawRules
    .split('\n')
    .map(rawRule => /^(.+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(rawRule))
    .map(regExRes => ({ field: regExRes[1], 
        range: [
        [parseInt(regExRes[2]), parseInt(regExRes[3])], 
        [parseInt(regExRes[4]), parseInt(regExRes[5])]
        ],
    }));   

    const myTicket = rawMyTicket.split('\n')[1].split(',').map(n => parseInt(n));
    
    const nearbyTickets = rawNearbyTickets
    .split('\n')
    .slice(1)
    .map(ticket => ticket.split(','))
    .map(e => e.map(n => parseInt(n)));

    return [ rules, myTicket, nearbyTickets]; 
}

calcResult();