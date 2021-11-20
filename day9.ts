import {fetchInputData} from "./libraries";

const year = 2018
const day = 9;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.match(/(\d+) players; last marble is worth (\d+) points/);

function insert_new_marble(points: number, current:object) {
    let first = current["next"];
    let second = first["next"];

    let place = new Object();
    place["score"]=points;
    first["next"] = place;
    second["prev"] = place;

    place["next"] = second;
    place["prev"] = first;
    return place;
}

function play_game(players: number, game_size: number) {
    let scores: Array<number> = new Array<number>(players + 1).fill(0);
    let current_player = 0;

    let marble = new Object();
    marble["next"] = marble;
    marble["prev"] = marble;
    marble["score"] = 0;

    let current = marble;

    function print_game(current: Object, current_player: number, i: number) {
        let output = `${current_player} `;
        let first = marble;
        while (true) {
            if (current == first)
                output += ' (';
            else
                output += '  ';
            output += first["score"];
            if (current == first)
                output += ') ';
            else
                output += '  ';
            first = first["next"];
            if (first == marble)
                break
        }
        output += "Round number " + i;
        console.log(output);
    }

    for (let i = 1; i < game_size; i++) {
        // print_game(current, current_player, i);
        current_player = current_player + 1;
        if (current_player > players)
            current_player = 1;
        if (i % 23 != 0)
            current = insert_new_marble(i, current);
        else {
            let take = current;
            for (let j = 0; j < 7; j++) {
                take = take["prev"];
            }
            take["prev"]["next"] = take["next"];
            take["next"]["prev"] = take["prev"];
            scores[current_player] += i;
            scores[current_player] += take["score"];
            current = take["next"];
        }
    }
    console.log(Math.max(...scores))
}

console.log("Part 1: ")
play_game( parseInt(rows[1]),  parseInt(rows[2]));
console.log("Part 2: ")
play_game( parseInt(rows[1]),  parseInt(rows[2])*100);