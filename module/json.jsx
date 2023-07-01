import encode from '@/module/alias'
import fs from 'fs';
import path from 'path';
import dt from './dt';
import { XMLParser } from 'fast-xml-parser/src/fxp';

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
        return def;
    }
}

function write(url, data, last = true) {
    url = encode(url);
    const dir = path.dirname(url);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof (data) == 'object' && last) data.last = dt.num();
    data = JSON.stringify(data, null, null);
    return fs.writeFileSync(url, data);
}

function remove(url) {
    url = encode(url);
    if (!fs.existsSync(url)) return;
    return fs.unlinkSync(url);
}

function queue(url, elem, last = false) {
    url = encode(url);
    const data = json.read(url, { data: [], queue: [] });
    elem.date = dt.num();
    data?.queue.push(elem);
    return json.write(url, data, last);
}

function toggle(url, elem) {
    url = encode(url);
    const data = json.read(url, []);
    const i = data.indexOf(elem);
    if (i != -1) {
        data.splice(i, 1);
    } else {
        data.push(elem);
    }
    return json.write(url, data);
}

function up(url, def) {
    url = encode(url);
    const { code, key } = def;
    const init = {};
    init[code] = {};
    const data = json.read(url, init);
    data[code] = data[code] || {};
    if (data[code][key]) data[code][key]++;
    else data[code][key] = 1;
    return json.write(url, data);
}

function toTable(json) {
    if (typeof (json) == 'string') {
        json = JSON.parse(json);
    }
    let r = '<tr>' + data(json, 0, depth(json)) + '</tr>';
    return <tbody dangerouslySetInnerHTML={{ __html: r }}></tbody>;
}

export default {
    read, xml, write, remove,
    queue, toggle, up, toTable,
};

function child(dict) {
    var v = 0;
    Object.keys(dict).forEach(key => {
        let value = dict[key];
        if (typeof (value) == 'object') {
            if (Object.keys(dict[key]).length) {
                v += child(dict[key]);
            } else {
                v += 1;
            }
        } else if (typeof (value) != 'undefined') {
            v += 1;
        }
    })
    return v;
}

function depth(dict) {
    // 밑으로 자식이 몇단계까지 있는지
    var v = 0;
    for (let key of Object.keys(dict)) {
        const value = dict[key];
        if (typeof (value) == 'object') {
            if (Object.keys(value)?.length) {
                v = Math.max(depth(value) + 1, v);
            }
        }
    }
    return v;
}

function data(dict, cur, max) {
    const d = max - cur;
    return Object.keys(dict).map(key => {
        if (key.trim().length) {
            const value = dict[key];
            const isth = value?.isth;
            const cs = value?.cs;
            delete value?.isth;
            delete value?.cs;
            if (typeof (value) == 'string') {
                return `<td>${key}</td>${value}</tr>`;
            } else if (Object.keys(value).length) {
                let c = child(value);
                let row = c ? ` rowspan=${c} ` : '';
                let col = depth(value) == 0 ? ` colspan=${d} ` : '';
                return `<th${col}${row}>${key}</th>${data(value, cur + 1, max)}</tr>`;
            } else {
                let col = cs ? ` colspan=${cs}` : "";
                return isth ? `<th${col}>${key}</th></tr>` :
                    `<td${col}>${key}</td></tr>`;
            }
        }
    }).join('');
}