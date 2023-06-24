import path from 'path';
import fs from 'fs';
// import encode from '@/module/alias'


console.log(process.cwd())
console.log(process.execPath)

const dir = fs.readdirSync('.');
// const data = fs.readFileSync('../module/alias.jsx');
console.log(dir);