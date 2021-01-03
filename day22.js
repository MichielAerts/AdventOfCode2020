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

    const rawInput = await getInput('inputDay22');
    const [deck_p1, deck_p2] = rawInput.map(x => toDeck(x));
    // console.log(deck_p1);
    const { winnerGame, decks: [res_deck_p1, res_deck_p2] } = playGameOfRecursiveCombat(deck_p1, deck_p2);
    // const max_rounds = 99999;
    // for (let r = 0; r < max_rounds; r++) {
    //     // playRound(deck_p1, deck_p2);

    //     // console.log('deck p1: ' + deck_p1);
    //     // console.log('deck p2: ' + deck_p2);
    //     if (deck_p1.length === 0 || deck_p2.length === 0) {
    //         break;
    //     }
    // }
    if (winnerGame === 'p1') {
        console.log('score p1: ' + score(res_deck_p1));
    }
    if (winnerGame === 'p2') {
        console.log('score p2: ' + score(res_deck_p2));
    }

    //guesses 8464
}

function playGameOfRecursiveCombat(initDeck_p1, initDeck_p2) {
    const max_rounds = 9999999999999999;
    const prevDeckList = [];
    let currentDeck_p1 = initDeck_p1;
    let currentDeck_p2 = initDeck_p2;
    let winnerGame;
    // console.log('starting game, deck p1: ' + initDeck_p1 + ', decks p2: ' + initDeck_p2);
    for (let r = 0; r < max_rounds; r++) {
        if (r % 500 === 0 && r > 0) {
            console.log(r);
        }
        let winnerRound;

        if (prevDeckList.map(([prevDeck_p1, prevDeck_p2]) => prevDeck_p1).has(currentDeck_p1) ||
            prevDeckList.map(([prevDeck_p1, prevDeck_p2]) => prevDeck_p2).has(currentDeck_p2)) {
            // console.log('found current deck in previous decks, P1 wins');
            winnerGame = 'p1';
            break;
        }
        prevDeckList.push([currentDeck_p1.slice(), currentDeck_p2.slice()]);
        const card_p1 = currentDeck_p1.shift();
        const card_p2 = currentDeck_p2.shift();

        if (currentDeck_p1.length >= card_p1 && currentDeck_p2.length >= card_p2) {
            let { winnerGame } = playGameOfRecursiveCombat(currentDeck_p1.slice(0, card_p1), currentDeck_p2.slice(0, card_p2));
            winnerRound = winnerGame;
        } else {
            winnerRound = (card_p1 > card_p2) ? 'p1' : 'p2';
        }

        if (winnerRound === 'p1') {
            currentDeck_p1.push(card_p1, card_p2);    
        } else {
            currentDeck_p2.push(card_p2, card_p1);
        }
        // console.log('winner round: ' + winnerRound + ', updated deck p1: ' + currentDeck_p1 + ', p2: ' + currentDeck_p2);
        if (currentDeck_p1.length === 0 || currentDeck_p2.length === 0) {
            winnerGame = (currentDeck_p1.length === 0) ? 'p2' : 'p1';
            break;
        }
    }
    return { winnerGame, decks: [currentDeck_p1, currentDeck_p2] };
}

Array.prototype.has = function(deck) {
    return this.filter(e => JSON.stringify(e) === JSON.stringify(deck)).length > 0;
};

function score(deck) {
    const no_cards = deck.length;
    let score = 0;
    let score_per_card = no_cards;
    for (let i = 0; i < no_cards; i++) {
        score += deck[i] * score_per_card--;
        // console.log(score);
    }
    return score;
}

function playRound(deck_p1, deck_p2) {
    const card_p1 = deck_p1.shift();
    const card_p2 = deck_p2.shift();
    if (card_p1 > card_p2) {
        deck_p1.push(card_p1, card_p2);
    } else {
        deck_p2.push(card_p2, card_p1);
    }

}

function toDeck(line) {
    return line.split('\n').slice(1).map(n => parseInt(n));
}

calcResult();