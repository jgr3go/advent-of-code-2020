import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

let data: string[] = [];
let numbers: number[] = [];
let PREAMBLE = 25;

function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  numbers = data.map(d => parseInt(d));
}

function findTarget(numbers: number[], target: number) {
  for (let ii = 0; ii < numbers.length; ii++) {
    for (let jj = 1; jj < numbers.length; jj++) {
      if (numbers[ii] + numbers[jj] == target) {
        return true;
      }
    }
  }
  return false;
}

// O(25^2 * n) 
// for each number, check each pair of the subset of 25 numbers
function part1(): number|null {
  for (let idx = 0; idx < numbers.length; idx++) {
    if (!findTarget(<number[]>numbers.slice(idx, idx+25), numbers[idx+25])) {
      let answer = numbers[idx+25];
      console.log('part1', answer);
      return answer;
    }
  }
  return null;
}

// O(n^2) ? I think
function part2() {
  let found = false;
  let start = 0;
  let target = <number>part1();
  while (!found) {
    let cur = start;
    let sum = 0;

    while (sum <= target) {
      sum = numbers.slice(start, cur).reduce((summ, val) => summ+val, 0);
      if (sum == target) {
        let section = numbers.slice(start, cur);
        let min = <number>_.min(section);
        let max = <number>_.max(section);
        console.log('part2', min+max);
        found = true;
        break;
      } else {
        cur++;
      }
    }
    start++;
  }
}

readFile();
// part2 needs part1 so don't call it directly
part2();