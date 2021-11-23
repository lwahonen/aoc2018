import {Dictionary, values} from "lodash";
import {fetchInputData, levenshtein} from "./libraries";
import _ = require("lodash");

const year = 2018
const day = 4;

const file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").filter(value => value.length > 0).map(value => value.match(/\[([^\]]*)\] (.*)/));

let input = rows.map(value => {
    let timestamp = new Date(value[1])
    let action = value[2]
    return {timestamp, action}
})

input.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

let guard = 0
let sleep = undefined
let sleep_minutes = {}
let guard_minutes = {}

// Munge input data to a nice data structure
input.forEach(f => {
    if (f['action'] == "falls asleep") {
        sleep = f['timestamp'];
    }
    if (f['action'] == "wakes up") {
        let sleep_min = sleep.getMinutes();
        let wake_min = f['timestamp'].getMinutes();
        for (let i = sleep_min; i < wake_min; i++) {
            sleep_minutes[guard][i] += 1
            if (guard_minutes[`${i}`] == undefined) {
                guard_minutes[`${i}`] = {};
            }
            if (guard_minutes[`${i}`][`${guard}`] == undefined) {
                guard_minutes[`${i}`][`${guard}`] = 0;
            }
            guard_minutes[`${i}`][`${guard}`] += 1;
        }
    }
    let match = f['action'].match(/Guard #(\d+) begins shift/);
    if (match != null) {
        guard = match[1];
        if (sleep_minutes[guard] == undefined) {
            sleep_minutes[guard] = new Array(60).fill(0)
        }
    }
})

// Loop the data structure one way for part 1
let max_guard = ""
let max_sleep = 0
let max_total_index = 0;
_.mapValues(sleep_minutes, function (value, key) {
    let sleep_count = 0
    let maxindex = 0;
    let maxvalue = 0;
    for (let i = 0; i < 60; i++) {
        let asleep_at_minute = value[i];
        sleep_count += asleep_at_minute
        if (asleep_at_minute > maxvalue) {
            maxvalue = asleep_at_minute
            maxindex = i
        }
    }
    if (sleep_count > max_sleep) {
        max_sleep = sleep_count;
        max_guard = key;
        max_total_index = maxindex
    }
})

console.log(`Guard ${max_guard} most commonly asleep at minute ${max_total_index}, answer to part 1 is ${parseInt(max_guard) * max_total_index}`);

// Loop the same data structure a different way, for part 2
let minute_max = 0
let guard_id = ""
let minute_index = 0
_.mapValues(guard_minutes, function (value, key) {
    _.mapValues(value, function (minute_value, minute_key) {
        let number = parseInt(minute_value);
        if(number > minute_max)
        {
            minute_max=number
            minute_index=minute_key
            guard_id=key
        }
    })
})
console.log(`Guard ${guard_id} most commonly asleep at minute ${minute_index}, answer to part 2 is ${parseInt(guard_id) * minute_index}`);
