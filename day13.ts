#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";

const year = 2018
const day = 13;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let split = file.split("\n").filter(f => f.length > 10).map(f => f.padEnd(200, " "));
let original_map = split.map(f => f.split(''))
let input = split.map(f => f.split(''))

let max_row = input.length;
let max_col = input[0].length;

function get_old_char(row: number, col: number) {
    let char = original_map[row][col];
    if (char == "v" || char == "^")
        return "|"
    if (char == ">" || char == "<")
        return "-"

    return char;
}

let loops = 0;

function CRASH(row: number, col: number) {
    input[row][col] = "X";
    // console.log(input.map(f => f.join("")).join("\n"))
    console.log("CRASH AT " + col + "," + row + " after " + loops);
    let count = cart_count();
    console.log("Still have " + count)
    input[row][col] = get_old_char(row, col);
    let new_key = `${row},${col}`;
    turns.delete(new_key)

}


let turns = new Map<string, number>();

function update_left(row: number, col: number) {
    input[row][col] = get_old_char(row, col);
    let key = `${row},${col}`;
    let new_key = `${row},${col - 1}`;
    turns.set(new_key, Number(turns.get(key)))
    turns.delete(key)
    return new_key;
}

function update_right(row: number, col: number) {
    input[row][col] = get_old_char(row, col);
    let key = `${row},${col}`;
    let new_key = `${row},${col + 1}`;
    turns.set(new_key, Number(turns.get(key)))
    turns.delete(key)
    return new_key;
}

function update_up(row: number, col: number) {
    input[row][col] = get_old_char(row, col);
    let key = `${row},${col}`;
    let new_key = `${row - 1},${col}`;
    turns.set(new_key, Number(turns.get(key)))
    turns.delete(key)
    return new_key;
}

function update_down(row: number, col: number) {
    input[row][col] = get_old_char(row, col);
    let key = `${row},${col}`;
    let new_key = `${row + 1},${col}`;
    turns.set(new_key, Number(turns.get(key)))
    turns.delete(key)
    return new_key;
}

function cart_count() {
    let carts = new Map<string, string>();
    for (let row = 0; row < max_row; row++) {
        for (let col = 0; col < max_col; col++) {
            let tile = input[row][col];
            let key = `${col},${row}`;
            if (tile == ">" || tile == "<" || tile == "^" || tile == "v") {
                carts.set(key, tile);
            }
        }
    }
    if (carts.size < 2) {
        console.log("PART 2 DONE " + JSON.stringify(Object.fromEntries(carts)));
        process.exit(0)
    }
    return carts.size;
}

function move_cart(char: string, row: number, col: number) {
    if (char == "<") {
        let next = input[row][col - 1];
        if (next == "\\") {
            input[row][col - 1] = "^"
            return update_left(row, col);
        }
        if (next == "/") {
            input[row][col - 1] = "v"
            return update_left(row, col);
        }
        if (next == ">" || next == "^" || next == "v") {
            update_left(row, col);
            CRASH(row, col - 1);
        }
        if (next == "-") {
            input[row][col - 1] = "<"
            return update_left(row, col);
        }

        if (next == "+") {
            let key = `${row},${col}`;
            let dir = turns.get(key)
            {
                if (dir == 0) {
                    turns.set(key, 1)
                    input[row][col - 1] = "v"
                    return update_left(row, col);
                }
                if (dir == 1) {
                    turns.set(key, 2)
                    input[row][col - 1] = "<"
                    return update_left(row, col);
                }
                if (dir == 2) {
                    turns.set(key, 0)
                    input[row][col - 1] = "^"
                    return update_left(row, col);
                }
            }
        }

    }

    if (char == ">") {
        let next = input[row][col + 1];
        if (next == "/") {
            input[row][col + 1] = "^"
            return update_right(row, col);
        }
        if (next == "\\") {
            input[row][col + 1] = "v"
            return update_right(row, col);
        }
        if (next == "<" || next == "^" || next == "v") {
            update_right(row, col);
            CRASH(row, col + 1);
        }
        if (next == "-") {
            input[row][col + 1] = ">"
            return update_right(row, col);
        }

        if (next == "+") {
            let key = `${row},${col}`;
            let dir = turns.get(key)
            {
                if (dir == 0) {
                    turns.set(key, 1)
                    input[row][col + 1] = "^"
                    return update_right(row, col);
                }
                if (dir == 1) {
                    turns.set(key, 2)
                    input[row][col + 1] = ">"
                    return update_right(row, col);
                }
                if (dir == 2) {
                    turns.set(key, 0)
                    input[row][col + 1] = "v"
                    return update_right(row, col);
                }
            }
        }
    }


    if (char == "v") {
        let next = input[row + 1][col];
        if (next == "/") {
            input[row + 1][col] = "<"
            return update_down(row, col);
        }
        if (next == "\\") {
            input[row + 1][col] = ">"
            return update_down(row, col);
        }
        if (next == "<" || next == "^" || next == ">") {
            update_down(row, col);
            CRASH(row + 1, col);
        }
        if (next == "|") {
            input[row + 1][col] = "v"
            return update_down(row, col);
        }
        if (next == "+") {
            let key = `${row},${col}`;
            let dir = turns.get(key)
            {
                if (dir == 0) {
                    turns.set(key, 1)
                    input[row + 1][col] = ">"
                    return update_down(row, col);
                }
                if (dir == 1) {
                    turns.set(key, 2)
                    input[row + 1][col] = "v"
                    return update_down(row, col);
                }
                if (dir == 2) {
                    turns.set(key, 0)
                    input[row + 1][col] = "<"
                    return update_down(row, col);
                }
            }
        }
    }


    if (char == "^") {
        let next = input[row - 1][col];
        if (next == "/") {
            input[row - 1][col] = ">"
            return update_up(row, col);
        }
        if (next == "\\") {
            input[row - 1][col] = "<"
            return update_up(row, col);
        }
        if (next == "<" || next == "v" || next == ">") {
            update_up(row, col);
            CRASH(row - 1, col);
        }
        if (next == "|") {
            input[row - 1][col] = "^"
            return update_up(row, col);
        }
        if (next == "+") {
            let key = `${row},${col}`;
            let dir = turns.get(key)
            {
                if (dir == 0) {
                    turns.set(key, 1)
                    input[row - 1][col] = "<"
                    return update_up(row, col);
                }
                if (dir == 1) {
                    turns.set(key, 2)
                    input[row - 1][col] = "^"
                    return update_up(row, col);
                }
                if (dir == 2) {
                    turns.set(key, 0)
                    input[row - 1][col] = ">"
                    return update_up(row, col);
                }
            }
        }

    }
    return null;
}

while (true) {
    let ignore = new Map<string, boolean>();

    for (let row = 0; row < max_row; row++) {
        for (let col = 0; col < max_col; col++) {
            let key = `${row},${col}`;
            if (ignore.has(key)) {
                continue;
            }

            let tile = input[row][col];
            if (tile == ">" || tile == "<" || tile == "^" || tile == "v") {
                if (!turns.has(key)) {
                    turns.set(key, 0);
                }

                let moved = move_cart(tile, row, col);

                if (moved != null) {
                    ignore.set(moved, true);
                }
            }
        }
    }
    loops++;
}
