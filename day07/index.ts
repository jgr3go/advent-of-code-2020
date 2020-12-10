import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

let data: string[] = [];

interface Child {
  number: number;
  type: string;
}

let parentChildren: {[parent: string]: Child[]} = {};
let childParents: {[child: string]: string[]} = {};

function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
    .toString()
    .split('\r\n')
    .map(x => x.trim());

  let pattern = /^(.+) bags contain (.+)\.$/;
  for (let row of data) {
    let match = row.match(pattern);
    if (match) {
      let parent = match[1];
      parentChildren[parent] = [];
      let children = match[2].split(',');
      for (let ch of children) {
        let cmatch = ch.match(/^\s*(\d+) (.+) bag.*/);
        if (cmatch) {
          let child: Child = {
            number: parseInt(cmatch[1]),
            type: cmatch[2]
          };
          parentChildren[parent].push(child);
        }
      }
    }
  }

  // reverse the dictionary -- this doesn't store counts but does answer part 1
  for (let parent of Object.keys(parentChildren)) {
    let children = parentChildren[parent];
    for (let child of children) {
      if (!childParents[child.type]) {
        childParents[child.type] = [];
      }
      childParents[child.type].push(parent);
    }
  }
}

function part1() {
  let count = 0;
  
  let bag = 'shiny gold';
  let toSearch = _.cloneDeep(childParents[bag]);
  let alreadySearched: {[bag: string]: boolean} = {};

  while (toSearch.length) {
    let current = <string>toSearch.pop();
    if (alreadySearched[current]) {
      continue;
    }
    alreadySearched[current] = true;
    count++;

    if (childParents[current]) {
      toSearch.push(..._.cloneDeep(childParents[current]));
    }
  }

  console.log('part1', count);
}

function part2() {
  let count = 0;

  function getChildrenBagCount(current: string) {
    let children = parentChildren[current];
    let total = 0;
    if (children) {
      for (let child of children) {
        // add the number of children needed here
        total += child.number;
        // multiply by the number of children bags needed for this bag
        total += child.number * getChildrenBagCount(child.type);
      }
    }
    return total;
  }

  count = getChildrenBagCount('shiny gold');
  console.log('part2', count);

}

readFile();
part1();
part2();