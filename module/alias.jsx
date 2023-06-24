import path from 'path';

var o;
if (process.platform == 'linux') {
    o = path.resolve('/');
} else {
    o = path.resolve('.');
}
const adict = {
    "@": o,
    "$": path.join(o, "public"),
    "&": path.join(o, "public", "stock"),
    "_": path.join(o, "public", "meta"),
}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => String(adict[e] ? adict[e] : e));
    return path.join(...url);
}