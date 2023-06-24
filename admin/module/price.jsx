import yf from 'yahoo-finance';
import json from '@/module/json';
import dt from '@/module/dt';
import { stock as dir } from '@/module/dir';

const RANGE = ({ i, N, len }) => [i * N, Math.min(len, (i + 1) * N)]; // start, end
const meta = json.read(dir.meta).data;
const type = code => meta[code]?.type == 'K' ? '.KS' : '.KQ';
const Price = {};

/**
 * kospi, kosdaq, 2 calls
 */
Price.market = async ({ startTime }) => {
    const kospi = json.read(dir.market, { kospi: [], kosdaq: [] });
    if (!dt.update(kospi)) return;
    const keyMap = {
        '^KS11': 'kospi',
        '^KQ11': 'kosdaq'
    }
    const keys = ['^KS11', '^KQ11'];
    await yf.historical({
        symbols: keys,
        from: '2000-01-01',
        to: dt.toString(),
    }, function (err, result) {
        for (let yfCode of Object.keys(result)) {
            let data = result[yfCode];
            if (data.length) {
                data.forEach(x => {
                    x.date = x.date.toISOString().split('T')[0];
                    delete x.adjClose;
                    delete x.symbol;
                    delete x.volume;
                })
            }
            kospi[keyMap[yfCode]] = data;
        }
    })
    json.write(dir.market, kospi);
}

const priceRange = async ({ keys, start = 0, end }) => {
    keys = keys.slice(start, end);
    console.log(start, end);
    let from = '2000-01-01';
    // keys.forEach(code => {
    //     let price = json.read(dir.price(code), { data: [] }).data;
    //     price = price.sort(dt.sort);
    //     if (price.slice(-1)[0]) {
    //         let last = price.slice(-1)[0].date;
    //         from = dt.toString(dt.min(from, last));
    //     }
    // });
    keys = keys.map(e => e + type(e));
    await yf.historical({
        symbols: keys,
        from: '2000-01-01',
        to: dt.toString(),
    }, function (err, result) {
        for (let yfCode of Object.keys(result)) {
            let code = yfCode.split('.')[0];
            let data = result[yfCode];
            if (data.length) {
                data.forEach(x => {
                    x.date = x.date.toISOString().split('T')[0];
                    delete x.adjClose;
                    delete x.symbol;
                })
                json.write(dir.price(code), { data });
            }
        }
    })
}

/**
 5-20s each, 26 calls, 2m30s-8m40s
 */
Price.prices = async ({ startTime }) => {
    const meta = json.read(dir.meta).data;
    const keys = Object.keys(meta).filter(code => {
        let price = json.read(dir.price(code));
        return dt.update(price);
    });
    const len = keys.length;
    if (!len) return;
    const N = 100;
    for await (let i of Array(parseInt(len / N) + 1).keys()) {
        const [start, end] = RANGE({ i, N, len });
        await priceRange({ keys, start, end });
        console.clear();
        console.log(`${dt.hhmmss(dt.now() - startTime)} ${end}/${len} yf updated`);
    }
}

export default Price;