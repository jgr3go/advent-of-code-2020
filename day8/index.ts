import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

let data: string[] = [];
let instructions: Instruction[] = [];

interface Instruction {
  instruction: string;
  value: number;
}

function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  instructions = data.map(d => {
    return {
      instruction: d.substr(0, 3),
      value: parseInt(d.substr(4))
    };
  });

}

// works for both part1 and part2 
// if isInfinite is true, it breaks and returns the values immediately
// is done is true, it means it reached the bootloader
function detectInfinite(input: Instruction[]) {
  let visited: {[idx: number]: boolean}= {};
  let done = false;
  let idx = 0;
  let accumulator = 0;
  let isInfinite = false;
  while (!done) {
    if (visited[idx]) {
      isInfinite = true;
      break;
    }
    visited[idx] = true;

    let inst = input[idx];
    
    switch (inst.instruction) {
      case 'nop':
        idx += 1;
        break;
      case 'acc': 
        accumulator += inst.value;
        idx += 1;
        break;
      case 'jmp':
        idx += inst.value;
        break;
      default: 
        break;
    }

    if (idx == input.length) {
      done = true;
    }
  }

  return {isInfinite, accumulator, done};
}

function part1(input: Instruction[]) {
  let result = detectInfinite(input);
  console.log('part1', result.accumulator);
}

// this should only be n^2 I think
// swap the instruction, run detectInfinite, and if it's still infinite, swap it back and continue
function part2() {
  for (let ii = 0; ii < instructions.length; ii++) {
    let orig = instructions[ii].instruction;
    if (orig == 'jmp') {
      instructions[ii].instruction = 'nop';
    } else if (orig == 'nop') {
      instructions[ii].instruction = 'jmp';
    } else {
      continue;
    }
    let result = detectInfinite(instructions);
    if (result.done) {
      console.log('part2', result.accumulator);
      return;
    } else {
      instructions[ii].instruction = orig;
    }
  }
}

readFile();
part1(instructions);
part2();
