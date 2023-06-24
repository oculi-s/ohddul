import path from 'path';

const o = path.resolve('.');
const adict = {
    "@": o,
    "$": o + "/public",
    "&": o + "/public/stock",
    "_": o + "/public/meta",
}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => String(adict[e] ? adict[e] : e));
    return path.join(...url);
}