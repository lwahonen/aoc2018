#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";
import * as fs from "fs";

import {
    MinPriorityQueue,
    ICompare,
    IGetCompareValue, PriorityQueue,
} from '@datastructures-js/priority-queue';
import {size} from "lodash";

const year = 2018
const day = 18;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file = `
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`.trim()
}

let input = file.split("\n").map(f => {
        return f.trim().split("");
    }
)

function get_neighbors(x: number, y: number) {
    let coords = []
    if (y > 0) {
        // North
        coords.push({x: x, y: y - 1});
        // Northwest
        if (x > 0)
            coords.push({x: x - 1, y: y - 1});
        // Northeast
        if (x < input[0].length - 1)
            coords.push({x: x + 1, y: y - 1});
    }
    // East
    if (x < input[0].length - 1)
        coords.push({x: x + 1, y: y});
    // West
    if (x > 0)
        coords.push({x: x - 1, y: y});

    if (y < input.length - 1) {
        // South
        coords.push({x: x, y: y + 1});
        // Southwest
        if (x > 0)
            coords.push({x: x - 1, y: y + 1});
        // Southeast
        if (x < input[0].length - 1)
            coords.push({x: x + 1, y: y + 1});
    }
    return coords
}


let loops = [];
let found = false;

function count_score() {
    let yards = 0;
    let trees = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == "#")
                yards++;
            if (input[y][x] == "|")
                trees++;
        }
    }
    return yards * trees;
}

for (let round = 0; round < 1000000000; round++) {
    if (round == 10) {
        let score = count_score();
        console.log(`Part 1 ${score}`)
    }

    let map_string = input.map(f => f.join("")).join("\n");
    // console.log(`Round ${round}:\n${map_string}`)
    if (!found) {
        for (let i = 0; i < loops.length; i++) {
            if (loops[i] == map_string) {
                console.log(`Found the loop, round ${round} is equal to round ${i}`)
                let loop_size = round - i;
                let loops_available = Math.floor((1000000000 - i) / loop_size);
                round = i + loops_available * loop_size;
                found = true;
                break;
            }
        }
    }

    loops[round] = map_string;
    let nextround: string[][] = [];
    for (let y = 0; y < input.length; y++) {
        nextround[y] = []
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == ".") {
                let trees = 0;
                for (let n of get_neighbors(x, y)) {
                    if (input[n.y][n.x] == "|")
                        trees++;
                }
                if (trees >= 3)
                    nextround[y][x] = "|"
                else
                    nextround[y][x] = "."
            }
            if (input[y][x] == "|") {
                let yards = 0;
                for (let n of get_neighbors(x, y)) {
                    if (input[n.y][n.x] == "#")
                        yards++;
                }
                if (yards >= 3)
                    nextround[y][x] = "#"
                else
                    nextround[y][x] = "|"
            }
            if (input[y][x] == "#") {
                let yards = 0;
                let trees = 0;
                for (let n of get_neighbors(x, y)) {
                    if (input[n.y][n.x] == "#")
                        yards++;
                    if (input[n.y][n.x] == "|")
                        trees++;
                }
                if (yards >= 1 && trees >= 1)
                    nextround[y][x] = "#"
                else
                    nextround[y][x] = "."
            }
        }
    }
    input = nextround;
}

let score = count_score();
console.log(`Part 2 ${score}`)
