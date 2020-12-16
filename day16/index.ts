import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash'
import { map } from 'lodash';

let data: string[] = [];

interface Rule {
  rule: string;
  range1: number[];
  range2: number[];
  position?: number;
}

let rules: Rule[] = [];
let ticket: number[] = [];
let nearby: number[][] = [];
let validTickets: number[][] = [];
let fields: {[position: number]: string} = {};


function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());


  let ii = 0;
  let row = data[ii];
  // rules
  while (row.trim() != '') {
    let match = row.match(/^(.+)\: (\d+)\-(\d+) or (\d+)-(\d+)$/);
    let key = match[1];
    rules.push({
      rule: key,
      range1: [parseInt(match[2]), parseInt(match[3])], 
      range2: [parseInt(match[4]), parseInt(match[5])] });
    ii++;
    row = data[ii];
  }
  
  // your ticket
  ii += 2;
  ticket = data[ii].split(',').map(x => parseInt(x));

  // nearby
  ii += 3;
  while (ii < data.length) {
    nearby.push(data[ii].split(',').map(x => parseInt(x)));
    ii++;
  }
}


function validate(value: number, rule: Rule) {
  if ((rule.range1[0] <= value && value <= rule.range1[1]) || 
    (rule.range2[0] <= value && value <= rule.range2[1])) {
    return true;
  }
  return false;
}

function foundAll() {
  return rules.every(rule => rule.position !== undefined);
}


function part1() {
  let invalidValues = 0;

  for (let ticket of nearby) {
    let valid = true;
    for (let value of ticket) {

      if (!Object.values(rules).some(rule => validate(value, rule))) {
        invalidValues += value;
        valid = false;
      }
    }
    if (valid) {
      validTickets.push(ticket);
    }
  }
  console.log('part1', invalidValues);
}

function part2() {

  while (!foundAll()) {
    // run through every remaining rule. if it only works with one number set, found it
    for (let rule of rules.filter(r => r.position === undefined)) {
      let worksWith: number[] = [];
      for (let ii = 0; ii < ticket.length; ii++) {
        // ignore fields we've found
        if (fields[ii]) continue;
        // evaluate 
        let allValues = validTickets.map(n => n[ii]);
        if (allValues.every(v => validate(v, rule))) {
          worksWith.push(ii);
        }
      }
      // only works with one column
      if (worksWith.length == 1) {
        rule.position = worksWith[0];
        fields[rule.position] = rule.rule;
      }
    }

    // reverse. run through every column. if it only matches one rule, found it
    for (let ii = 9; ii < ticket.length; ii++) {
      if (fields[ii]) continue;
      let worksWith: Rule[] = [];
      for (let rule of rules.filter(r => r.position === undefined)) {
        let allValues = validTickets.map(n => n[ii]);
        if (allValues.every(v => validate(v, rule))) {
          worksWith.push(rule);
        }
      }
      if (worksWith.length == 1) {
        worksWith[0].position = ii;
        fields[ii] = worksWith[0].rule;
      }
    }
  }

  let ans = rules.filter(r => r.rule.includes('departure'))
                .map(r => ticket[r.position])
                .reduce((mult, val) => mult * val, 1);

  console.log('part2', ans)

}


readFile();
part1(); 
part2();
