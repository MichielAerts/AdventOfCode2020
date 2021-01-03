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

    // const [ time, buses] = await getInput('inputDay13');
    // const { bus, wait } = findNextBus(parseInt(time), 
    //     buses.split(',').filter(bus => bus !== 'x').map(x => parseInt(x))
    //     );
    // console.log(bus * wait);

    const [ _, timeLine ] = await getInput('inputDay13');
    // console.log(3417 % 19);
    const timestamp = findTimestamp(timeLine.split(','));
    // console.log(timestamp);
}

function findTimestamp(timeLine) {
    // console.log(timeLine);

    let mods = [];
    let idxs = []; 
    let rems = [];
    for (let [idx, val] of timeLine.entries()) {
        // console.log([idx, val]);
        if (val !== 'x') {
            val = parseInt(val);
            mods.push(val);
            const fact = Math.floor(idx / val);
            const new_idx = idx - fact * val;
            idxs.push(new_idx);
            const rem = (val - new_idx);
            rems.push(rem);
        } 
    }
    console.log(mods);
    console.log(idxs)
    rems[0] = 0;
    console.log(rems)
    const res = crt(mods, rems);
    console.log(res);
    // guesses: 556100168221173, 556100168221141
    console.log(res % 41);
    let init_t = 556100168221141;
    for (let t = init_t; t < init_t + 102; t++) {
        console.log((t - init_t) + ', bus:' + mods.filter(b => t % b == 0));
    }  
}

function crt(num, rem) {
  let sum = 0;
  const prod = num.reduce((a, c) => a * c, 1);
 
  for (let i = 0; i < num.length; i++) {
    const [ni, ri] = [num[i], rem[i]];
    const p = Math.floor(prod / ni);
    sum += ri * p * mulInv(p, ni);
  }
  return sum % prod;
}
 
function mulInv(a, b) {
  const b0 = b;
  let [x0, x1] = [0, 1];
 
  if (b === 1) {
    return 1;
  }
  while (a > 1) {
    const q = Math.floor(a / b);
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
}
 
// console.log(crt([3,5,7], [2,3,2]))

function findNextBus(time, buses) {
    let nextTime = time;
    console.log(buses);
    for (;;) {
        for (let bus of buses) {
            if (nextTime % bus === 0) {
                console.log(`time: ${nextTime}, bus: ${bus}`);
                return { bus, wait: (nextTime - time)};
            }
        }
        nextTime += 1;
    }
}

calcResult();