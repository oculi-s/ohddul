import path from 'path';

const o = process.cwd();
console.log(o);
const adict = {
    "@": o,
    "$": o + "/public",
    "&": o + "/public/stock",
    "_": o + "/public/meta",
}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => adict[e] ? adict[e] : e);
    return url.join('/');
}