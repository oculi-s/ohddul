import fs from 'fs';
import path from 'path';
import dt from './dt';
import { XMLParser } from 'fast-xml-parser/src/fxp';
import dir from './dir';

const defs = {}
defs[dir.stock.light.aside] = { sum: [], up: [], down: [] };
defs[dir.stock.light.count] = { cnt: 0, earn: {}, none: {} };
defs[dir.stock.meta] = { data: {}, index: {} };
defs[dir.stock.all] = {};
defs[dir.stock.light.tree] = {};
defs[dir.stock.light.updown] = { all: { k: 0, q: 0 }, up: { k: 0, q: 0 }, down: { k: 0, q: 0 } };
defs[dir.stock.light.group] = { data: {}, index: {} };
defs[dir.stock.light.ratio] = { data: {} };
defs[dir.user.ids] = { index: {} };
defs[dir.board.ideas] = {};

function read(url, def = { data: [], last: 0 }) {
    if (!fs.existsSync(url)) return defs[url] || def;
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
    const dir = path.dirname(url);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof (data) == 'object' && last) data.last = dt.num();
    data = JSON.stringify(data, null, null);
    fs.writeFileSync(url, data)
    return data;
}

function remove(url) {
    if (!fs.existsSync(url)) return;
    return fs.unlinkSync(url);
}

function queue(url, elem, last = false) {
    const data = read(url, { data: [], queue: [] });
    if (!elem?.d) elem.d = dt.num();
    data?.queue.push(elem);
    return write(url, data, last);
}

/**
 * array json을 읽어오고 
 */
function toggle(url, elem) {
    const data = read(url, []);
    const i = data.indexOf(elem);
    if (i != -1) {
        data.splice(i, 1);
    } else {
        data.push(elem);
    }
    write(url, data);
    return data;
}

function up(url, def, last) {
    const { code, key, up } = def;
    const init = {};
    init[code] = {};
    const data = read(url, init);
    data[code] = data[code] || {};
    data[code][key] = data[code][key] || [0, 0];
    data[code][key][up]++;
    return write(url, data, last);
}

export default {
    read, xml, write, remove,
    queue, toggle, up,
};