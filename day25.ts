#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";
import * as fs from "fs";

import {
    MinPriorityQueue,
    ICompare,
    IGetCompareValue, PriorityQueue,
} from '@datastructures-js/priority-queue';
import _, {initial, size} from "lodash";

const year = 2018
const day = 25;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file =
        `
1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2

`.trim()
}

function distanceBetween(s1, s2) {
    let total = 0;
    for (let i = 0; i < s1.length; i++) {
        total += Math.abs(s1[i] - s2[i])
    }
    return total;
}

let stars=file.trim().split("\n").map(f => {
        return f.trim().split(",").map(f => parseInt(f));
    }
)

function removeElementAtIndex<T>(input: T[], index: number) {
    return input.slice(0, index).concat(input.slice(index + 1));
}

function mergeMore(edges: number[][]) {
    let used = [];
    while (edges.length > 0) {
        let s1 = edges.shift();
        used.push(s1)
        for (let i = 0; i < unused.length; i++) {
            let s2 = unused[i];
            let distance = distanceBetween(s1, s2);
            if (distance <= 3) {
                // console.log("Joining " + JSON.stringify(s2) + " to the existing constellation via " + s1 + " with distance " + distance)
                edges.push(s2);
                unused = removeElementAtIndex(unused, i);
                // Move index back, because we just shifted things around
                i--;
            }
        }
    }
    return used;
}

let part1=0;
let unused=stars;
while(unused.length > 0) {
    let unused_before = unused.length;
    let initial = unused.shift();
    let members=mergeMore([initial])
    let unused_after = unused.length;
    let constellation_size = unused_before - unused_after;
    if (constellation_size > 1) {
        console.log("Found a constellation when starting from " + initial + " size " + constellation_size+" consisting of "+JSON.stringify(members))
        part1++;
    } else {
        console.log("Found a star with no neighbours " + initial)
        part1++
    }
}

console.log("Part 1 "+part1)