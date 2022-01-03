#!/usr/bin/env ts-node-script
import {fetchInputData, solveManyMapping} from "./libraries.js";

const year = 2018
const day = 19;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

function prepForOp(old: number[], input: number[]) {
    let ret = [...old]
    let A = input[1];
    let B = input[2];
    let C = input[3];
    return {ret, A, B, C};
}

function addr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] + old[B];
    return ret;
}

function addi(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] + B;
    return ret;
}

function mulr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] * old[B];
    return ret;
}

function muli(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] * B;
    return ret;
}

function banr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] & old[B];
    return ret;
}


function bani(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] & B;
    return ret;
}

function borr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] | old[B];
    return ret;
}


function bori(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A] | B;
    return ret;
}

function setr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = old[A];
    return ret;
}

function seti(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    ret[C] = A;
    return ret;
}

function gtir(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    if( A > old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}


function gtri(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    if( old[A] > B  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}

function gtrr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    if( old[A] > old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}



function eqir(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    if( A == old[B]  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}


function eqri(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
    if( old[A] == B  )
        ret[C] =1
    else
        ret[C]=0
    return ret;
}

function eqrr(old:number[], input:number[]) {
    let {ret, A, B, C} = prepForOp(old, input);
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

let ops=file.split("\n").slice(1).map(f=>{
    let s=f.split(" ");
    return {op:s[0], registers:s.map(v=>parseInt(v))}
})
let ipc_index=parseInt(file.split("\n")[0].split(" ")[1])

function runMachine(registers: number[]) {
    let ipc=0;
    while (ipc < ops.length) {
        // Decompiled inner loop:
        /*
seti 1 1 2          // 2: r2=1
seti 1 8 1          // r1=1
mulr 2 1 3          // r3 = r2 * r1
eqrr 3 4 3          // if r4=1 r3=1 else r3 = 0
addr 3 5 5          // if r3 == 1 goto 8
addi 5 1 5          // goto 9
addr 2 0 0          // 8: r0=r2 + r0
addi 1 1 1          // 9: r1 = r1 + 1
gtrr 1 4 3          // if r1 > r4 r3=1 else r3=0
addr 5 3 5          // if r3=1 goto 13
seti 2 6 5          // goto 2
         */
        if (ipc == 2 && registers[2] != 0) {
            if (registers[4] % registers[2] == 0) {
                registers[0] += registers[2];
            }
            registers[3] = 0;
            registers[1] = registers[4];
            ipc = 12;
            continue;
        }

        registers[ipc_index] = ipc;
        // console.log(`Registers are ${registers} and IPC is ${ipc}`)
        registers = fnCall(ops[ipc].op, registers, ops[ipc].registers);
        ipc = registers[ipc_index];
        ipc += 1;
    }
    return registers;
}

let registers_1=runMachine([0,0,0,0,0,0]);
console.log(`Part 1: ${registers_1[0]}`)

let registers_2=runMachine([1,0,0,0,0,0]);
console.log(`Part 1: ${registers_2[0]}`)
