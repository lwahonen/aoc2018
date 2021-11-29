import {fetchInputData} from "./libraries";
import {Dictionary} from "lodash";

const year = 2018
const day = 12;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

function replaceAt(str: string, index: number, replacement: string) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

let input = file.split("\n")[0].split(":")[1].trim()
let rules = file.split("\n").splice(1).filter(f => f.length > 0).map(f => f.split(" => "))

// console.log("Input: " + input);
// console.log("Rules: ")
// for (let rule of rules) {
//     console.log(rule)
// }

function runPart1(rounds: number) {
    let thisgen = input
    let round_number = 0;
    let offset = 0;
    let answer = 0

    let prevAnswer = 0;
    let prevPrevAnswer = 0;

    for (; round_number < rounds; round_number++) {
        while (!thisgen.startsWith("....")) {
            thisgen = "." + thisgen;
            offset += 1;
        }
        while (!thisgen.endsWith("....")) {
            thisgen = thisgen + "."
        }

        let nextgen = ".".repeat(thisgen.length);
        // console.log(`${i} ${thisgen}`)

        rules.forEach(value => {
                for (let j = 0; j < thisgen.length; j++) {
                    let match = thisgen.substr(j, value[0].length);
                    if (match == value[0]) {
                        // console.log("Found rule "+value[0]+" => "+value[1]+" at "+j);
                        // console.log("Before rule "+nextgen)
                        nextgen = replaceAt(nextgen, j + 2, value[1]);
                        // console.log(" After rule "+nextgen)
                    }
                }
            }
        )
        thisgen = nextgen;
        answer = 0;

        for (let i = 0; i < thisgen.length; i++) {
            if (thisgen.charAt(i) == "#")
                answer += i - offset

        }
        // console.log("Plants in pots after " + (round_number + 1) + " rounds is " + answer + " difference from previous " + (answer - prevAnswer))
        if ((prevAnswer - answer) == (prevPrevAnswer - prevAnswer))
            return {round_number, prevAnswer, step: (answer - prevAnswer)};
        prevPrevAnswer = prevAnswer;
        prevAnswer = answer;
    }
    return {round_number, prevAnswer, step: (answer - prevAnswer)};
}

// Fixed number of rounds
let part1 = runPart1(20);
console.log("Part 1: " + part1["prevAnswer"]);

// Just run till we find the looping point
let start = runPart1(10000);

// Calculate part 2 answer from looping data
let steps = 50000000000 - start["round_number"];
let part2 = start["prevAnswer"] + (steps * start["step"]);
console.log("Part 2: " + part2)