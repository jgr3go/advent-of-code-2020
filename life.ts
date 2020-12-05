
import * as _ from 'lodash';


class Manager {
  grid: Grid;
  iterations: number = 0;

  constructor(width: number, height: number, iterationMS: number = 500) {
    this.grid = new Grid(width, height);
  }
  
  print() {
    process.stdout.cursorTo(0, 0);
    process.stdout.write(`Iteration ${this.iterations}   `)
    for (let row = 0; row < this.grid.cells.length; row++) {
      for (let col = 0; col < this.grid.cells[0].length; col++) {
        let cell = this.grid.cells[row][col];
        process.stdout.cursorTo(col, row+1);
        // process.stdout.clearLine(0);
        process.stdout.write(cell.alive ? 'X' : ' ');
      }
    }
  }

  iterate(ms: number = 1000) {
    setTimeout(() => {
      this.iterations++;
      this.grid.iterate();
      this.print();
      this.iterate();
    }, ms);
  }
}


class Grid {
  cells: Cell[][];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let row = 0; row < this.height; row++) {
      let curRow: Cell[] = [];
      for (let col = 0; col < this.width; col++) {
        curRow.push(new Cell(row, col, false));
      }
      this.cells.push(curRow);
    }
  }

  rebuild() {
    let newCells: Cell[][] = [];
    for (let row = 0; row < this.height; row++) {
      let curRow: Cell[] = [];
      for (let col = 0; col < this.width; col++) {
        let curCell = this.cells[row][col];
        let shouldLive = this.shouldLive(curCell);
        curRow.push(new Cell(row, col, shouldLive));
      }
      newCells.push(curRow);
    }
    this.cells = newCells;
  }

  shouldLive(cell: Cell) {
    let neighbors = this.getNeighbors(cell);
    let alive = neighbors.reduce((count, neighbor) => count + (neighbor.alive ? 1 : 0), 0);
    if (cell.alive && (2 <= alive && alive <= 3)) return true;
    if (!cell.alive && alive == 3) return true;
    return false;
  }

  getNeighbors(cell: Cell) {
    let neighbors: Cell[] = [];
    let deltas = [
      {row:-1,col:-1},
      {row:-1,col:0},
      {row:-1,col:1},
      {row:0,col:-1},
      {row:0,col:1},
      {row:1,col:-1},
      {row:1,col:0},
      {row:1,col:1}
    ];
    for (let delta of deltas) {
      let rIdx = cell.row + delta.row;
      let cIdx = cell.col + delta.col;
      if (this.cells[rIdx] && this.cells[rIdx][cIdx]) {
        neighbors.push(this.cells[rIdx][cIdx]);
      }
    }
    return neighbors;
  }

  iterate() {
    this.rebuild();
  }
}

class Cell {
  row: number;
  col: number;
  alive: boolean = false;

  constructor(row: number, col: number, alive: boolean) {
    this.row = row;
    this.col = col;
    this.alive = alive;
  }
}

let Oscillators = {
  createBlinker: (manager: Manager, row: number, col: number) => {
    manager.grid.cells[row][col].alive = true;
    manager.grid.cells[row][col+1].alive = true;
    manager.grid.cells[row][col+2].alive = true;
  },
  createToad: (manager: Manager, row: number, col: number) => {
    manager.grid.cells[row][col].alive = true;
    manager.grid.cells[row][col+1].alive = true;
    manager.grid.cells[row][col+2].alive = true;
    manager.grid.cells[row-1][col+1].alive = true;
    manager.grid.cells[row-1][col+2].alive = true;
    manager.grid.cells[row-1][col+3].alive = true;
  },
  createBeacon: (manager: Manager, row: number, col: number) => {
    manager.grid.cells[row][col].alive = true;
    manager.grid.cells[row][col+1].alive = true;
    manager.grid.cells[row+1][col].alive = true;
    manager.grid.cells[row+1][col+1].alive = true;
    manager.grid.cells[row+2][col+2].alive = true;
    manager.grid.cells[row+2][col+3].alive = true;
    manager.grid.cells[row+3][col+2].alive = true;
    manager.grid.cells[row+3][col+3].alive = true;
  }
  
}

let Spaceships = {
  createGlider: (manager: Manager, row: number, col: number) => {
    manager.grid.cells[row][col].alive = true;
    manager.grid.cells[row+1][col+1].alive = true;
    manager.grid.cells[row+1][col+2].alive = true;
    manager.grid.cells[row][col+2].alive = true;
    manager.grid.cells[row-1][col+2].alive = true;
  }
}




let width = 100;
let height = 20;
let living = 300;

let manager = new Manager(width, height);
Oscillators.createBlinker(manager, 3, 2);
Oscillators.createToad(manager, 10, 2);
Oscillators.createBeacon(manager, 3, 8);
Spaceships.createGlider(manager, 3, 14);

for (let ii = 0; ii < living; ii++) {
  let randRow = Math.floor(Math.random() * height);
  let randCol = Math.floor(Math.random() * width);
  manager.grid.cells[randRow][randCol].alive = true;
}



manager.iterate(500);


