#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";

const year = 2018
const day = 14;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let elf_1 = 0
let elf_2 = 1
let scoreboard = [3, 7]

function printScore() {
    let output = ""
    for (let digit = 0; digit < scoreboard.length; digit++) {
        if (digit == elf_1)
            output += `(${scoreboard[digit]})`
        if (digit == elf_2)
            output += `[${scoreboard[digit]}]`
        if (digit != elf_1 && digit != elf_2)
            output += ` ${scoreboard[digit]} `
    }
    console.log(output)
}

let target = parseInt(file.trim())
while (scoreboard.length < target + 10) {
    // printScore();
    let pair = scoreboard[elf_1] + scoreboard[elf_2];
    if (pair >= 10) {
        scoreboard.push(1);
        scoreboard.push(pair - 10);
    } else {
        scoreboard.push(pair);
    }
    elf_1 += scoreboard[elf_1] + 1
    elf_2 += scoreboard[elf_2] + 1

    elf_1 %= scoreboard.length;
    elf_2 %= scoreboard.length;
}
let s = scoreboard.slice(target, target + 10).join("")
console.log("Part 1: " + s)

elf_1 = 0
elf_2 = 1
scoreboard = [3, 7]

let numtarget = file.trim()
while (true) {
    // printScore();
    let pair = scoreboard[elf_1] + scoreboard[elf_2];
    if (pair >= 10) {
        scoreboard.push(1);
        scoreboard.push(pair - 10);
    } else {
        scoreboard.push(pair);
    }
    elf_1 += scoreboard[elf_1] + 1
    elf_2 += scoreboard[elf_2] + 1

    elf_1 %= scoreboard.length;
    elf_2 %= scoreboard.length;
    if (scoreboard.length > numtarget.length + 1) {
        let numbers = scoreboard.slice(scoreboard.length - (numtarget.length + 1));
        if (numbers.join("").search(numtarget) != -1) {
            let index = scoreboard.join("").search(numtarget);
            console.log("Part 2: " + index)
            break;

        }
    }
}
