import path from 'path';

var o = path.resolve('.');
const adict = {
    "@": o,
    "$": path.join(o, "public"),
    "#": path.join(o, "data", "pred"),
    "&": path.join(o, "data", "stock"),
    "_": path.join(o, "data", "meta"),
}
export default function encode(url) {
    url = url.split('/').filter(e => e.length);
    url = url.map(e => String(adict[e] ? adict[e] : e).split('/'))
    url = url.flat().filter(e => e.length);
    return '/' + url.join('/');
}
