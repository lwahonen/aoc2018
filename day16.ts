#!/usr/bin/env ts-node-script
import {fetchInputData, solveManyMapping} from "./libraries.js";
import _ from "lodash";

const year = 2018
const day = 16;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

function addr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] + old[B];
    return ret;
}

function addi(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] + B;
    return ret;
}

function mulr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] * old[B];
    return ret;
}

function muli(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] * B;
    return ret;
}

function banr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] & old[B];
    return ret;
}


function bani(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] & B;
    return ret;
}

function borr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] | old[B];
    return ret;
}


function bori(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    ret[C] = old[A] | B;
    return ret;
}

function setr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let C = input[3];
    ret[C] = old[A];
    return ret;
}

function seti(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let C = input[3];
    ret[C] = A;
    return ret;
}

function gtir(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( A > old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}


function gtri(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( old[A] > B  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}

function gtrr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( old[A] > old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}



function eqir(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( A == old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}


function eqri(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( old[A] == B  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}

function eqrr(old:number[], input:number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    if( old[A] == old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}

function fnCall(fn, old, current) {
    if (fn == "addr") return addr(old, current)
    if (fn == "addi") return addi(old, current)
    if (fn == "mulr") return mulr(old, current)
    if (fn == "muli") return muli(old, current)
    if (fn == "banr") return banr(old, current)
    if (fn == "bani") return bani(old, current)
    if (fn == "borr") return borr(old, current)
    if (fn == "bori") return bori(old, current)
    if (fn == "setr") return setr(old, current)
    if (fn == "seti") return seti(old, current)
    if (fn == "gtir") return gtir(old, current)
    if (fn == "gtri") return gtri(old, current)
    if (fn == "gtrr") return gtrr(old, current)
    if (fn == "eqir") return eqir(old, current)
    if (fn == "eqri") return eqri(old, current)
    if (fn == "eqrr") return eqrr(old, current)
}

let ops=["addr",
    "addi",
    "mulr",
    "muli",
    "banr",
    "bani",
    "borr",
    "bori",
    "setr",
    "seti",
    "gtir",
    "gtri",
    "gtrr",
    "eqir",
    "eqri",
    "eqrr" ]

let p1=file.split("\n\n\n")[0].split("\n\n").map(f=>
    {
        let lines=f.split("\n")
        let a=eval(lines[0].substring("Before: ".length))
        let b=lines[1].split(" ").map(a =>parseInt(a));
        let c=eval(lines[2].substring("After:  ".length))
        return {before:a, op:b, after:c, original:f}
    }
)

let part1=0;

let potentials=new Map<string,Set<string> >();
for (let op of ops) {
    potentials.set(op, new Set<string>());
}

for(let test of p1) {
    let count = 0;
    for (let op of ops) {
        let ans = fnCall(op, test.before, test.op);
        let pot = test.after;
        if (_.isEqual(ans, pot)) {
            let num = test.op[0];
            potentials.get(op).add(`${num}`);
            count++;
        }
    }
    if (count >= 3)
        part1++;
}
console.log("Part 1: "+part1);
let keys=solveManyMapping(potentials)
let resolved={}
keys.map(f=>{
    let split = f.split("=");
    resolved[parseInt(split[0])]=split[1]
})
console.log(JSON.stringify(resolved))

let p2=file.split("\n\n\n")[1].trim().split("\n").map(f=>f.split(" ").map(v=>parseInt(v)))
let regs=[0,0,0,0]
for(let op of p2)
{
    let resolvedElement = resolved[op[0]];
    regs= fnCall(resolvedElement, regs, op);
}
console.log("Part 2: "+regs[0])