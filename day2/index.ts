import * as fs from 'fs';
import * as path from 'path';

let data = fs.readFileSync(path.join(__dirname, 'input.txt'))
  .toString()
  .split('\r\n')
  .map(x => x.trim());


async function part1() {
  let regex = /(\d+)\-(\d+)\s([a-z])\:\s(.+)/;
  let validcount = 0;
  let invalidcount = 0;
  for (let line of data) {
    let parts = line.match(regex);
    if (parts) {
      let start = parseInt(parts[1]);
      let end = parseInt(parts[2]);
      let letter = parts[3];
      let password = parts[4];

      let count = 0;
      for (let idx = 0; idx < password.length; idx++) {
        if (password[idx] == letter) count += 1;
      }

      let valid = start <= count && count <= end;

      if (valid) {
        validcount++;
      } else {
        invalidcount++;
      }
    }
  }

  console.log("part1", {validcount, invalidcount, count: data.length});
}

async function part2() {
  let regex = /(\d+)\-(\d+)\s([a-z])\:\s(.+)/;
  let validcount = 0;
  let invalidcount = 0;

  for (let line of data) {
    let parts = line.match(regex);
    if (parts) {
      let pos1 = parseInt(parts[1]) - 1;
      let pos2 = parseInt(parts[2]) - 1;
      let letter = parts[3];
      let password = parts[4];

      let valid = (password[pos1] == letter && password[pos2] != letter) ||
                  (password[pos2] == letter && password[pos1] != letter);
      if (valid) {
        validcount += 1;
      } else {
        invalidcount += 1;
      }
    }
  }

  console.log("part2", {validcount, invalidcount, count: data.length});
}

part1();
part2();