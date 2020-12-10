import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';


let data: string[] = [];
interface Pass { row: string, seat: string };
let passes: Pass[] = [];


function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  passes = data.map(d => {
    return { row: d.substr(0, 7), seat: d.substr(7) }
  });
}

function binaryPartition(lower: number, upper: number, direction: string): number {
  if (lower == upper) {
    return lower;
  }
  if (direction[0] == 'F' || direction[0] == 'L') {
    upper = Math.floor((upper - lower)/2 + lower);
  } else {
    lower = Math.ceil(upper - (upper - lower)/2);
  }
  let newDirection = direction.substr(1);
  return binaryPartition(lower, upper, newDirection);
}

function part1() {
  let highestSeatId = 0;
  for (let pass of passes) {
    let row = binaryPartition(0, 127, pass.row);
    let seat = binaryPartition(0, 7, pass.seat);
    let seatId = row*8 + seat;
    highestSeatId = Math.max(highestSeatId, seatId);
  }
  console.log("part1", highestSeatId);
}

function part2() {
  let possibleIds: {[seat:string]: boolean} = {};
  for (let row = 0; row < 128; row++) {
    for (let seat = 0; seat < 8; seat++) {
      possibleIds[''+ (row*8 + seat)] = true;
    }
  }

  for (let pass of passes) {
    let row = binaryPartition(0, 127, pass.row);
    let seat = binaryPartition(0, 7, pass.seat);
    let seatId = row*8 + seat;
    possibleIds[''+seatId] = false;
  }

  for (let seat of Object.keys(possibleIds)) {
    let seatId = parseInt(seat);
    let previous = possibleIds[''+(seatId-1)];
    let next = possibleIds[''+(seatId+1)];
    if (possibleIds[seat] == true && previous === false && next === false) {
      console.log('part2', seatId);
    }
  }
}


readFile();
part1();
part2();


//'FBFBBFF'
//'0101100' = 0 + 0 + 4 + 8 + 32 = 44 