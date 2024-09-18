import path from 'path';

const o = path.resolve('.');
const d = path.resolve('../tradepick-api/data');
const adict = {
    "@": o,
    "$": path.resolve(o, "public"),
    "#": path.resolve(d, "pred"),
    "&": path.resolve(d, "stock"),
    "_": path.resolve(d, "meta"),
    "d": d,

}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => String(adict[e] ? adict[e] : e));
    return path.resolve(...url);
}