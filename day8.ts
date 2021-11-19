import {fetchInputData} from "./libraries";

const year = 2018
const day = 8;

let file = fetchInputData(year, day);
///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let rows = file.split(" ").map(f=>parseInt(f)).filter( f => !isNaN(f));

let nodes=[];

function get_node(numbers: number[]) {
    // console.log("Parsing "+numbers);
    let node = {}

    node['kids']=new Array(numbers[0]);
    node['metadata_count'] = numbers[1];
    node['bytecount']=numbers[1]+2;
    if(numbers[0] == 0) {
        node["metadata"]=numbers.slice(2, 2+numbers[1]);
        // console.log(`Created node with 0 kids and ${node['metadata']} for a total of ${node['bytecount']} bytes`)
        nodes.push(node);
        return node;
    }
    let unparsed=numbers.slice(2);
    for (let i = 0; i < numbers[0]; i++) {
        let newnode=get_node(unparsed);
        node["kids"][i]=newnode;
        node['bytecount']+=newnode['bytecount'];
        unparsed=unparsed.slice(newnode["bytecount"]);
    }
    node["metadata"]=unparsed.slice(0, numbers[1]);
    nodes.push(node);
    // console.log(`Created node with ${node["kids"].length} kids and ${node['metadata']} metadata for a total of ${node['bytecount']} bytes`)
    return node;
}

let sum=0;
let head=get_node(rows);

nodes.forEach(n=>{
    let m=n["metadata"];
    sum+=m.reduce((previousNum, currentNum) => {
        return previousNum + currentNum;
    }, 0);
})
console.log("Part 1: "+sum)

function calc_node(node)
{
    if(node["kids"].length == 0) {
        let summa = node['metadata'].reduce((previousNum, currentNum) => {
            return previousNum + currentNum;
        }, 0);
        return summa;
    }
    return node['metadata'].reduce((previousNum, currentNum) => {
        // Damn 1-based indexing..
        currentNum -= 1;
        if (currentNum >= node["kids"].length)
            return previousNum;
        return previousNum + calc_node(node["kids"][currentNum]);
    },0);
}

console.log("Part 2: "+calc_node(head))

