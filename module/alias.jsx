import path from 'path';

const o = path.resolve('.');
const adict = {
    "@": o,
    "$": path.resolve(o, "public"),
    "#": path.resolve(o, "data", "pred"),
    "&": path.resolve(o, "data", "stock"),
    "_": path.resolve(o, "data", "meta"),
}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => String(adict[e] ? adict[e] : e));
    return path.resolve(...url);
}