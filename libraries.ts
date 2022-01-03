import * as fs from "fs";
import sync_fetch from "sync-fetch";
import Logic from "logic-solver";


export const levenshtein = (a: string, b: string): number => {
    const matrix = Array.from({length: a.length})
        .map(() => Array.from({length: b.length})
            .map(() => 0))

    for (let i = 0; i < a.length; i++) matrix[i][0] = i

    for (let i = 0; i < b.length; i++) matrix[0][i] = i

    for (let j = 0; j < b.length; j++)
        for (let i = 0; i < a.length; i++)
            matrix[i][j] = Math.min(
                (i == 0 ? 0 : matrix[i - 1][j]) + 1,
                (j == 0 ? 0 : matrix[i][j - 1]) + 1,
                (i == 0 || j == 0 ? 0 : matrix[i - 1][j - 1]) + (a[i] == b[j] ? 0 : 1)
            )

    return matrix[a.length - 1][b.length - 1]
}

export function fetchInputData(year: number, day: number):string {
    let path1 = `/Users/lwahonen/Dropbox/advent/2018/data/day_${year}_${day}.txt`;
    if (fs.existsSync(path1)) {
        const file = fs.readFileSync(path1, 'utf-8');
        return file;
    }
    const cookie = fs.readFileSync(`/Users/lwahonen/.aoc_cookie`, 'utf-8').trim();
    let cookie1 = `session=${cookie}`;
    let data = sync_fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            Cookie: cookie1
        }
    }).text();
    fs.writeFileSync(path1, data);
    return data

}

export function solveManyMapping(potentialValues: Map<string, Set<string>>) {
    let allvalues = new Set();
    for (let [key, value] of potentialValues) {
        for (let op of value) {
            allvalues.add(value);
        }
    }


    let terms = []
    for (let [key, value] of potentialValues) {
        let biglog = `Logic.or(`
        let bigstack = [];
        for (let op of value) {
            let bool = `${op}=${key}`
            let log = `Logic.and("${bool}", `
            let stack = [];
            for (let forbid of potentialValues.keys()) {
                if (forbid != key) {
                    stack.push(`Logic.not("${op}=${forbid}")`);
                }
            }
            log += stack.join(",") + ")"
            bigstack.push(log)
        }
        biglog += bigstack.join(",\n") + ")"
        terms.push(biglog)
    }

    var solver = new Logic.Solver();
    for (let term of terms) {
        let str = "solver.require(" + term + ")";
        eval(str)
    }
    var sol1 = solver.solve();
    return sol1.getTrueVars();
}