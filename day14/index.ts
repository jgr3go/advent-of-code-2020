import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash'

let data: string[] = [];
function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());
}

let MASKLINE = /^mask = ([X01]+)$/;
let MEMLINE = /^mem\[(\d+)\] = (\d+)$/;

interface Memline {
  addr: number;
  val: number;
}

function getMaskValue(mask: string, num: number) {
  let result = [];
  let binaryNum = _.padStart(num.toString(2), mask.length, '0');
  for (let ii = 0; ii < mask.length; ii++) {
    if (mask[ii] == 'X') {
      result.push(binaryNum[ii]);
    } else {
      result.push(mask[ii]);
    }
  }
  return result.join('');
}

function getFloatingMaskValue(mask: string, num: number) {
  let result = [];
  let binaryNum = _.padStart(num.toString(2), mask.length, '0');
  for (let ii = 0; ii < mask.length; ii++) {
    if (mask[ii] == '0') {
      result.push(binaryNum[ii]);
    } else {
      result.push(mask[ii]);
    }
  }
  return result.join('');
}

function spreadFloatingMask(mask: string) {
  let masks: string[][] = [[]];

  for (let ii = 0; ii < mask.length; ii++) {
    if (mask[ii] != 'X') {
      masks.forEach(m => m.push(mask[ii]));
    } else {
      let masks0 = _.cloneDeep(masks);
      let masks1 = _.cloneDeep(masks);
      masks0.forEach(m => m.push('0'));
      masks1.forEach(m => m.push('1'));
      masks = masks0.concat(masks1);
    }
  }

  return masks.map(m => m.join(''));
}


function part1() {
  let registry: {[key: string]: string} = {};
  let currentMask: string;
  let mem: Memline;
  
  for (let line of data) {
    if (line.match(MASKLINE)) {
      currentMask = line.match(MASKLINE)[1];
    } else {
      let match = line.match(MEMLINE);
      mem = {addr: parseInt(match[1]), val: parseInt(match[2])};
      registry[mem.addr] = getMaskValue(currentMask, mem.val);
    }
  }

  let sum = Object.values(registry).reduce((sum, val) => sum += parseInt(val, 2), 0);
  console.log('part1', sum)
}

function part2() {
  let registry: {[key: number]: number} = {};
  let currentMask: string;
  let mem: Memline;

  for (let line of data) {
    if (line.match(MASKLINE)) {
      currentMask = line.match(MASKLINE)[1];
    } else {
      let match = line.match(MEMLINE);
      mem = {addr: parseInt(match[1]), val: parseInt(match[2])};
      let addrmask = getFloatingMaskValue(currentMask, mem.addr);
      let addrs = spreadFloatingMask(addrmask);
      for (let addr of addrs) {
        registry[parseInt(addr, 2)] = mem.val;
      }
    }
  }

  let sum = Object.values(registry).reduce((sum, val) => sum += (val || 0), 0);
  console.log('part2', sum);
}

readFile();
part1();
part2();