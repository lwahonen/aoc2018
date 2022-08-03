#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";
import {
    MinPriorityQueue, PriorityQueue,
} from '@datastructures-js/priority-queue';
import _ from "lodash";

const year = 2018
const day = 22;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////
let cache = {}
let bestForKey = {}

let depth = parseInt(file.split("\n")[0].substring("depth: ".length))
let coords = file.split("\n")[1].substring("target: ".length).split(",");
let target_x = parseInt(coords[0])
let target_y = parseInt(coords[1])

// depth=510
// target_x=10
// target_y=10

console.log(`Parsed parameters= depth: ${depth} target: ${target_x},${target_y}`)

let risk = 0;
for (let y = 0; y <= target_y; y++) {
    for (let x = 0; x <= target_x; x++) {
        let index = soil(x, y);
        risk += index;
    }
}
console.log(`Part 1: ${risk}`)

interface location {
    x: number;
    y: number;
    tool: number;
    travel_cost: number;
    tool_cost: number;
}

function check_direction(new_x: number, new_y, tool: number, needsUpdates, travel_cost: number, tool_cost: number) {
    if (new_x < 0)
        return;
    if (new_y < 0)
        return;
    let needed = tools_allowed(new_x, new_y);
    if (needed[0] == tool || needed[1] == tool) {
        let new_location: location = {
            x: new_x,
            y: new_y,
            tool: tool,
            travel_cost: travel_cost + 1,
            tool_cost: tool_cost
        };
        needsUpdates.enqueue(new_location);
    }
}

function travel() {
    const needsUpdates = new PriorityQueue((a: any, b: any) => {
        let a_cost = a["travel_cost"] + a["tool_cost"];
        let b_cost = b["travel_cost"] + b["tool_cost"];
        return a_cost - b_cost;
    });
    // Seed
    needsUpdates.enqueue({x: 0, y: 0, travel_cost: 0, tool_cost: 0, tool: 1})
    while (!needsUpdates.isEmpty()) {
        let here = needsUpdates.dequeue();
        let key = `${here.x},${here.y},${here.tool}`
        let journey_cost = here.tool_cost + here.travel_cost;
        if (bestForKey.hasOwnProperty(key) && bestForKey[key] <= (journey_cost))
            continue;
        bestForKey[key] = journey_cost;
        // console.log("\nNow I'm at "+JSON.stringify(here))
        if (here.x == target_x && here.y == target_y && here.tool == 1) {
            console.log(`Found target with total cost ${journey_cost} via ${JSON.stringify(here)}`)
            break;
        }
        get_moves(here, needsUpdates);
        // console.log("Possible moves from here are "+JSON.stringify(next))
    }
}

function get_moves(here: location, needsUpdates) {

    check_direction(here.x - 1, here.y, here.tool, needsUpdates, here.travel_cost, here.tool_cost);
    check_direction(here.x + 1, here.y, here.tool, needsUpdates, here.travel_cost, here.tool_cost);
    check_direction(here.x, here.y - 1, here.tool, needsUpdates, here.travel_cost, here.tool_cost);
    check_direction(here.x, here.y + 1, here.tool, needsUpdates, here.travel_cost, here.tool_cost);
    let optimalTools = tools_allowed(here.x, here.y);
    if (here.tool == optimalTools[0]) {
        let new_location: location = {
            x: here.x,
            y: here.y,
            tool: optimalTools[1],
            travel_cost: here.travel_cost,
            tool_cost: here.tool_cost + 7
        };
        needsUpdates.enqueue(new_location)
    }
    if (here.tool == optimalTools[1]) {
        let new_location: location = {
            x: here.x,
            y: here.y,
            tool: optimalTools[0],
            travel_cost: here.travel_cost,
            tool_cost: here.tool_cost + 7
        };
        needsUpdates.enqueue(new_location)
    }
}

function tools_allowed(x, y) {
    let soiltype = soil(x, y);
    return allowed_tools(soiltype)
}

function allowed_tools(region: number) {
    // Neither = 0
    // Torch 1
    // Climbing gear 2
    if (region == 0)
        return [1, 2];
    if (region == 1)
        return [0, 2];
    if (region == 2)
        return [0, 1];

}

function soil(x: number, y: number) {
    return ((depth + get_index(x, y)) % 20183) % 3;
}


function get_erosion(x: number, y: number) {
    return (depth + get_index(x, y)) % 20183;
}

function get_index(x: number, y: number) {
    let key = `${x},${y}`;
    if (cache.hasOwnProperty(key))
        return cache[key];
    if (x == 0 && y == 0)
        return 0;
    if (x == target_x && y == target_y)
        return 0;
    if (y == 0) {
        let number = x * 16807;
        cache[key] = number;
        return number;
    }
    if (x == 0) {
        let number = y * 48271;
        cache[key] = number;
        return number;
    }
    let left = get_erosion(x - 1, y)
    let up = get_erosion(x, y - 1)
    let number = left * up;
    cache[key] = number;
    return number;
}

travel()