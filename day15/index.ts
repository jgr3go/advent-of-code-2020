import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash'
import { last } from 'lodash';

let data: string[] = [];
let numbers: number[] = [];
function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());
  numbers = data[0].split(',').map(x => parseInt(x));
}



function spokenGame(turnCount: number) {
  let spokenNumbers: {[num: number]: number[]} = {};
  let turn = 1;
  let lastSpoken: number;

  // initialization
  for (let num of numbers) {
    spokenNumbers[num] = [turn];
    lastSpoken = num;
    turn++;
  }

  while (turn <= turnCount) {
    if (spokenNumbers[lastSpoken].length == 1) {
      spokenNumbers[0].push(turn);
      lastSpoken = 0;
    } else {
      let spoken = spokenNumbers[lastSpoken];
      let diff = spoken[spoken.length-1] - spoken[spoken.length-2];
      if (!spokenNumbers[diff]) {
        spokenNumbers[diff] = [turn];
      } else {
        spokenNumbers[diff].push(turn);
      }
      lastSpoken = diff;
    }

    // memory management 
    spokenNumbers[lastSpoken] = spokenNumbers[lastSpoken].slice(-2);
    turn++;
  }

  return lastSpoken;
}

function part1() {
  let lastSpoken = spokenGame(2020);
  console.log('part1', lastSpoken);
}

function part2() {
  let start = new Date();
  let lastSpoken = spokenGame(30000000);
  let end = new Date();
  console.log('part2', lastSpoken, start, end);
}

readFile();
part1();
part2();
