import {fetchInputData} from "./libraries";
import {Dictionary} from "lodash";

var isNode = require('detect-node');

const year = 2018
const day = 10;

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

let rows = file.split("\n").map(f => f.match(/position=<\s*([-]?\d+),\s*([-]?\d+)> velocity=<\s*([-]?\d+),\s*([-]?\d+)/)).filter(f => f != null);

let nodes = rows.map(f => {
    let x = parseInt(f[1]);
    let y = parseInt(f[2]);
    let dx = parseInt(f[3]);
    let dy = parseInt(f[4]);
    return {x, y, dx, dy};
})

function get_new_positions() {
    let max_x = -Infinity;
    let max_y = -Infinity;
    let min_x = Infinity;
    let min_y = Infinity;

    nodes.forEach(value => {
            value.x = value.dx + value.x;
            value.y = value.dy + value.y;
            min_x = Math.min(min_x, value.x);
            min_y = Math.min(min_y, value.y);
            max_x = Math.max(max_x, value.x);
            max_y = Math.max(max_y, value.y);
        }
    );

    return {min_x, min_y, max_x, max_y};
}


let ctx = undefined;
let canvas = undefined;
if (!isNode) {
    canvas = document.getElementById('canvas');
    if (canvas instanceof HTMLCanvasElement) {
        ctx = canvas.getContext('2d');
    }
    console.log(canvas);
}
const tick = (t) => {
    let height = 0;
    let width = 0;

    if (canvas != undefined && ctx != undefined) {
        ctx.fillStyle = 'black';
        height = canvas.height;
        width = canvas.width;
        ctx.fillRect(0, 0, width, height)
    }
    let min_x = 9999999;
    let min_y = 9999999;
    let max_x = 0;
    let max_y = 0;
    while (Math.abs(max_x - min_x) > 500) {
        let a = get_new_positions();
        min_x = a['min_x'];
        min_y = a['min_y'];
        max_x = a['max_x'];
        max_y = a['max_y'];
        t++;
    }
    nodes.forEach(el => {
        const x = (el.x - min_x) / (max_x + 10);
        const y = (el.y - min_y) / (max_y + 10);
        const px = x * width;
        const py = y * height;
        if (ctx != undefined) {
            ctx.fillStyle = 'white'
            ctx.fillRect(px + 50, py + 50, 1, 1)
        }
    })
    return t;
}
var seconds_passed = 0;
var next_draw_cycle = () => {
    seconds_passed = tick(seconds_passed);
    console.log(seconds_passed);
    // Let's stop the animation once we see the message ;)
    if (seconds_passed != 10595)
        setTimeout(next_draw_cycle, 50);
};
next_draw_cycle();
