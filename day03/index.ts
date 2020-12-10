import * as path from 'path';
import * as fs from 'fs';


let data = fs.readFileSync(path.join(__dirname, 'input.txt'))
  .toString()
  .split('\r\n')
  .map(x => x.trim());

async function part1() {

  let trees = 0;
  // skip row 1
  let curIndex = 3;
  for (let ii = 1; ii < data.length; ii++) {
    let row = data[ii];
    if (curIndex > row.length-1) {
      curIndex -= row.length;
    }
    if (row[curIndex] == '#') trees++;

    curIndex += 3;
  }

  console.log('part1', {trees})
}


async function part2() {
  let trees = [];
  let slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

  for (let slope of slopes) {
    let curIndex = slope[0];
    let skip = slope[1];
    let count = 0;
    for (let ii = slope[1]; ii < data.length; ii += skip) {
      let row = data[ii];
      if (curIndex > row.length-1) curIndex -= row.length;

      if (row[curIndex] == '#') count++;

      curIndex += slope[0];
    }

    trees.push(count);

  }

  console.log(trees, trees.reduce((val, trees) => val * trees, 1));
}

part1();
part2();