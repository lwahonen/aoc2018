import {fetchInputData} from "./libraries";
import _ = require("lodash");

var isNode = require('detect-node');

const year = 2018
const day = 6;

let file = "";


if (isNode) {
    file = fetchInputData(year, day);
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").map(f => f.match(/([-]?\d+),\s*([-]?\d+)/)).filter(f => f != null);

// Crush into node list, pull coord mins and maxes
let id = 0
let max_x = 0
let max_y = 0
let min_x = 999999
let min_y = 999999
let nodes = rows.map(f => {
    let x = parseInt(f[1]);
    let y = parseInt(f[2]);
    id += 1;
    let node_id = id;
    max_x = Math.max(x, max_x)
    max_y = Math.max(y, max_y)
    min_x = Math.min(x, min_x)
    min_y = Math.min(y, min_y)

    return {x, y, node_id};
})

// Construct field with a node reference for every point that's closest to only one point
let values = {}
for (let x = min_x - 10; x < max_x + 10; x++) {
    for (let y = min_y - 10; y < max_y + 10; y++) {
        let key = `${x},${y}`
        let point_id = {};
        let closest = 999999999;
        let closest_count = 0;
        nodes.forEach(value => {
            let dx = Math.abs(x - value['x']);
            let dy = Math.abs(y - value['y']);
            if (dx + dy == closest) {
                closest_count += 1;
            }
            if (dx + dy < closest) {
                closest = dy + dx;
                point_id = value
                closest_count = 1;
            }
        })
        if (closest_count == 1)
            values[key] = point_id;
    }
}

// Calculate patch sizes when looping from min x to max x
let scores = {}
for (let x = min_x - 1; x < max_x + 1; x++) {
    for (let y = min_y - 1; y < max_y + 1; y++) {
        let key = `${x},${y}`
        if (values[key] == undefined)
            continue
        let node_identifier = values[key]["node_id"];
        if (scores[node_identifier] == undefined)
            scores[node_identifier] = 0;
        scores[node_identifier] += 1
    }
}

// Calculate patch sizes when looping a larger universe. If these differ from the
// previous ones, it means the patch is expanding with the universe - and needs to be eliminated
// from the score set
let scores_2 = {}
for (let x = min_x - 10; x < max_x + 10; x++) {
    for (let y = min_y - 10; y < max_y + 10; y++) {
        let key = `${x},${y}`
        if (values[key] == undefined)
            continue
        let node_identifier = values[key]["node_id"];
        if (scores_2[node_identifier] == undefined)
            scores_2[node_identifier] = 0;
        scores_2[node_identifier] += 1
    }
}

// Drop scores that increased with universe
scores = _.filter(scores, function (key, value) {
        return scores[value] == scores_2[value]
    }
)

// Find max from the ones left
let max_area = 0
_.mapKeys(scores, function (key, value) {
    max_area = Math.max(max_area, key)
})

console.log("Part 1:" + max_area)

let part_2 = 0
for (let x = -5000; x < 5000; x++) {
    for (let y = -5000; y < 5000; y++) {
        let total_distance = 0;
        for (let node of nodes) {
            let dx = Math.abs(x - node['x']);
            let dy = Math.abs(y - node['y']);
            total_distance += dx;
            total_distance += dy;
            if (total_distance >= 10000)
                break;
        }
        if (total_distance < 10000)
            part_2++;
    }
}

console.log("Part 1:" + part_2)
