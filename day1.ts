import {fetchInputData, levenshtein} from "./libraries";
import {execSync} from "child_process";
import { Dictionary } from "lodash";

const year=2018
const day=1;

const file = fetchInputData(year, day);

let rows = file.split("\n").filter(value => value.length > 0);
var numbers = rows.map(value => parseInt(value));
var part_A=0;
var part_B=0;

part_A=numbers.reduce((previousNum, currentNum) => {
    let summa = previousNum + currentNum;
    return summa;
});

console.log("Found part A " + part_A);

let seens : Dictionary<number> = {
}


let roll=0;
while (true)
{
    roll=numbers.reduce((previousNum, currentNum) => {
        let summa = previousNum + currentNum;
        if(seens[summa] ==summa)
        {
            console.log("Found part B " + summa);
            process.exit(0);
        }
        seens[summa] = summa;
        return summa;
    }, roll);

}

