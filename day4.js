// day 1
'use strict';

const fs = require('fs-extra');

class Passport {

    constructor(line) {
        this.presentFields = new Map(line.replace(/\n/g, " ").split(" ").map(pair => pair.split(":")).filter(key => this.validate(...key)));
        // console.log(this.presentFields);
    }

    isValid() {
        // console.log([...this.presentFields.keys()]);
        return Passport.requiredfields.every(reqField => this.presentFields.has(reqField));
        // return [...this.presentFields.keys()].containsAll(Passport.requiredfields);
    }

    validate(key, value) {
        // console.log(key + " and " + value);
        switch (key) {
            case 'byr': return value.match(/^\d{4}$/) && value.isBetween(1920, 2002);
            case 'iyr': return value.match(/^\d{4}$/) && value.isBetween(2010, 2020);
            case 'eyr': return value.match(/^\d{4}$/) && value.isBetween(2020, 2030);
            case 'hgt': return (value.match(/^\d+cm$/) && value.replace(/cm/g, "").isBetween(150, 193)) || (value.match(/\d+in/) && value.replace(/in/g, "").isBetween(59, 76));
            case 'hcl': return value.match(/^#[0-9a-f]{6}$/);
            case 'ecl': return value.match(/^(amb)|(blu)|(brn)|(gry)|(grn)|(hzl)|(oth)$/);
            case 'pid': return value.match(/^\d{9}$/);
            case 'cid': return true;
        }
        // byr (Birth Year) - four digits; at least 1920 and at most 2002.
        // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        // hgt (Height) - a number followed by either cm or in:
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        // pid (Passport ID) - a nine-digit number, including leading zeroes.
        // cid (Country ID) - ignored, missing or not.
    }

}

Passport.requiredfields = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    // 'cid', // (Country ID)
];

async function getInput(file) {
    return await fs.readFile(file)
        .then(content => content.toString())
        .then(content => content.replace(/\r/g, ""))
        .then(content => content.split('\n\n'))
        .catch(error => console.log(`ERROR: ${pathToFile}, ${error.message}`));
}

async function calcResult() {
    const input = await getInput('inputDay4');
    // console.log(input);

    const validPasswords = input.map(line => new Passport(line)).filter(pw => pw.isValid());
    console.log(validPasswords.length);
    // console.log(slopes.map(([step_x, step_y]) => calcTrees(input, step_x, step_y)).reduce((x1, x2) => x1 * x2));
};

String.prototype.isBetween = function(lower, upper) {
    if (!this.match(/\d+/)) {
        return false;
    } else {
        const intValue = parseInt(this);
        return intValue >= lower && intValue <= upper;
    }
}
calcResult();