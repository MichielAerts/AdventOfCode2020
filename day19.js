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

    const rawInput = await getInput('inputDay19');
    const rawRules = new Map(rawInput[0].split('\n').map(x => toRule(x)));

    // const regex = new RegExp('^' + consolidate(rawRules, '0') + '$');
    const regex_42_str = '(' + consolidate(rawRules, '42') + ')';
    const regex_31_str = '(' + consolidate(rawRules, '31') + ')';

    // 0: 8 11
    // 8: 42 | 42 8
    // 11: 42 31 | 42 11 31
    // 8: 42+  
    // 11: 42 31, of 42 42 31 31 etc.
    // 42 {2,} 31{1,} && 42 komt vaker voor dan 31 
    const regex = new RegExp('^' + '(?<m42_tot>' + regex_42_str + '{2,})' + '(?<m31_tot>' + regex_31_str + '{1,})$');
    const messages = rawInput[1].split('\n');
    let count = 0;
    for (let message of messages) {
        if (regex.test(message)) {
            const data = message.match(regex);   
            // console.log(data.groups);
            const m42_times = data.groups.m42_tot.match(new RegExp(regex_42_str, 'g')).length;
            const m31_times = data.groups.m31_tot.match(new RegExp(regex_31_str, 'g')).length;
            // console.log('match 42: ' + m42_times + ', match 31: ' + m31_times);
            if (m42_times > m31_times) {
                count++;
            }
        }
    }

    console.log(count);
    // console.log(messages.filter(message => regex.test(message)).length);
}

function consolidate(rawRules, start) {
    let content = rawRules.get(start).content;
    // console.log(/\d+/g.exec(content));
    // console.log(content);
    while (content.match(/\d/)) {
        let [res] = /\d+/g.exec(content);
        const rule = rawRules.get(res);
        let c = rule.content;
        if (rule.type === 'char') {
            content = content.replace(res, c);
        } else {
            c = '(' + c + ')';
            if (c.includes('|')) {
                content = content.replace(res, '(' + c.substring(0, c.indexOf('|')) + ')' +
                    '|(' + c.substring(c.indexOf('|') + 1) + ')');
            } else {
                content = content.replace(res, c);
            }
            // content = content.replace(res, (c.includes('|')) ? '((' + c.substring(0, c.indexOf('|')) + ')' : c);
            // console.log(content);
        }
    }
    // console.log(content.replace(/ /g, ''))
    return content.replace(/ /g, '');
}

function toRule(line) {
    const parts = line.split(': ');
    if (parts[1].startsWith('"')) {
        return [parts[0], { type: 'char', content: parts[1].replace(/"/g, '') }]
    } else {
        // const lists = parts[1].split('|');
        // const content = lists; //.map(l => l.split(' ').filter(x => x.length > 0)); 
        // // console.log(content)
        return [parts[0], { type: 'ref', content: parts[1] }]
    }
}

calcResult();