import {Dictionary} from "lodash";
import {fetchInputData, levenshtein} from "./libraries";
import _ = require("lodash");

const year = 2018
const day = 5;

const file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").filter(value => value.length > 0);
let input = rows[0].split("").map(f => new TextEncoder().encode(f)[0]);

let changed = true;
while (changed) {
    changed = false;
    for (let i = 0; i < input.length - 1; i++) {
        let number = input[i] - input[i + 1];
        if (number == 32 || number == -32) {
            changed = true;
            input[i] = 0;
            input[i + 1] = 0;
            i++;
        }
    }
    input = input.filter(f => f != 0);
}
console.log(`Part 1: ${input.length}`);

let smallest = input.length;
for (let i = 0; i < 26; i++) {

    let input = rows[0].split("").map(f => new TextEncoder().encode(f)[0]).filter(f => f != i + 65 && f != i + 97);

    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < input.length - 1; i++) {
            let number = input[i] - input[i + 1];
            if (number == 32 || number == -32) {
                changed = true;
                input[i] = 0;
                input[i + 1] = 0;
                i++;
            }
        }
        input = input.filter(f => f != 0);
    }
    if (input.length < smallest)
        smallest = input.length;
}
console.log(`Part 2: ${smallest}`);
