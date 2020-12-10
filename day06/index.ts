import * as fs from 'fs';
import * as path from 'path';

let data: string[] = [];
let grouped: string[][] = [];

function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  let curGroup = [];
  for (let row of data) {
    if (row != '') {
      curGroup.push(row);
    } else {
      grouped.push(curGroup);
      curGroup = [];
    }
  }
  grouped.push(curGroup);
}

function part1() {

  let counts = 0;

  for (let group of grouped) {
    let groupQs: {[question: string]: boolean} = {};
    for (let person of group) {
      for (let ii = 0; ii < person.length; ii++) {
        groupQs[person[ii]] = true;
      }
    }
    counts += Object.keys(groupQs).length;
  }

  console.log('part1', counts);
}

function part2() {
  let counts = 0;

  for (let group of grouped) {
    let groupQs: {[question: string]: number} = {};
    for (let person of group) {
      for (let letter of person) {
        if (!groupQs[letter]) { groupQs[letter] = 0; }
        groupQs[letter] += 1;
      }
    }
    counts += Object.values(groupQs).filter(count => count == group.length).length;
  }
  console.log('part2', counts);
}




readFile();
part1();
part2();