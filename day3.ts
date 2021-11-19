import {Dictionary} from "lodash";
import {fetchInputData, levenshtein} from "./libraries";
import _ = require("lodash");

const year = 2018
const day = 3;

const file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").filter(value => value.length > 0);

function parseRow(value: string) {
    let tags = value.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    let id = tags[1];
    let start_x = parseInt(tags[2]);
    let start_y = parseInt(tags[3]);

    let width = parseInt(tags[4]);
    let height = parseInt(tags[5]);
    return {id, start_x, start_y, width, height};
}

let seens: Dictionary<string> = {};
let parsedRows = rows.map(parseRow);

for (let i = 0; i < 2; i++) {
    parsedRows.forEach(value => {

            for (let x = value.start_x; x < value.start_x + value.width; x++) {
                for (let y = value.start_y; y < value.start_y + value.height; y++) {
                    let key = `${x},${y}`;
                    if (seens[key] == undefined || seens[key] == `${value.id}`)
                        seens[key] = `${value.id}`
                    else
                        seens[key] = 'X'
                }
            }
        }
    )
}

// Count X on the map
let part1 = 0;
_.mapValues(seens, function (p) {
    if (p == 'X') part1++
})
console.log("Part 1 answer " + part1);

// Find a patch that doesn't overlap a single X
parsedRows.forEach(value => {

    for (let x = value.start_x; x < value.start_x + value.width; x++) {
        for (let y = value.start_y; y < value.start_y + value.height; y++) {
            if (seens[`${x},${y}`] == `X`) {
                return;
            }
        }
    }
    console.log("Part 2 answer " + value.id);
    process.exit(0)
})
