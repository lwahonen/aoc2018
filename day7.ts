import {Dictionary} from "lodash";
import {fetchInputData, levenshtein} from "./libraries";
import _ = require("lodash");
import __ = require("lodash/fp/__");

const year = 2018
const day = 7;

const file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").filter(value => value.length > 0);
let input = rows.map(f=> {
    return f.charAt("Step ".length)+f.charAt("Step A must be finished before step ".length);
});


let steps: Dictionary<string> = {};

input.forEach(f=>{
    let prereq = f[0];
    let item = f[1];
    if(steps[item] == undefined)
        steps[item]=""
    if(steps[prereq] == undefined)
        steps[prereq]=""
    steps[item] += prereq
})

function do_step(MAX_WORKERS :number) {
    let taken_steps = "";

    let pending: Dictionary<string> = {};

    let second = 0;
    do {
        let newpending: Dictionary<string> = {};
        _.forOwn(pending, function (value, key) {
            let target_time = parseInt(value);
            if (target_time <= second) {
                taken_steps += key;
                // console.log(`Task completed ${key}, steps taken ${taken_steps} at second ${second}`)
            } else
                newpending[key] = value;
        });
        pending = newpending;

        second++;
        if (_.size(pending) == MAX_WORKERS)
            continue;

        for (let i = 0; i < 26; i++) {
            let key = String.fromCharCode(i + 'A'.charCodeAt(0));
            if (taken_steps.indexOf(key) != -1)
                continue;
            if (!steps.hasOwnProperty(key))
                continue;
            // console.log("Considering " + steps[key]);
            let can_do = true;
            steps[key].split("").forEach(f => {
                if (taken_steps.indexOf(f) == -1) {
                    // console.log(`Missing ${f}, can't do ${key}`)
                    can_do = false;
                }
            });
            if (can_do) {
                if (_.size(pending) < MAX_WORKERS && !pending.hasOwnProperty(key)) {
                    // console.log(`Task scheduled ${key}, steps taken ${taken_steps} at second ${second}`)
                    pending[key] = String(second + 60 + i);
                }
            }
        }
    } while (_.size(pending) > 0);
    console.log(`Steps taken ${taken_steps} at second ${second-1}`)
}

// Part 1
console.log("Doing part 1");
do_step(1);

// Part 2
console.log("Doing part 2");
do_step(5);