
import * as _ from 'lodash';


class Manager {
  grid: Grid;
  iterationMS: number = 500;
  iterations: number = 0;

  constructor(width: number, height: number, iterationMS: number = 500) {
    this.grid = new Grid(width, height);
  }
  
  print() {
    process.stdout.cursorTo(0, 0);
    process.stdout.write(`Iteration ${this.iterations}`)
    for (let row = 0; row < this.grid.cells.length; row++) {
      for (let col = 0; col < this.grid.cells[0].length; col++) {
        let cell = this.grid.cells[row][col];
        process.stdout.cursorTo(col, row+1);
        process.stdout.clearLine(0);
        process.stdout.write(cell.alive ? '▉' : ' ');
      }
    }
  }

  iterate() {
    setTimeout(() => {
      this.iterations++;
      this.grid.iterate();
      this.print();
      this.iterate();
    }, this.iterationMS);
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
    for (let row = 0; row < height; row++) {
      let curRow: Cell[] = [];
      for (let col = 0; col < width; col++) {
        curRow.push(new Cell(row, col, false));
      }
      this.cells.push(curRow);
    }
  }

  shouldLive(cell: Cell) {
    let neighbors = this.getNeighbors(cell);
    return neighbors.reduce((count, neighbor) => count + (neighbor.alive ? 1 : 0), 0) > 0;
  }

  getNeighbors(cell: Cell) {
    let neighbors: Cell[] = [];
    let keys = [{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:-1},{x:1,y:0},{x:1,y:1}];
    for (let key of keys) {
      if (this.cells[cell.x+key.x] && this.cells[cell.x+key.x][cell.y+key.y]) {
        neighbors.push(this.cells[cell.x+key.x][cell.y+key.y]);
      }
    }
    return neighbors;
  }

  iterate() {
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
}

class Cell {
  x: number;
  y: number;
  alive: boolean = false;

  constructor(x: number, y: number, alive: boolean) {
    this.x = x;
    this.y = y;
    this.alive = alive;
  }
}

let manager = new Manager(5, 5);
manager.grid.cells[1][2].alive = true;
manager.grid.cells[2][2].alive = true;
manager.grid.cells[3][2].alive = true;

manager.iterate();