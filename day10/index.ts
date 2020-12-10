import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { S_IFDIR } from 'constants';

let data: string[] = [];
let numbers: number[] = [];

function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  numbers = _.sortBy(data.map(d => parseInt(d)));
}

// Have to use every adapter, and figure out how many
// jolt jumps of each value there are. 
function part1() {
  // outlet starts at 0
  let previous = 0;
  let diffs: {[diff: number]: number} = {};
  for (let num of numbers) {
    // different in jolts between current adapter and previous on
    let diff = num - previous;

    // add to dictionary counting the number of each differential
    if (!diffs[diff]) diffs[diff] = 0;
    diffs[diff] += 1;
    
    // bump
    previous = num;
  }

  // add the adapter for your charger, given as a 3 jolt difference
  diffs[3] += 1;

  let ones = diffs[1];
  let threes = diffs[3];
  console.log('part1', ones*threes);
}

// Count the total number of options between 0 and the last adapter
// The number of possible paths to any specific adapter is equal to the sum
// of the possible paths leading to it. 
function part2() {
  let target = <number>_.max(numbers);
  let pathsTo: {[val: number]: number} = {}
  // only 1 way to start
  pathsTo[0] = 1;
  for (let ii = 0; ii < numbers.length; ii++) {
    let cur = numbers[ii];
    pathsTo[cur] = 0;
    // possible paths to any given number are only within 
    // 3 less than that number. if any one of those numbers
    // exist, add it to the current possible paths
    if (pathsTo[cur-3]) {
      pathsTo[cur] += pathsTo[cur-3];
    }
    if (pathsTo[cur-2]) {
      pathsTo[cur] += pathsTo[cur-2];
    }
    if (pathsTo[cur-1]) {
      pathsTo[cur] += pathsTo[cur-1];
    }
  }
  console.log('part2', pathsTo[target]);
}

readFile();
part1();
part2();