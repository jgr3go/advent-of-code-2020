import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { dir } from 'console';

let data: string[][] = [];

function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim())
    .map(x => x.split(''));
}


function getValue(grid: string[][], row: number, col: number) {
  return grid[row] ? grid[row][col] : null;
}

const EMPTY = 'L';
const OCCUPIED = '#';
const FLOOR = '.';

const DIRECTION = [
  [-1, -1], 
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

function part1() {
  let iteration = 0;
  let grid = _.cloneDeep(data);

  let changed = true;
  while (changed) {
    changed = false;
    iteration++;
    let newGrid = _.cloneDeep(grid);
    for (let ridx = 0; ridx < grid.length; ridx++) {
      let row = grid[ridx];
      for (let cidx = 0; cidx < row.length; cidx++) {

        let cell = grid[ridx][cidx];
        let empty = 0;
        let occup = 0;
        let floor = 0;
        for (let neighbor of DIRECTION) {
          let val = getValue(grid, ridx + neighbor[0], cidx + neighbor[1]);
          switch (val) {
            case OCCUPIED:
              occup += 1;
              break;
            case EMPTY:
              empty += 1;
              break;
            case FLOOR:
              floor += 1;
              break;
            default:
              // probably out of index
          }
        }
        if (cell == EMPTY && occup == 0) {
          changed = true;
          newGrid[ridx][cidx] = OCCUPIED;
        } else if (cell == OCCUPIED && occup >= 4) {
          changed = true;
          newGrid[ridx][cidx] = EMPTY;
        }
      }
    }
    grid = newGrid;
  }

  let total = 0;
  for (let row of grid) {
    for (let cell of row) {
      if (cell == OCCUPIED) total++;
    }
  }
  console.log('part1', total);
}


function part2() {
  let iteration = 0;
  let grid = _.cloneDeep(data);

  let changed = true;
  while (changed) {
    changed = false;
    iteration++;
    let newGrid = _.cloneDeep(grid);
    for (let ridx = 0; ridx < grid.length; ridx++) {
      let row = grid[ridx];
      for (let cidx = 0; cidx < row.length; cidx++) {

        let cell = grid[ridx][cidx];
        if (cell == FLOOR) continue;
        let empty = 0;
        let occup = 0;
        for (let direction of DIRECTION) {
          let horiz = direction[0], vert = direction[1];
          let val = getValue(grid, ridx+horiz, cidx+vert);
          let found = false;
          while (val && !found) {
            switch (val) {
              case OCCUPIED:
                occup += 1;
                found = true;
                break;
              case EMPTY:
                empty += 1;
                found = true;
                break;
              default:
                // FLOOR or out of index
            }
            horiz += direction[0];
            vert += direction[1];
            val = getValue(grid, ridx+horiz, cidx+vert);
          }
        }
        if (cell == EMPTY && occup == 0) {
          changed = true;
          newGrid[ridx][cidx] = OCCUPIED;
        } else if (cell == OCCUPIED && occup >= 5) {
          changed = true;
          newGrid[ridx][cidx] = EMPTY;
        }
      }
    }
    grid = newGrid;
    
  }

  let total = 0;
  for (let row of grid) {
    for (let cell of row) {
      if (cell == OCCUPIED) total++;
    }
  }
  console.log('part2', total);
}


readFile();
part1();
part2();
