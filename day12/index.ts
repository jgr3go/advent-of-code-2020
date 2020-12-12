import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { S_IFDIR } from 'constants';
import { dir } from 'console';

let data: string[] = [];

interface Ship {
  direction: number; // 0 is north, 90 is east
  eastwest: number;
  northsouth: number;
}
interface Waypoint {
  eastwest: number;
  northsouth: number;
}

const NORTH = 0;
const EAST = 90;
const SOUTH = 180;
const WEST = 270;


function readFile() {
  data = fs.readFileSync(path.join(__dirname, process.argv[2] == 'test' ? './test.txt' : './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());
}

function getDirection(current: number, modifier: number) {
  current += modifier;
  current = current % 360;
  return current;
}


function manhattanDistance(ship: Ship) {
  return Math.abs(ship.eastwest) + Math.abs(ship.northsouth);
}

function part1(){
  let ship: Ship = {direction: 90, eastwest: 0, northsouth: 0};

  for (let move of data) {
    let action = move[0];
    let num = parseInt(move.substr(1));

    switch (action) {
      case 'N':
        ship.northsouth += num;
        break;
      case 'S':
        ship.northsouth -= num;
        break;
      case 'E':
        ship.eastwest += num;
        break;
      case 'W':
        ship.eastwest -= num;
        break;
      case 'L':
        // normalized a 360 direction between 0 and 360
        ship.direction = (360 + (ship.direction - num)) % 360;
        break;
      case 'R':
        ship.direction = (360 + (ship.direction + num)) % 360;
        break;
      case 'F':
        if (ship.direction == NORTH) ship.northsouth += num;
        else if (ship.direction == EAST) ship.eastwest += num;
        else if (ship.direction == SOUTH) ship.northsouth -= num;
        else if (ship.direction == WEST) ship.eastwest -= num;
        else throw `I hope this doesn't happen ${JSON.stringify(ship)} action ${action} num ${num}`;
        break;
    }
  }

  console.log('part1', manhattanDistance(ship));
}

function part2() {
  // waypoint starts at 10 units east (-10 for the ship)
  // and 1 unit north (-1 for ship)
  let ship: Ship = {direction: 90, eastwest: 0, northsouth: 0};
  let waypoint: Waypoint = {eastwest: 10, northsouth: 1};

  for (let move of data) {
    let action = move[0];
    let num = parseInt(move.substr(1));
    let direction: number;

    switch (action) {
      case 'N':
        waypoint.northsouth += num;
        break;
      case 'E':
        waypoint.eastwest += num;
        break;
      case 'S':
        waypoint.northsouth -= num;
        break;
      case 'W':
        waypoint.eastwest -= num;
        break;
      case 'F':
        ship.northsouth += num * waypoint.northsouth;
        ship.eastwest += num * waypoint.eastwest;
        break;

      // the next two cases could be generified i think? but whatever
      case 'R':
        // in case it's above 360
        direction = num % 360;
        if (direction == 90) {
          let {northsouth, eastwest} = waypoint; 
          waypoint = {eastwest: northsouth, northsouth: -eastwest};
        } else if (direction == 180) {
          let {northsouth, eastwest} = waypoint;
          waypoint = {eastwest: -eastwest, northsouth: -northsouth};
        } else if (direction == 270) {
          let {northsouth, eastwest} = waypoint;
          waypoint = {eastwest: -northsouth, northsouth: eastwest};
        }
        break;
      case 'L':
        // in case above 360
        direction = num % 360;
        if (direction == 90) {
          let {northsouth, eastwest} = waypoint; 
          waypoint = {eastwest: -northsouth, northsouth: eastwest};
        } else if (direction == 180) {
          let {northsouth, eastwest} = waypoint;
          waypoint = {eastwest: -eastwest, northsouth: -northsouth};
        } else if (direction == 270) {
          let {northsouth, eastwest} = waypoint;
          waypoint = {eastwest: northsouth, northsouth: -eastwest};
        }
        break;
      default:
        break;
        
    }
  }

  console.log('part2', manhattanDistance(ship));

}

readFile();
part1();
part2();