import * as path from 'path';
import * as fs from 'fs'


let data: string[] = [];
let passports: string[] = [];

const REQUIRED = [
 {key: 'byr', validator: (val: string) => {
    if (val.length < 4) return false;
    let ival = parseInt(val);
    return 1920 <= ival && ival <= 2002;
 }},
 {key: 'iyr', validator: (val: string) => {
    if (val.length < 4) return false;
    let ival = parseInt(val);
    return 2010 <= ival && ival <= 2020;
 }},
 {key: 'eyr', validator: (val: string) => {
    if (val.length < 4) return false;
    let ival = parseInt(val);
    return 2020 <= ival && ival <= 2030;
 }},
 {key: 'hgt', validator: (val: string) => {
    let regex = /(\d+)(cm|in)/;
    let match = val.match(regex);
    if (!match) return false;
    let height = parseInt(match[1]);
    let unit = match[2];
    if (unit == 'cm') {
      return 150 <= height && height <= 193;
    } else {
      return 59 <= height && height <= 76;
    }
 }},
 {key: 'hcl', validator: (val: string) => {
    return /^#[0-9a-f]{6}$/.test(val);
 }},
 {key: 'ecl', validator: (val: string) => {
    return /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val);
 }},
 {key: 'pid', validator: (val: string) => {
    return /^\d{9}$/.test(val);
 }}
];
const OPTIONAL = ['cid'];


function readFile() {
  data = fs.readFileSync(path.join(__dirname, './input.txt'))
  .toString()
  .split('\r\n')
  .map(x => x.trim());

  let curPassport = '';
  for (let line of data) {
    if (line.trim() == '') {
      passports.push(curPassport);
      curPassport = '';
    } else {
      curPassport += ' ' + line;
    }
  }
  passports.push(curPassport);
  passports = passports.map(p => {
    return p.split(' ').map(part => part.trim()).sort().filter(part => !!part).join(' ');
  });
}

function validateRequired(passport: string) {
  for (let req of REQUIRED) {
    let regex = new RegExp(`${req.key}:`, 'i');
    if (!passport.match(regex)) {
      return false;
    }
  }
  return true;
}

function validateRequiredRules(passport: string) {
  let fields = passport.split(' ');
  for (let field of fields) {
    let keyval = field.split(':');
    let rules = REQUIRED.find(x => x.key == keyval[0]);
    if (rules) {
      if (!rules.validator(keyval[1])) return false;
    }
  }
  return true;
}

async function part1() {

  let valid = 0;
  for (let passport of passports) {
    let isValid = validateRequired(passport);
    if (isValid) {
      valid++;
    }
  }
  console.log(`part1 count:${passports.length} valid:${valid}`)
}

async function part2() {
  let valid = 0;
  for (let passport of passports) {
    let isValid = validateRequired(passport) && validateRequiredRules(passport);
    if (isValid) {
      valid++;
    }
  }
  console.log(`part2 count:${passports.length} valid:${valid}`)
}

readFile();
part1();
part2();