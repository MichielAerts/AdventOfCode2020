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

    const rawInput = await getInput('inputDay20');
    const input = new Map(rawInput.map(line => new Tile(line)).map(t => [t.no, t]));
    // console.log(input);
    let result = new Map();

    // find corners
    for (let tile of input.entries()) {
        const nonMatchedSides = findNonMatchedSides(tile, input);
        const no_nonMatchedSides = nonMatchedSides.length;
        if (result.has(no_nonMatchedSides)) {
            result.set(no_nonMatchedSides, result.get(no_nonMatchedSides).concat(tile[0]));
        } else {
            result.set(no_nonMatchedSides, [tile[0]]);
        }
        tile[1].nonMatchedBorders = nonMatchedSides;
    }

    // console.log(result);
    const upperleft = result.get(2)[0];
    // console.log(upperleft);
    // console.log(input.get(upperleft));
    const tiles = [];
    const length = Math.sqrt(input.size);
    // console.log(length);
    // const row = [orientate(upperleft)];
    for (let i = 0; i < length; i++) {
        const row = [];
        tiles.push(row);
        for (let j = 0; j < length; j++) {
            // console.log('filling posiion: ' + [i, j]);

            if (j === 0) {
                if (i === 0) {
                    let topLeftTile = orientateTopLeft(input.get(upperleft));
                    if (!tryFindNextTile(input, 'left', topLeftTile.getBorder('right'))) {
                        topLeftTile.nonMatchedBorders = topLeftTile.nonMatchedBorders.map(s => s.reverse());
                    }
                    topLeftTile = orientateTopLeft(input.get(upperleft));
                    row.push(topLeftTile);
                } else {
                    const foundTile = findNextTile(input, 'top', tiles[i - 1][0].getBorder('bottom'));
                    // console.log(foundTile);
                    row.push(foundTile); // find row above
                }
            } else {
                // console.log(row[j - 1]);
                // console.log(row[j - 1].getBorder('right'));
                row.push(findNextTile(input, 'left', row[j - 1].getBorder('right')));
            }
            // console.log(format(tiles));
        }
    }
    // console.log(format(tiles));
    const picture = clean(tiles);
    console.log(picture);

    const monster = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   '
    ]
    const monster_size = [monster.length, monster[0].length];
    // console.log(monster);

    const monster_coor = getCoordinates(monster);
    // console.log(monster_coor);

    const pic = new Picture(picture);
    pic.tryAllOrientations(monster_coor, monster_size);

}

function getCoordinates(pic) {
    const coors = [];
    for (let j = 0; j < pic.length; j++) {
        for (let i = 0; i < pic[0].length; i++) {
            if (pic[j][i] === '#') {
                coors.push([j, i]);
            }
        }
    }
    return coors;
}

function clean(tiles) {
    // console.log(tiles);
    let result = '';
    const size = tiles.length;
    for (let row of tiles) {
        const length = row.length;
        if (length !== 0) {
            const str_length = row[0].tile.length - 1
            for (let i = 1; i < str_length; i++) {
                let line = '';
                for (let j = 0; j < length; j++) {
                    line += row[j].tile[i].join('').substring(1, str_length);
                }
                result += line + '\n';
            }
        }
    }
    return result;
}

class Picture {
    constructor(rawTile) {
        this.tile = rawTile.split('\n').filter(l => l.length > 0).map(l => l.split(''));
    }

    findAllMonsters(coors, [m_size_y, m_size_x]) {
        let foundMonsters = 0;
        let startingCoorsMonsters = [];
        const max_y = this.tile.length - m_size_y; 
        const max_x = this.tile[0].length - m_size_x; 
        console.log([max_y, max_x]);
        for (let y = 0; y < max_y; y++) {
            for (let x = 0; x < max_x; x++) {
                // console.log(coors);
                const no_of_non_hash = coors.map(([y_c, x_c]) => ([y_c + y, x_c + x]))
                    .filter(([y_c, x_c]) => this.tile[y_c][x_c] !== '#').length;
                if (no_of_non_hash === 0) {
                    foundMonsters++;
                    console.log('found monster @ ' + [y, x]);
                    startingCoorsMonsters.push([y, x]);
                }
            }
        }
        return { foundMonsters, startingCoorsMonsters };
    }

    changeMonsters(coors, { foundMonsters, startingCoorsMonsters }) {
        console.log(JSON.stringify(this.tile));
        // console.log('size x: ' + this.tile[0].length + ', size y: ' + this.tile.length);
        console.log(coors);
        console.log(startingCoorsMonsters);
        // console.log(startingCoorsMonsters.map(([y_s, x_s]) => coors.map(([y_c, x_c]) => [y_c + y_s, x_c + x_s])));
        startingCoorsMonsters.map(([y_s, x_s]) => coors.map(([y_c, x_c]) => [y_c + y_s, x_c + x_s]))
            .reduce((x1, x2) => x1.concat(x2))
            // .forEach(([y_c, x_c]) => console.log([y_c, x_c]));
            .forEach(([y_c, x_c]) => this.tile[y_c][x_c] = 'O');
        console.log(JSON.stringify(this.tile));
    }

    tryAllOrientations(coors, monster_size) {
        for (let i = 0; i < 15; i++) {
            console.log('try orientation no: ' + i);
            this.rotate();
            if (i === 5) {
                this.flipH();
            }
            if (i === 10) {
                this.flipV();
            }
            const foundMonsters = this.findAllMonsters(coors, monster_size);
            if (foundMonsters.foundMonsters > 0) {
                this.changeMonsters(coors, foundMonsters);
                const remaining = this.tile.reduce((x1, x2) => x1.concat(x2)).join('').match(/#/g);
                console.log(remaining.length);
                return remaining;
            }
        }
        return false;
    }


    rotate() {
        const rotatedTile = this.tile.map((val, index) => this.tile.map(row => row[index]).reverse());
        this.tile = rotatedTile;
    }

    flipH() {
        const flippedTile = this.tile.map(row => row.reverse());
        this.tile = flippedTile;
    }


    flipV() {
        const flippedTile = this.tile.reverse();
        this.tile = flippedTile;
    }
}
class Tile {
    constructor(rawTile) {
        const lines = rawTile.split("\n");
        this.no = lines[0].split(' ')[1].replace(':', '');
        const tile_b = lines.slice(1);
        this.tile = lines.slice(1).map(l => l.split(''));
        this.nonMatchedBorders = [];
        this.operations = 0;
        this.used = false;
        // for first part
        this.borders = [
            [
                tile_b[0], //top
                tile_b.map(s => s[s.length - 1]).join(''), //right
                tile_b[tile_b.length - 1].reverse(), // bottom
                tile_b.map(s => s[0]).join('').reverse(), // left
            ],
            [tile_b[0].reverse(),
                tile_b.map(s => s[s.length - 1]).join('').reverse(),
                tile_b[tile_b.length - 1],
                tile_b.map(s => s[0]).join(''),
            ]
        ];
    }

    tryOtherOrientation() {
        this.rotate();
        this.operations += 1;
        if (this.operations === 5) {
            this.flipH();
        }
        if (this.operations === 10) {
            this.flipV();
        }
        if (this.operations === 15) {
            throw 'couldn\'t find matching condition for ' + this.no;
        }
    }

    tryAllOrientations(border, borderToMatch) {
        for (let i = 0; i < 15; i++) {
            this.rotate();
            if (i === 5) {
                this.flipH();
            }
            if (i === 10) {
                this.flipV();
            }
            if (this.getBorder(border) === borderToMatch.reverse()) {
                // console.log('border: ' + border + ', border to match: ' + borderToMatch);
                return true;
            }
        }
        return false;
    }

    getBorder(border) {
        switch (border) {
            case 'top':
                return this.tile[0].join('');
            case 'bottom':
                return this.tile[this.tile.length - 1].join('').reverse();
            case 'left':
                return this.tile.map(s => s[0]).join('').reverse();
            case 'right':
                return this.tile.map(s => s[s.length - 1]).join('');
        }
    }

    rotate() {
        const rotatedTile = this.tile.map((val, index) => this.tile.map(row => row[index]).reverse());
        this.tile = rotatedTile;
    }

    flipH() {
        const flippedTile = this.tile.map(row => row.reverse());
        this.tile = flippedTile;
    }


    flipV() {
        const flippedTile = this.tile.reverse();
        this.tile = flippedTile;
    }
}

function format(tiles) {
    // console.log(tiles);
    const size = tiles.length;
    for (let row of tiles) {
        const length = row.length;
        if (length !== 0) {
            for (let i = 0; i < row[0].tile.length; i++) {
                let line = '';
                for (let j = 0; j < length; j++) {
                    line += row[j].tile[i].join('') + ' ';
                }
                console.log(line);
            }
        }
    }
}

function orientateTopLeft(tile) {
    while (!(
            tile.nonMatchedBorders.includes(tile.getBorder('top')) &&
            tile.nonMatchedBorders.includes(tile.getBorder('left')))) {
        tile.tryOtherOrientation();
    }
    tile.used = true;
    // console.log(tile);
    return tile;
}

function tryFindNextTile(tiles, side, border) {
    for (let tile of [...tiles.entries()].filter(([k, v]) => v.used = false)) {
        if (tile.tryAllOrientations(side, border)) {
            return true;
        }
    }
    return false;
}

function findNextTile(tiles, side, border) {
    for (let [no, tile] of [...tiles.entries()].filter(([k, v]) => v.used === false)) {
        // console.log(tile);
        if (tile.tryAllOrientations(side, border)) {
            tile.used = true
            return tile;
        }
    }
    throw 'couldn\'t find match for border: ' + border;
}

function findNonMatchedSides([tile_k, tile_v], map) {
    const allOtherBorders = [...map.entries()]
        .filter(([k, v]) => k !== tile_k)
        .map(([k, v]) => v.borders[0].concat(v.borders[1]))
        .reduce((x1, x2) => x1.concat(x2));
    const nonMatchedSidesBoth = tile_v.borders[0]
        .filter(b => !allOtherBorders.some(ob => ob === b));
    return nonMatchedSidesBoth;
}


String.prototype.reverse = function() {
    return this.split('').reverse().join('');
};
calcResult();