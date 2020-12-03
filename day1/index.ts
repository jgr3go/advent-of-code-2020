import * as path from 'path';
import * as fs from 'fs'

let text = fs.readFileSync(path.join(__dirname, './input.txt')).toString().split('\r\n').map(x => parseInt(x));


async function part1() {
  
  for (let ii = 0; ii < text.length - 1; ii++) {
    for (let jj = ii; jj < text.length - 1; jj++) {
      if (text[ii] + text[jj] == 2020) {
        console.log(text[ii], text[jj], text[ii]*text[jj]);
        return;
      }
    }
    
  }
}

async function part2() {
  for (let ii = 0; ii < text.length - 1; ii++) {
    for (let jj = ii; jj < text.length - 1; jj++) {
      for (let kk = jj; kk < text.length - 1; kk++) {
        if (text[ii] + text[jj] + text[kk] == 2020) {
          console.log(text[ii], text[jj], text[kk], text[ii]*text[jj]*text[kk]);
        }
      }
    }
  }
}

part1();
part2();


