import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash'

let data: string[] = [];
let ARRIVAL:number; 
let TIMES: number[] = [];
let BUSES: Bus[] = [];


// ugh, this was obviously a stupid idea. 
let seed = 100000000000000;

function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  ARRIVAL = parseInt(data[0]);
  BUSES = data[1].split(',').map((val, idx) => ({id: parseInt(val) || val, index: idx}));
  TIMES = BUSES.filter(x => x.id != 'x').map(x => <number>x.id);
}

interface Bus {
  id: number|string;
  index: number;
}

interface TimeDepart extends Bus {
  depart: number
}

// brute force, i don't know if this will be fast enough
// update: turns out it's fine
function part1() {
  
  let allTimes: {depart: number, id: number}[] = [];
  for (let time of TIMES) {
    let cur = time;
    while (cur <= ARRIVAL + time) {
      allTimes.push({depart: cur, id: time});
      cur += time;
    }
  }

  allTimes = _.sortBy(allTimes, x => x.depart);
  let valid = allTimes.filter(x => x.depart >= ARRIVAL);
  let first = valid[0];

  console.log('part1', (first.depart - ARRIVAL) * first.id);
}


// Algo attempt #3 on this
// Ultimately this builds up on itself.  With a list of 2 numbers, the first time we find 
// X and X+1 for two primes is valid. The next time we'll see this pattern between the two 
// numbers is the next lowest common denominator added to it, in this case, X * Y since 
// all values are prime.
// When we add a third value Z to the list, we attempt to set the value to X+2. But if this 
// isn't a multiple of Z, then we bump all previous numbers by the current LCM and attempt again. 
// Once this works, we add Z to the LCM (X*Y*Z) and proceed to the forth. 
// x's were ignorable but honestly just super annoying.
function part2() {
  let fullList: TimeDepart[] = _.cloneDeep(BUSES).map(bus => {
    return {id: bus.id, index: bus.index, depart: <number>(bus.id != 'x' ? bus.id : undefined)};
  });

  let current = fullList.shift();
  // lowest common multiple of all previous numbers we've seen
  let lcm = <number>current.id;
  let completedList: TimeDepart[] = [current];

  current = fullList.shift();
  while (current) {
    // bump value up to next multiple of itself after the list we already have
    // ideally is the previous number + 1
    let desired = completedList[completedList.length - 1].depart + 1;

    // this just primes the next actual number. can't hurt
    if (current.id == 'x') {
      current.depart = desired;
      completedList.push(current);
      current = fullList.shift();
      continue;
    }
    else {
      while (desired % <number>current.id != 0) {
        // if we haven't found it, the next time all the previous numbers will be 
        // at the same +1 +1 values is when we add the LCM to all of them. 
        for (let comp of completedList) {
          comp.depart += lcm;
        }

        // reset the desired in the hopes that this time will be it
        desired = completedList[completedList.length - 1].depart + 1;

      }
      // if we're here, we've found it the next possible number. 
      current.depart = desired;
      completedList.push(current);
      // only reason we can do this is because all the buses are primes already
      // otherwise we'd have to break down all of the previous numbers into their prime factors
      lcm = lcm * <number>current.id;
    }

    current = fullList.shift();
  }

  console.log('part2', completedList[0].depart);
}

/**
 * BEWARE ALL YE WHO TRAVEL BELOW. 
 * These solutions were.... not good.  Actually one of them is still running.
 * Given how long part2AlsoTooSlow is running I'd give it 4.5 days to find the answer. 
 * Anyway, tread softly. 
 */

function part2AlsoTooSlow() {

  let start = new Date();

  let fullList: TimeDepart[] = _.cloneDeep(BUSES).map(bus => {
    return {id: bus.id, index: bus.index, depart: <number>(bus.id != 'x' ? bus.id : undefined)};
  });

  let max = <TimeDepart>_.maxBy(fullList.filter(x => x.id != 'x'), x => x.id);
  max.depart = seed;
  while (max.depart % <number>max.id) {
    max.depart += 1;
  }

  let found = false;
  let iteration = 0;
  while (!found) {
    iteration++;
    if (iteration % 10000 == 0) {
      console.log({iteration, max});
    }
    let validateByMax = () => {
      for (let ii = 0; ii < fullList.length; ii++) {
        let item = fullList[ii];
        if (item.id == 'x') continue;
        if ((max.depart - (max.index - item.index)) % <number>item.id != 0) {
          return false;
        }
      }
      return true;
    }

    if (validateByMax()) {
      found = true;
      break;
    }

    max.depart += <number>max.id;
  }

  let end = new Date();
  console.log('part2', <number>max?.depart - <number>max?.index, start, end);
  
}


function part2TooSlow() {

  let fullList: TimeDepart[] = _.cloneDeep(BUSES).map(bus => {
    return {id: bus.id, index: bus.index, depart: <number>(bus.id != 'x' ? bus.id : undefined)};
  });
  let numberList = _.sortBy(fullList.filter(x => x.id != 'x'), x => x.id);

  let found = false;
  let iteration = 0;

  while (!found) {
    iteration++;

    if (validate(fullList)) {
      found = true;
      break;
    }

    // bump up first 
    fullList[0].depart += <number>fullList[0].id;
    // catch up all the other numbers
    catchUp(fullList);
    
    if (iteration % 10000 == 0) {
      console.log({iteration, first: fullList[0]});
    }

  }

  console.log('part2', fullList[0].depart);
}

function validate(times: TimeDepart[]) {
  for (let ii = 0; ii < times.length - 1; ii++) {
    let current = times[ii];
    if (current.id == 'x') continue; // ignore these
    let next = times.slice(ii+1).find(x => x.id != 'x');
    
    // subtract the original indices to validate whether this is accurate
    if (next && current.depart != next.depart - (next.index - current.index)) return false;

  }
  return true;
}

function catchUp(list: TimeDepart[]) {
  for (let ii = 1; ii < list.length; ii++) {
    if (list[ii].id == 'x') {
      list[ii].depart = list[ii - 1].depart + 1;
    } else {
      while (list[ii].depart < list[ii-1].depart) {
        list[ii].depart += <number>list[ii].id;  
      }
    }
  }
}

readFile();
part1();
part2();
