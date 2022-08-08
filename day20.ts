#!/usr/bin/env ts-node-script
import {fetchInputData, keyCount} from "./libraries.js";

const year = 2018
const day = 20;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file = `
^ENWWW(NEEE|SSE(EE|N))$
       `.trim()
}
if (testInput == 2) {
    file = `
^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$
       `.trim()
}

class maze_room {
    x: number;
    y: number;
    south: maze_room;
    north: maze_room;
    west: maze_room;
    east: maze_room;
}

let rooms = []
let first_room = new maze_room();
first_room.x = 0;
first_room.y = 0;
rooms["0,0"] = first_room;
let initial_stack = [];
initial_stack.push(first_room)
solve(first_room, file, initial_stack);
let dists = get_path(0, 0)
let max = 0;
let part2 = 0;
for (const location in dists.distances) {
    let value = dists.distances[location];
    if (value != Number.MAX_VALUE) {
        // console.log("Even bigger value at " + location+", it's "+value)
        max = Math.max(value, max);
        if (value >= 1000)
            part2++
    }
}

console.log("Part 1 " + max + " part 2 " + part2)

function get_valid_neighbors(u: maze_room) {
    let valid = []
    if (u.south != null)
        valid.push(u.south)
    if (u.north != null)
        valid.push(u.north)
    if (u.west != null)
        valid.push(u.west)
    if (u.east != null)
        valid.push(u.east)
    return valid
}

function get_path(source_x, source_y) {
    let next_queue = {};
    next_queue[`${source_y},${source_x}`] = {x: source_x, y: source_y, distance: 0, prev: null, room: rooms["0,0"]};
    let dist = [];
    for (let r in rooms) {
        let room = rooms[r];
        dist[`${room.y},${room.x}`] = Number.MAX_VALUE;
    }
    dist[`${source_y},${source_x}`] = 0;


    while (keyCount(next_queue) > 0) {
        let best = Object.keys(next_queue)[0];
        let u = next_queue[best];
        for (let key in next_queue) {
            let value = next_queue[key];
            if (value.distance < u.distance) {
                u = value;
                best = key;
            }
        }
        delete next_queue[best];

        // console.log("Dijkstra at " + JSON.stringify(best));

        for (let neighbor of get_valid_neighbors(u.room)) {
            // console.log("Checking distance to (" + neighbor.y+", "+neighbor.x+")")
            let alt = u.distance + 1;
            let compare = dist[`${neighbor.y},${neighbor.x}`];
            if (alt < compare) {
                // console.log("Found better path to (" + neighbor.y+", "+neighbor.x+") via " + JSON.stringify(best));
                dist[`${neighbor.y},${neighbor.x}`] = alt;
                next_queue[`${neighbor.y},${neighbor.x}`] = {
                    x: neighbor.x,
                    y: neighbor.y,
                    distance: alt,
                    prev: u,
                    room: neighbor
                };
            }
        }
    }
    return {distances: dist, path: null};
}


function solve(room, path, stack) {
    while (room != null) {
        let reg = path[0];
        let next_room;

        if (reg == "^") {
            next_room = first_room;
        }
        if (reg == "$") {
            next_room = null;
        }
        if (reg == ")") {
            // console.log("Parenthesis ended, resuming from where the stack was previously")
            next_room = stack.pop();
        }
        if (reg == "|") {
            // console.log("Or found, starting solve from " + stack.at(-1) + " for path " + path.substring(1))
            next_room = stack.at(-1);
        }
        if (reg == "(") {
            stack.push(room);
            // console.log("Starting parenthesis found, starting solve from " + room + " for path " + path.substring(1))
            next_room = room;
        }

        if (reg == "S") {
            let find_x = room.x;
            let find_y = room.y + 1;
            if (room.south == null) {
                if (`${find_x},${find_y}` in rooms)
                    room.south = rooms[`${find_x},${find_y}`];
                else {
                    room.south = new maze_room();
                    room.south.y = find_y;
                    room.south.x = find_x;
                    rooms[`${find_x},${find_y}`] = room.south;
                }
                room.south.north = room;
            }
            next_room = room.south;
        }
        if (reg == "N") {
            let find_x = room.x;
            let find_y = room.y - 1;
            if (room.north == null) {
                if (`${find_x},${find_y}` in rooms)
                    room.north = rooms[`${find_x},${find_y}`];
                else {
                    room.north = new maze_room();
                    room.north.y = find_y;
                    room.north.x = find_x;
                    rooms[`${find_x},${find_y}`] = room.north;
                }
                room.north.south = room;
            }
            next_room = room.north;
        }
        if (reg == "W") {
            let find_x = room.x - 1;
            let find_y = room.y;
            if (room.west == null) {
                if (`${find_x},${find_y}` in rooms)
                    room.west = rooms[`${find_x},${find_y}`];
                else {
                    room.west = new maze_room();
                    room.west.y = find_y;
                    room.west.x = find_x;
                    rooms[`${find_x},${find_y}`] = room.west;
                }
                room.west.east = room;
            }
            next_room = room.west;
        }
        if (reg == "E") {
            let find_x = room.x + 1;
            let find_y = room.y;
            if (room.east == null) {
                if (`${find_x},${find_y}` in rooms)
                    room.east = rooms[`${find_x},${find_y}`];
                else {
                    room.east = new maze_room();
                    room.east.y = find_y;
                    room.east.x = find_x;
                    rooms[`${find_x},${find_y}`] = room.east;
                }
                room.east.west = room;
            }
            next_room = room.east;
        }
        room = next_room;
        path = path.substring(1);
    }
}
