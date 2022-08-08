#!/usr/bin/env ts-node-script
import {fetchInputData, keyCount} from "./libraries.js";

const year = 2018
const day = 15;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file = `
#######   
#.G...#  
#...EG#  
#.#.#G#  
#..G#E#  
#.....#  
####### 
  `.trim()
}
if (testInput == 2) {
    file = `
####### 
#G..#E# 
#E#E.E# 
#G.##.# 
#...#E# 
#...E.# 
####### 
  `.trim()
}
if (testInput == 3) {
    file = `
####### 
#E..EG# 
#.#G.E# 
#E.##E# 
#G..#.# 
#..E#.# 
####### 
`.trim()
}

if (testInput == 4) {
    file = `
####### 
#E.G#.# 
#.#G..# 
#G.#.G# 
#G..#.# 
#...E.# 
####### 
`.trim()
}

if (testInput == 5) {
    file = `
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
`.trim()
}
if (testInput == 6) {
    file = `
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`.trim()
}

let input = file.split("\n").map(f => {
        return f.trim().split("");
    }
)

function get_enemy(c) {
    if (c == "G")
        return "E";
    if (c == "E")
        return "G";
}

function get_neighbors(x: number, y: number) {
    let coords = []
    if (y > 0) {
        // North
        coords.push({x: x, y: y - 1});
    }
    // West
    if (x > 0)
        coords.push({x: x - 1, y: y});

    // East
    if (x < input[0].length - 1)
        coords.push({x: x + 1, y: y});

    if (y < input.length - 1) {
        // South
        coords.push({x: x, y: y + 1});
    }
    return coords
}

function get_valid_neighbors(x, y, ignore_x, ignore_y) {
    let targets = []
    for (let n of get_neighbors(x, y)) {
        if (can_go(n.x, n.y))
            targets.push(n)
        if (ignore_x == n.x && ignore_y == n.y)
            targets.push(n)
    }
    return targets;
}

var units = [];

function initialize_units() {
    units = [];
    let s = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == "G" || input[y][x] == "E") {
                units.push({
                    x: x,
                    y: y,
                    hitpoints: 200,
                    moved: false,
                    race: input[y][x],
                    enemy: get_enemy(input[y][x]),
                    serial: s
                });
                s++;
                input[y][x] = ".";
            }
        }
    }
}


function can_go(x, y) {
    if (input[y][x] == "#")
        return false;
    for (let u of units) {
        if (u.x == x && u.y == y && u.hitpoints > 0)
            return false;
    }
    return true;
}

function get_path(source_x, source_y, target_x, target_y) {
    let next_queue = {};
    next_queue[`${source_y},${source_x}`] = {x: source_x, y: source_y, distance: 0, prev: null};
    let dist = [];
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            dist[`${y},${x}`] = Number.MAX_VALUE;
        }
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
        if (u.x == target_x && u.y == target_y)
            return {distances: dist, path: u};
        delete next_queue[best];

        // console.log("Dijkstra at " + JSON.stringify(u));

        for (let neighbor of get_valid_neighbors(u.x, u.y, target_x, target_y)) {
            // console.log("Checking distance to " + JSON.stringify(neighbor))
            let alt = u.distance + 1;
            let compare = dist[`${neighbor.y},${neighbor.x}`];
            if (alt < compare) {
                // console.log("Found better path to " + JSON.stringify(neighbor) + " via " + JSON.stringify(u));
                dist[`${neighbor.y},${neighbor.x}`] = alt;
                next_queue[`${neighbor.y},${neighbor.x}`] = {x: neighbor.x, y: neighbor.y, distance: alt, prev: u};
            }
        }
    }
    return {distances: dist, path: null};
}


function find_enemy(unit) {
    let candidate = null;
    for (let n of get_neighbors(unit.x, unit.y)) {
        for (let enemy of units) {
            if (enemy.race == unit.enemy && n.y == enemy.y && n.x == enemy.x && enemy.hitpoints > 0) {
                // console.log(`${unit.y},${unit.x} sees an enemy at ${n.y}, ${n.x}`)
                if (candidate == null || enemy.hitpoints < candidate.hitpoints) {
                    candidate = enemy;
                }
            }
        }
    }
    return candidate;
}


initialize_units();
find_score(0)
console.log("Part 1 completed, score ^")
let handicap = 10;
while (true) {
    input = file.split("\n").map(f => {
        return f.trim().split("");
    });
    initialize_units();
    console.log("Trying with handicap " + handicap)
    let still_failed = find_score(handicap);
    if (!still_failed) {
        handicap++
    } else {
        console.log("Part 2 completed, score ^")
        break;
    }
}

function find_score(handicap: number) {
    let round = 0;
    let stuff_happened = true;
    while (true) {
        // console.log("Round "+round)
        // if (stuff_happened)
        //     print_map();
        units = units.filter(obj => obj.hitpoints > 0);

        for (let unit of units) {
            unit.moved = false;
        }
        round += 1;
        for (let round_y = 0; round_y < input.length; round_y++) {
            for (let round_x = 0; round_x < input[round_y].length; round_x++) {
                for (let unit of units) {
                    if (unit.moved == false && round_y == unit.y && round_x == unit.x && unit.hitpoints > 0) {
                        // console.log("Found next unit to take turn, it's " + JSON.stringify(unit));
                        // Attack selection 1
                        let attack_target = find_enemy(unit);
                        // Nobody to attack?
                        if (attack_target == null) {
                            let move_candidate = null;
                            let best_distance = Number.MAX_VALUE / 2;
                            let solved = get_path(unit.x, unit.y, -1, 1);
                            let all_dists = solved.distances;
                            // Do stupid X/Y scan to get enemy units in clock order
                            for (let scan_y = 0; scan_y < input.length; scan_y++) {
                                for (let scan_x = 0; scan_x < input[scan_y].length; scan_x++) {
                                    for (let enemy of units) {
                                        if (scan_y == enemy.y && scan_x == enemy.x && enemy.race == unit.enemy && enemy.hitpoints > 0) {
                                            for (let enemy_range of get_valid_neighbors(enemy.x, enemy.y, -1, -1)) {
                                                let distance_here = all_dists[`${enemy_range.y},${enemy_range.x}`];
                                                if (distance_here < best_distance) {
                                                    best_distance = distance_here;
                                                    move_candidate = enemy_range;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (move_candidate != null) {
                                stuff_happened = true;
                                let best_distance = Number.MAX_VALUE / 2;
                                let go = null;
                                // Run in reverse to see which step to take first
                                let solved = get_path(move_candidate.x, move_candidate.y, unit.x, unit.y);

                                for (let choose_first of get_valid_neighbors(unit.x, unit.y, -1, -1)) {
                                    let distance_from_neighbor = solved.distances[`${choose_first.y},${choose_first.x}`];
                                    if (distance_from_neighbor < best_distance) {
                                        best_distance = distance_from_neighbor;
                                        go = choose_first;
                                    }
                                }
                                // console.log(`Going for the jugular of (${best.target.y}, ${best.target.x})`)
                                unit.x = go.x
                                unit.y = go.y
                                // console.log("Went to " + unit.y + ", " + unit.x)
                            }
                        }
                        attack_target = find_enemy(unit);

                        if (attack_target != null) {
                            // console.log(`I will attack an enemy at ${attack_target.y}, ${attack_target.x}`)
                            if (attack_target.race == "G")
                                attack_target.hitpoints -= handicap;
                            attack_target.hitpoints -= 3;
                            if (attack_target.hitpoints <= 0) {
                                // console.log("I have slain my enemy " + attack_target.serial + " at " + attack_target.y + ", " + attack_target.x)
                                if (attack_target.race == "E" && handicap > 0) {
                                    console.log("Horrible tragedy: An elf died")
                                    return false;
                                }
                                stuff_happened = true;
                            }
                        }
                        unit.moved = true;

                        let elves = 0;
                        let gnomes = 0;
                        let finished_turn = true;

                        for (let unit of units) {
                            if (unit.race == "E" && unit.hitpoints > 0) {
                                if (!unit.moved)
                                    finished_turn = false;
                                elves += unit.hitpoints;
                            }
                            if (unit.race == "G" && unit.hitpoints > 0) {
                                if (!unit.moved)
                                    finished_turn = false;
                                gnomes += unit.hitpoints;
                            }
                        }
                        // console.log("Still standing "+JSON.stringify(units))
                        if (elves == 0 || gnomes == 0) {
                            if (!finished_turn)
                                round--;
                            console.log("Battle over after " + round + ", result " + (elves) + " / " + (gnomes) + " score " + ((elves + gnomes) * (round)))
                            return true;
                        }
                    }
                }
            }
        }
    }
}