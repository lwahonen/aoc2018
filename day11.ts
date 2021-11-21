import {fetchInputData} from "./libraries";
import {Dictionary} from "lodash";

const year = 2018
const day = 11;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split(" ").map(f => parseInt(f)).filter(f => !isNaN(f));

function get_serial(serial: number, x: number, y: number) {
    let rack_id = x + 10;
    let power = rack_id * y;
    power += serial;
    power *= rack_id;
    power %= 1000;
    power = (power - (power % 100)) / 100;
    return power - 5;
}

function get_integral_image(serial_number: number) {
    let preimage = {};
    for (let y = 0; y < 300; y++) {
        for (let x = 0; x < 300; x++) {
            let this_square = 0;
            if (x > 0)
                this_square += preimage[`${x - 1},${y}`];
            else
                preimage[`${x},${y}`] = 0;

            if (y > 0)
                this_square += preimage[`${x},${y - 1}`];
            else
                preimage[`${x},${y}`] = 0;

            if (x > 0 && y > 0) {
                this_square -= preimage[`${x - 1},${y - 1}`];
                this_square += get_serial(serial_number, x - 1, y - 1);
                preimage[`${x},${y}`] = this_square;
            }
        }
    }
    return preimage;
}

function get_square(serial: number, x: number, y: number, size: number, preimage: object) {
    let tot = preimage[`${x + size},${y + size}`];
    tot -= preimage[`${x},${y + size}`];
    tot -= preimage[`${x + size},${y}`];
    tot += preimage[`${x},${y}`];
    return tot;
}

let serial = 5468;
let max = "";
let max_val = 0;
let integralImage = get_integral_image(serial);

let size = 3;
for (let x = 0; x < 300 - size; x++) {
    for (let y = 0; y < 300 - size; y++) {
        let tot = get_square(serial, x, y, size, integralImage);
        if (tot > max_val) {
            max_val = tot;
            max = `${x},${y}`
        }
    }
}
console.log("Part 1: " + max);

max_val = 0;
for (size = 1; size < 298; size++) {
    for (let x = 0; x < 300 - size; x++) {
        for (let y = 0; y < 300 - size; y++) {
            let tot = get_square(serial, x, y, size, integralImage);
            if (tot > max_val) {
                max_val = tot;
                max = `${x},${y},${size}`
            }
        }
    }
}
console.log("Part 2: " + max);

