import {Dictionary} from "lodash";
import {fetchInputData, levenshtein} from "./libraries";
import _ = require("lodash");

const year = 2018
const day = 2;

const file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split("\n").filter(value => value.length > 0);

let doubles = 0;
let triples = 0;

rows.forEach(value => {

    let seens: Dictionary<string> = {};
    value.split("").map(value1 => {
        if (seens[value1] == undefined) {
            seens[value1] = String(1);
        } else {
            seens[value1] = String(parseInt(seens[value1]) + 1);
        }
    });
    let isDouble=false;
    let isTriple=false;
    _.mapValues(seens,function (p) { if(p == "2") isDouble=true;});
    _.mapValues(seens,function (p) { if(p == "3") isTriple=true;});
    if(isDouble)
        doubles++;
    if(isTriple)
        triples++;

    return "";
});
console.log("Found part A " + (doubles*triples));

rows.forEach(value => {
    rows.forEach(value1 => {
        if(levenshtein(value, value1) == 1)
        {
            console.log("Found part B \n" + value+"\n"+value1);
            process.exit(0)
        }
    })
})


