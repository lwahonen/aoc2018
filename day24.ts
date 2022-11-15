#!/usr/bin/env ts-node-script
import {fetchInputData} from "./libraries.js";
import * as fs from "fs";

import {
    MinPriorityQueue,
    ICompare,
    IGetCompareValue, PriorityQueue,
} from '@datastructures-js/priority-queue';
import _, {initial, size} from "lodash";

const year = 2018
const day = 24;

let file = fetchInputData(year, day).trim();
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let testInput = 0;
if (testInput == 1) {
    file =
        `
Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
`.trim()
}

function parseRow(row: string, side:string, boost:number) {
    let result = row.match(/(\d+) units each with (\d+) hit points( \([^)]+\))? with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/)
    if (result != null) {
        let group = {
            id: null,
            count: parseInt(result[1]),
            hitpoints: parseInt(result[2]),
            damage: parseInt(result[4])+boost,
            damagetype: result[5],
            initiative: parseInt(result[6]),
            immune: [],
            weak: [],
            side: side,
            effective_power:0,
            selected:false
        };
        group.effective_power=group.count * group.damage;
        if(side == "immune") {
            immunity_id+=1;
            group.id = side + " group " + immunity_id;
        }
        else {
            infection_id += 1;
            group.id = side + " group " + infection_id;
        }


        if (result[3] != undefined) {
            let hurts = result[3].substring(2, result[3].length - 1)
            let r = hurts.split("; ")
            for (let w of r) {
                if (w.startsWith("weak to"))
                    group['weak'] = w.substring("weak to ".length).split(", ")
                else
                    group['immune'] = w.substring("immune to ".length).split(", ")
            }
        }
        return group;
    }

}
let immunity_id=0;
let infection_id=0

console.log("Part 1: "+JSON.stringify(return_score(0)))
let boost=1
while (return_score(boost).winner != "immune")
    boost*=2;
console.log("Found upper bound, immune wins at "+boost)
while (return_score(boost).winner == "immune") {
    boost--;
}
console.log("Found lower bound, "+return_score(boost).winner+" at "+boost)
console.log("Part 2: "+JSON.stringify(return_score(boost+1)))


function return_score(boost:number) {
    immunity_id = 0;
    infection_id = 0

    let immune = file.split("\n\n")[0].split("\n").splice(1).map(f => parseRow(f, "immune", boost))
    let infection = file.split("\n\n")[1].split("\n").splice(1).map(f => parseRow(f, "infection", 0))

    while (true) {
        let did_something = false;
        let everyone = [];
        everyone = everyone.concat(immune);
        everyone = everyone.concat(infection);

        everyone = _.orderBy(everyone, ['effective_power', 'initiative'], ['desc', 'desc']);

        for (let a of everyone) {
            // console.log("Selecting target for "+a.id)
            if (a.side == "immune") {
                a.target = select_target(a, infection);
            }
            if (a.side == "infection") {
                a.target = select_target(a, immune);
            }
            if (a.target != null)
                a.target.selected = true;
        }

        everyone = _.orderBy(everyone, ['initiative'], ['desc', 'desc']);
        for (let a of everyone) {
            if (a.target == null)
                continue;
            let t = a.target;
            let damagedealt = a.count * a.damage;
            if (t.weak.includes(a.damagetype)) {
                damagedealt *= 2;
            }
            if (t.immune.includes(a.damagetype)) {
                damagedealt = 0;
            }
            let killed = Math.floor(damagedealt / t.hitpoints);
            if (killed > t.count)
                killed = t.count;
            t.count -= killed;
            t.effective_power = t.count * t.damage;
            if (killed > 0)
                did_something = true;
            // console.log(a.id + " will attack " + a.target.id + " dealing " + damagedealt + " and killing " + killed)
        }

        for (let a of everyone) {
            a.selected = false;
            a.target = null;
        }
        immune = immune.filter(f => f.count > 0);
        infection = infection.filter(f => f.count > 0);
        if (!did_something)
            return {score: 0, winner: "none"};
        if (infection.length == 0 || immune.length == 0 || !did_something)
            break
    }

    let count_a = 0;
    for (let a of immune) {
        count_a += a.count;
    }
    if (count_a > 0)
        return {score: count_a, winner: "immune"};
    count_a = 0
    for (let a of infection) {
        count_a += a.count;
    }
    return {score: count_a, winner: "infection"};
}

function select_target(army, targets) {
    let max_damage = 0;
    let max_effective_power = 0;
    let max_initiative = 0;
    let target_army = null;

    for (let t of targets) {
        if (t.selected == true)
            continue;
        let damagedealt = army.count * army.damage;
        if (t.weak.includes(army.damagetype)) {
            damagedealt *= 2;
        }
        if (t.immune.includes(army.damagetype)) {
            continue;
        }
        // console.log(army.id+" would deal "+t.id+" "+damagedealt+" damage");
        if (damagedealt > max_damage) {
            max_damage = damagedealt;
            max_effective_power = t.effective_power;
            max_initiative = t.initiative;
            target_army = t;
            continue;
        }
        if (damagedealt < max_damage)
            continue;
        // We only get here if damage dealt is ==
        if (t.effective_power > max_effective_power) {
            max_damage = damagedealt;
            max_effective_power = t.effective_power;
            max_initiative = t.initiative;
            target_army = t;
            continue;
        }
        if (t.effective_power < max_effective_power)
            continue;
        // We only get here if effective power is ==
        if (t.initiative > max_initiative) {
            max_damage = damagedealt;
            max_effective_power = t.effective_power;
            max_initiative = t.initiative;
            target_army = t;
            continue;
        }
        if (t.initiative < max_initiative)
            continue;
        console.log("Unable to select target!")
    }
    // if(target_army != null)
    //     console.log("Selected target for " + army.id + " it is " + target_army.id)
    // else
    //     console.log("No viable targets for " + army.id)
    return target_army;
}