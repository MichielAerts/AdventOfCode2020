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

    const rawInput = await getInput('inputDay21');
    const list = rawInput.map(l => toIngAndAll(l));
    console.log(list);
    const ingredients = new Set(list.map(r => r[0]).reduce((x1, x2) => x1.concat(x2)));
    const allergens = new Set(list.map(r => r[1]).reduce((x1, x2) => x1.concat(x2)));
    const matrix = new Matrix(ingredients, allergens);
    list.forEach(rule => matrix.addRule(rule));
    // const noAll = matrix.getNoAllergens();
    // console.log(noAll);
    // const appearances = list.map(([i, a]) => i)
    //     .reduce((x1, x2) => x1.concat(x2))
    //     .filter(e => noAll.includes(e)).length;
    // console.log(appearances);

    const ing_by_allergen = matrix.findAllergens();
    ing_by_allergen.sort((a, b) => (a[0] < b[0]) ? -1 : +1);
    console.log(ing_by_allergen);
    console.log(ing_by_allergen.map(([a, i]) => i).join(','));
}

class Matrix {

    constructor(ingredients, allergens) {
        // ingredient, index or allergen, index
        this.ingredientsMap = new Map();
        this.allergensMap = new Map();
        // console.log(ingredients);
        // ingredient, allergen
        this.matrix = [];
        let idx = 0;
        for (let ing of [...ingredients]) {
            this.ingredientsMap.set(ing, idx++);
        }
        idx = 0;
        for (let all of [...allergens]) {
            this.allergensMap.set(all, idx++);
        }
        for (let i = 0; i < this.ingredientsMap.size; i++) {
            let row = [];
            for (let j = 0; j < this.allergensMap.size; j++) {
                row.push('0');
            }
            this.matrix.push(row);
        }
        console.log(this.allergensMap);
        this.printMatrix();
    }

    findAllergens() {
        const foundAllergens = [];
        const allergensSize = this.allergensMap.size;
        while (foundAllergens.length < allergensSize) {
            for (let a of [...this.allergensMap.keys()]) {
                const list = this.getIngredientListForAllergen(a);
                const a_idx = this.allergensMap.get(a);
                // console.log(list);
                if (list.filter(e => e === '?').length === 1){
                    const ing_idx = list.indexOf('?');
                    // console.log(ing_idx);
                    const ing = this.getIngredientForIndex(ing_idx);
                    foundAllergens.push([a, ing[0]]);
                    const currentRow = this.matrix[ing_idx];
                    // console.log(currentRow);
                    const newRow = [];
                    for (let [idx, e] of currentRow.entries()) {
                        if (idx === a_idx) {
                            newRow.push('X')
                        } else {
                            newRow.push('-');
                        }
                    }
                    this.matrix[ing_idx] = newRow;
                    // console.log(foundAllergens);
                    break;
                }
            }
        }
        return foundAllergens;
    }

    getIngredientListForAllergen(allergen) {
        const idx = this.allergensMap.get(allergen);
        return this.matrix.map(r => r[idx]);
    }

    getIngredientForIndex(idx) {
        return [...this.ingredientsMap.entries()]
            .filter(([i, i_idx]) => i_idx === idx)
            .map(([i, i_idx]) => i);
    }

    getNoAllergens() {
        const noAllergens = [];
        for (let [idx, row_i] of this.matrix.entries()) {
            if (row_i.every(e => e === '-')) {
                noAllergens.push(this.getIngredientForIndex(idx));
            }
        }
        return noAllergens.reduce((x1, x2) => x1.concat(x2));
    }

    addRule([ing, all]) {
        console.log([ing, all]);
        // [ [ 'mxmxvkd', 'kfcds', 'sqjhc', 'nhms' ], [ 'dairy', 'fish' ] ]
        for (let i of [...this.ingredientsMap.keys()]) {
            for (let a of all) {
                const currentStatus = this.matrix[this.ingredientsMap.get(i)][this.allergensMap.get(a)];
                const newStatus = ing.includes(i) ? '?' : '-';
                // console.log([this.ingredientsMap.get(i), this.allergensMap.get(a)]);
                this.matrix[this.ingredientsMap.get(i)][this.allergensMap.get(a)] = (currentStatus === '-') ? currentStatus : newStatus;
            }
        }
        this.printMatrix();
    }

    printMatrix() {
        const pad = 20;
        let firstLine = ' '.padStart(pad);
        for (let a of [...this.allergensMap.keys()]) {
            firstLine += a.padStart(pad);
        }
        console.log(firstLine);
        for (let i of [...this.ingredientsMap.keys()]) {
            let line = i.padStart(pad);
            for (let a of [...this.allergensMap.keys()]) {
                line += this.matrix[this.ingredientsMap.get(i)][this.allergensMap.get(a)].padStart(pad);
            }
            console.log(line);
        }
    }
}

function toIngAndAll(line) {
    const [rawIng, rawAll] = line.split(' (contains ');
    const ing = rawIng.split(' ');
    const all = rawAll.replace(')', '').split(', ');
    return [ing, all];
}
calcResult();