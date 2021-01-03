'use strict';

// const fs = require('fs-extra');

async function getInput(file) {
    return await fs.readFile(file)
        .then(content => content.toString())
        .then(content => content.replace(/\r/g, ""))
        .then(content => content.split('\n\n'))
        .catch(error => console.log(`ERROR: ${pathToFile}, ${error.message}`));
}

async function calcResult() {

    // const rawInput = await getInput('inputDay23');
    const rawInput = ['253149867'];

    const max_i = 1000000;
    let rawCups = rawInput[0].split('').map(n => parseInt(n));
    const l = rawCups.length;
    for (let i = l + 1; i <= max_i; i++) {
        rawCups.push(i);
    }
    const cups = new LinkedList(rawCups);
    cups.loop();

    console.log(cups + '!');
    let currentCup;
    const max_m = 10000000;
    for (let m = 1; m <= max_m; m++) {
        // console.log('move ' + m);
        if (m % (max_m / 100) === 0) {
            console.log(m + ', progress ' + (100 * m / max_m) + '%');
        }
        currentCup = doMove(cups, currentCup);
        // console.log(cups);
    }
    // console.log(cups.toArray())
    cups.head = cups.find(1);
    console.log(cups + '!');
    console.log((cups.head.next.value * cups.head.next.next.value));
}

function doMove(cups, previousCup) {
    const currentCup = findCurrentCup(cups, previousCup);
    // console.log('current cup: ' + currentCup);
    cups.head = currentCup;
    const pickup = pickUp(cups);
    // console.log('pickup: ' + pickup);
    // console.log('cups: ' + cups);
    const destinationCupValue = findDestinationCup(currentCup, cups, pickup);
    // console.log('destinationCupValue: ' + destinationCupValue);
    cups.insert(destinationCupValue, pickup);
    // console.log('cups: ' + cups);
    return currentCup;
}

function pickUp(cups) {
    const a = cups.popNext();
    const b = cups.popNext();
    const c = cups.popNext();
    return [a, b, c];
}

function findCurrentCup(cups, previousCup) {
    if (previousCup === undefined) {
        return cups.head;
    } else {
        return previousCup.next;
    }
}

// Array.prototype.insert = function(index, items) {
//     if (index === this.length) {
//         index = 0;
//     }
//     this.splice.apply(this, [index, 0].concat(items));
// }

function findDestinationCup(currentCup, cups, [a, b, c]) {
    let destinationCupValue = currentCup.value - 1;
    if (destinationCupValue < 1) {
        destinationCupValue = cups.size + 3;
    }
    // console.log([a.value, b.value, c.value]);
    while ([a.value, b.value, c.value].includes(destinationCupValue)) {
        // console.log(destinationCupValue);
        destinationCupValue--;
        if (destinationCupValue < 1) {
            destinationCupValue = cups.size + 3;
        }
    }

    return destinationCupValue;
}

class LinkedListNode {
    constructor(value, next) {
        this.value = value;
        this.next = next || null;
    }

    toString() {
        return `value: ${this.value}, next: ${this.next.value}`;
    }
}

class LinkedList {
    constructor(value) {
        this.size = 0;
        this.head = null;
        this.tail = null;
        this.lookup = new Map();

        if (value) {
            if (Array.isArray(value)) return this.fromArray(value);
            return new TypeError(value + ' is not iterable');
        };

        return this;
    }

    toString() {
        return `size: ${this.size}, current head: ${this.head.value}, next 4: ${this.head.next.value}, ${this.head.next.next.value}, ${this.head.next.next.next.value}, ${this.head.next.next.next.next.value}`;
    }

    loop() {
        this.tail.next = this.head;
    }

    prepend(value) {
        this.size += 1;

        const newNode = new LinkedListNode(value, this.head);

        this.head = newNode;
        if (!this.tail) this.tail = newNode;
        return this;
    }

    insert(value, items) {
        const node = this.find(value);
        // console.log(node);
        const originalNext = node.next;
        let currentNode = node;
        for (let item of items) {
            // console.log(item);
            this.size += 1;
            currentNode.next = item;
            item.next = originalNext;
            currentNode = item;
            // console.log(currentNode);
        }
        // console.log(node);
    }

    append(value) {
        this.size += 1;

        const newNode = new LinkedListNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return this;
        }

        this.tail.next = newNode;
        this.tail = newNode;
        return this;
    }

    fromArray(values) {
        values.forEach(value => this.append(value));
        return this;
    }

    toArray(useNodes = false) {
        const nodes = [];
        let currentNode = this.head;
        while (currentNode) {
            nodes.push(useNodes ? currentNode : currentNode.value);
            currentNode = currentNode.next;
            if (!useNodes && nodes.includes(currentNode.value)) {
                break;
            }
        };
        return nodes;
    }


    includes(value) {
        if (!this.head) return false;

        let isNode = value.constructor.name === 'LinkedListNode';
        if (isNode) value = value.value;

        let currentNode = this.head;

        while (currentNode) {
            if (value !== undefined && value === currentNode.value) {
                return true;
            };
            currentNode = currentNode.next;
        };

        return false;
    }

    find(value) {
        if (!this.head) return undefined;
        if (this.lookup.has(value)) {
            return this.lookup.get(value);
        }
        let currentNode = this.head;

        while (currentNode) {
            if (currentNode.value === value) {
                return currentNode;
            };
            currentNode = currentNode.next;
            this.lookup.set(currentNode.value, currentNode);
        };

        return undefined;
    }

    popNext() {
        if (!this.head) return false;

        // If the head needs to be deleted 
        while (this.head) {
            this.size -= 1;
            const nextNode = this.head.next;
            this.head.next = nextNode.next;
            return nextNode;
        };
    }


    delete(value, deleteOne = false) {
        if (!this.head) return false;

        let deletedNode = null;

        // If the head needs to be deleted 
        while (this.head && this.head.value === value) {
            this.size -= 1;
            deletedNode = this.head;
            this.head = this.head.next;
            if (deleteOne) return true;
        };

        let currentNode = this.head;

        // If any node except the head or tail needs to be deleted
        if (currentNode !== null) {
            while (currentNode.next) {
                if (currentNode.next.value === value) {
                    this.size -= 1;
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                    if (deleteOne) return true;
                } else {
                    currentNode = currentNode.next;
                };
            };
        };

        // If the tail needs to be deleted
        if (this.tail.value === value) {
            this.tail = currentNode;
        };

        if (deletedNode === null) {
            return false;
        } else {
            return true;
        };
    }

    deleteHead() {
        if (!this.head) return null;

        this.size -= 1;

        const deletedHead = this.head;

        if (this.head.next) {
            this.head = this.head.next;
        } else {
            this.head = null;
            this.tail = null;
        }

        return deletedHead;
    }

    deleteTail() {
        if (this.size === 0) return false;

        if (this.size === 1) {
            if (this.head === null) {
                return false;
            } else {
                this.head = null;
                this.tail = null;
                this.size -= 1;
                return true;
            }
        }

        const deletedTail = this.tail;

        let currentNode = this.head;
        while (currentNode.next) {
            if (!currentNode.next.next) {
                this.size -= 1;
                currentNode.next = null;
            } else {
                currentNode = currentNode.next;
            }
        }

        this.tail = currentNode;

        return deletedTail;
    }
}

calcResult();