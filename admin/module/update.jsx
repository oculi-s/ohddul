import Crawl from "./crawl";
import { stock as dir } from '@/module/dir';
import Dart from "./dart";
import dt from '@/module/dt';
import json from '@/module/json';
import Price from "./price";

// earn은 가져오지 않음
async function suggest({ data, code }) {
    const price = json.read(dir.price(code), { data: [] })
        .data.sort(dt.sort);
    const [cur, prv] = price.slice(0, 2);
    if (cur?.close && prv?.close) {
        const close = cur.close;
        const prev = prv.close;
        data[code] = { close, prev }
        return true;
    }
    return false;
}

async function suggestAll({ startTime }) {
    const data = json.read(dir.all, { last: 0 });
    if (!dt.update(data)) return false;
    const meta = json.read(dir.meta, { data: {} }).data;
    const codes = Object.keys(meta);
    let res = 0;
    for await (let code of codes) {
        res += await suggest({ data, code });
    }
    if (res) json.write(dir.all, data);
    console.clear();
    console.log(`${dt.hhmmss(dt.num() - startTime, { time: 1 })} suggest updated`);
}

export const updateAll = async () => {
    const startTime = dt.num();
    json.write('$/.update', { updating: 1, startTime });
    console.clear();
    console.log('update start');
    try {
        await Crawl.date();
        await Crawl.meta();
        await Crawl.group();
        await Crawl.induty();
        await Dart.list();
        await Dart.earns({ startTime });
        await Dart.shares({ startTime });
        await Price.market({ startTime });
        await Price.prices({ startTime });
        await suggestAll({ startTime });
        await Dart.induty({ startTime });
        console.clear();
        console.log(`${dt.hhmmss(dt.num() - startTime, { time: 1 })} updated`);
    } catch (e) {
        console.log(e);
    }
    const endTime = dt.num();
    json.write('$/.update', { updating: 0, startTime, endTime });
}