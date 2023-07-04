import encode from '@/module/alias'
import fs from 'fs';
import path from 'path';
import dt from './dt';
import { XMLParser } from 'fast-xml-parser/src/fxp';
import dir from './dir';

const defDict = {}
defDict[dir.stock.light.aside] = { sum: [], up: [], down: [] };
defDict[dir.stock.light.count] = { cnt: 0, earn: {}, none: {} };
defDict[dir.stock.meta] = { data: {}, index: {} };
defDict[dir.stock.all] = {};

function read(url, def = { data: [], last: 0 }) {
    if (!fs.existsSync(url)) return def;
    let data = fs.readFileSync(url, 'utf-8');
    try {
        data = JSON.parse(data);
    } catch { }
    return data;
}

async function xml(url, def = { data: [], last: dt.num() }) {
    const option = { numberParseOptions: { leadingZeros: false } };
    const parser = new XMLParser(option);
    if (fs.existsSync(url)) {
        return await parser.parse(fs.readFileSync(url));
    } else {
        return def[url] || def;
    }
}

function write(url, data, last = true) {
    url = encode(url);
    const dir = path.dirname(url);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof (data) == 'object' && last) data.last = dt.num();
    data = JSON.stringify(data, null, null);
    fs.writeFileSync(url, data)
    return data;
}

function remove(url) {
    url = encode(url);
    if (!fs.existsSync(url)) return;
    return fs.unlinkSync(url);
}

function queue(url, elem, last = false) {
    url = encode(url);
    const data = read(url, { data: [], queue: [] });
    elem.date = dt.num();
    data?.queue.push(elem);
    return write(url, data, last);
}

/**
 * array json을 읽어오고 
 */
function toggle(url, elem) {
    url = encode(url);
    const data = read(url, []);
    const i = data.indexOf(elem);
    if (i != -1) {
        data.splice(i, 1);
    } else {
        data.push(elem);
    }
    return write(url, data);
}

function up(url, def) {
    url = encode(url);
    const { code, key } = def;
    const init = {};
    init[code] = {};
    const data = read(url, init);
    data[code] = data[code] || {};
    if (data[code][key]) data[code][key]++;
    else data[code][key] = 1;
    return write(url, data);
}

export default {
    read, xml, write, remove,
    queue, toggle, up,
};