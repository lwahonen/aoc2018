#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";

class DefaultMap extends Map {
    constructor(getDefaultValue, ...mapConstructorArgs) {
        // @ts-ignore
        super(mapConstructorArgs);

        if (typeof getDefaultValue !== 'function') {
            throw new Error('getDefaultValue must be a function');
        }

        // @ts-ignore
        this.getDefaultValue = getDefaultValue;
    }

    get = key => {
        if (!this.has(key)) {
            // @ts-ignore
            return this.getDefaultValue(key);
        }

        return super.get(key);
    };
}

const year = 2018
const day = 17;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file =
        `
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
`.trim()
}


const d = new DefaultMap(key => ({char: "."}));
d.set("500,0", {char: "|", x: 500, y: 0})

let min_x = Number.MAX_VALUE;
let max_x = 0;
let min_y = Number.MAX_VALUE;
let max_y = 0;

let input = file.split("\n").map(f => {
    let pos = /([xy])=(\d+), ([yx])=(\d+)\.\.(\d+)/
    let a = f.match(pos);
    let x0, x1, y0, y1;

    if (a[1] == "x") {
        x0 = Number(a[2]);
        x1 = Number(a[2]);
        y0 = Number(a[4]);
        y1 = Number(a[5]);
    }
    if (a[1] == "y") {
        y0 = Number(a[2]);
        y1 = Number(a[2]);
        x0 = Number(a[4]);
        x1 = Number(a[5]);
    }
    min_x = Math.min(min_x, x0, x1);
    min_y = Math.min(min_y, y0, y1);
    max_x = Math.max(max_x, x0, x1);
    max_y = Math.max(max_y, y0, y1);

    for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
            d.set(create_key(x, y), {char: "#", x: x, y: y})
        }
    }
});

function fill_out(x: number, y: number, steps: number, direction: number) {
    let side = d.get(`${x + direction},${y}`);
    if (side.char == "#") {
        return {fill: "~", steps: steps};
    }
    if (side.char == "." || side.char == "|") {
        let below = d.get(`${x + direction},${y + 1}`);
        if (below.char == "#" || below.char == "~")
            return fill_out(x + direction, y, steps + direction, direction);

        return {fill: "|", steps: steps + direction};
    }
}

let made_progress = true;

function create_key(x: number, y: number) {
    return `${x},${y}`;
}

while (made_progress) {
    made_progress = false;
    for (let location of d.keys()) {
        let point = d.get(location);
        // Only consider flowing water
        if (point.char != "|")
            continue;
        // Short circuit to ignore water that's brimming on top of an open container
        let ll = d.get(create_key(point.x - 1, point.y));
        let rr = d.get(create_key(point.x + 1, point.y));
        if (rr.char == "|" && ll.char == "|")
            continue;

        let below = d.get(create_key(point.x, point.y + 1)).char;

        if (below == "." && point.y < max_y) {
            d.set(create_key(point.x, point.y + 1), {char: "|", x: point.x, y: point.y + 1});
            made_progress = true;
        }
        if (below == "#" || below == "~") {
            let left = fill_out(point.x, point.y, 0, -1);
            let right = fill_out(point.x, point.y, 0, 1);
            if (left.fill == "~" && right.fill == "~") {
                for (let x = point.x + left.steps; x <= point.x + right.steps; x++) {
                    let spot = create_key(x, point.y);
                    if (d.get(spot).char != "~") {
                        d.set(spot, {char: "~", x: x, y: point.y});
                        made_progress = true;
                    }
                }
            }
            if (left.fill == "|" || right.fill == "|") {
                for (let x = point.x + left.steps; x <= point.x + right.steps; x++) {
                    let spot = create_key(x, point.y);
                    if (d.get(spot).char != "|") {
                        d.set(spot, {char: "|", x: x, y: point.y});
                        made_progress = true;
                    }
                }
            }
        }
    }
}

let flowing = 0;
let still = 0;
for (let location of d.keys()) {
    let p = d.get(location)
    if (p.y > max_y || p.y < min_y)
        continue;
    if (p.char == "~")
        still += 1;
    if (p.char == "|")
        flowing += 1;
}
console.log("Part 1 is " + (flowing + still) + " part 2 is " + still)