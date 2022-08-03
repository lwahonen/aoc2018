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
const day = 23;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file =
        `
pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1
`.trim()
}
if (testInput == 2) {
    file =
        `

pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5
`.trim()
}

let input = file.split("\n").map(f => {
        let pos = /<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/
        let a = f.match(pos);
        return {x: parseInt(a[1]), y: parseInt(a[2]), z: parseInt(a[3]), r: parseInt(a[4])}
    }
)

// Part 1
let x_lowest = 0;
let x_highest = 0;

let y_lowest = 0;
let y_highest = 0;

let z_lowest = 0;
let z_highest = 0;

let strongest = input[0];
for (let source of input) {
    if (source.r > strongest.r) {
        strongest = source;
    }
    x_lowest = Math.min(source.x, x_lowest);
    x_highest = Math.max(source.x, x_highest);

    y_lowest = Math.min(source.y, y_lowest);
    y_highest = Math.max(source.y, y_highest);

    z_lowest = Math.min(source.z, z_lowest);
    z_highest = Math.max(source.z, z_highest);
}

let part1_count = 0;
for (let target of input) {
    let fake = make_universe([target.x, target.x, target.y, target.y, target.z, target.z]);
    let manhattan = point_cube_distance(strongest, fake);
    if (manhattan < strongest.r)
        part1_count++
}

console.log(`Part 1 is ${part1_count}`)

// Used to check if bot signal can reach into a cube
function point_line_distance(line_start: number, line_end: number, target: number) {
    if (target < line_start)
        return line_start - target;
    if (target > line_end)
        return target - line_end;
    return 0;
}

// If total distance from inside the cube to the bot is under radius, then bot can be heard inside cube
function point_cube_distance(target: { x: number; y: number; z: number }, cube: IUniverse) {
    let total_distance = 0;
    total_distance = total_distance + point_line_distance(cube.x0, cube.x1, target.x);
    total_distance = total_distance + point_line_distance(cube.y0, cube.y1, target.y);
    total_distance = total_distance + point_line_distance(cube.z0, cube.z1, target.z);
    return total_distance;
}

function get_mid(start: number, end: number) {
    return Math.floor((start + end) / 2);
}

function make_universe(data: number[]): IUniverse {
    return {
        distance: 0,
        score: 0,
        size: (data[1] - data[0]) + (data[3] - data[2]) + (data[5] - data[4]),
        x0: data[0],
        x1: data[1],
        y0: data[2],
        y1: data[3],
        z0: data[4],
        z1: data[5]
    }
}

function split_cube_to_parts(universe: IUniverse) {
    let xm = get_mid(universe.x0, universe.x1);
    let ym = get_mid(universe.y0, universe.y1);
    let zm = get_mid(universe.z0, universe.z1);

    let eight = [];
    eight.push(make_universe([universe.x0, xm, universe.y0, ym, universe.z0, zm]));
    if (xm != universe.x1)
        eight.push(make_universe([xm + 1, universe.x1, universe.y0, ym, universe.z0, zm]));
    if (ym != universe.y1)
        eight.push(make_universe([universe.x0, xm, ym + 1, universe.y1, universe.z0, zm]));
    if (xm != universe.x1 && ym != universe.y1)
        eight.push(make_universe([xm + 1, universe.x1, ym + 1, universe.y1, universe.z0, zm]));


    if (zm != universe.z1) {
        eight.push(make_universe([universe.x0, xm, universe.y0, ym, zm + 1, universe.z1]));
        if (xm != universe.x1)
            eight.push(make_universe([xm + 1, universe.x1, universe.y0, ym, zm + 1, universe.z1]));
        if (ym != universe.y1)
            eight.push(make_universe([universe.x0, xm, ym + 1, universe.y1, zm + 1, universe.z1]));
        if (xm != universe.x1 && ym != universe.y1)
            eight.push(make_universe([xm + 1, universe.x1, ym + 1, universe.y1, zm + 1, universe.z1]));
    }

    return eight;
}


// The maximum universe has all the bots
let initial = {
    x0: x_lowest,
    x1: x_highest,
    y0: y_lowest,
    y1: y_highest,
    z0: z_lowest,
    z1: z_highest,
    size: Number.MAX_VALUE,
    score: input.length,
    distance: Number.MAX_VALUE
}
let round = 0;

interface IUniverse {
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    z0: number,
    z1: number,
    size: number;
    score: number;
    distance: number;
}


const compareUniverses: ICompare<IUniverse> = (a: any, b: any) => {
    // Pick smallest universes first
    if (a.size < b.size) {
        return -1;
    }
    if (a.size > b.size) {
        return 1;
    }
    // Pick largest score first
    if (a.score > b.score) {
        return -1;
    }
    if (a.score < b.score) {
        return 1;
    }
    // Pick smallest distance first
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
};

const unsolved = new PriorityQueue(compareUniverses);

unsolved.enqueue(initial);
// I bet the best location has at least 95% of the bots. Dropping this initial guess increases runtime exponentially.
let best_point = {score: input.length * 0.95, distance: Number.MAX_VALUE, size: 0};

while (!unsolved.isEmpty()) {
    round = round + 1;
    let here = unsolved.dequeue();
    // We have found a better candidate since this one was enqueued
    // Either one with bigger score, or one with same score & smaller distance to origin
    if ((here.score < best_point.score)
        ||
        (here.score == best_point.score && here.distance > best_point.distance)) {
        continue;
    }

    for (let universe of split_cube_to_parts(here)) {
        let count = 0;
        for (let target of input) {
            let manhattan = point_cube_distance(target, universe);
            if (manhattan <= target.r) {
                count++
            }
        }
        universe.score = count;
        // Don't drill down if we already have a better candidate
        if (universe.score < best_point.score)
            continue;
        universe.distance = point_cube_distance({x: 0, y: 0, z: 0}, universe);
        if (universe.size == 0) {
            if (universe.score > best_point.score
                || (universe.score == best_point.score && universe.distance < best_point.distance)
            ) {
                best_point = universe;
                // console.log(`Round ${round}: Better point found, it was ${JSON.stringify(best_point)}. Candidate queue size ${unsolved.size()}`)
            } else {
            }
        } else {
            unsolved.enqueue(universe);
        }
    }
}
console.log(`Part 2 solved after ${round} rounds, it was ${best_point.distance}`)
