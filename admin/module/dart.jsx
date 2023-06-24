import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';
import dt from '@/module/dt';
import json from '@/module/json';
import { stock as dir } from '@/module/dir';
import { url, dartKeys } from './crawl';
import encode from '@/module/alias';
import { Int, Sleep } from '@/module/ba';

var call = 0;
const RANGE = ({ i, N, len }) => [i * N, Math.min(len, (i + 1) * N)]; // start, end
const TIME = 120; // ip 차단되는 단위 ms
async function get(name, option) {
    call++;
    const u = url.dart[name](option);
    try {
        let res = await axios.get(u);
        if (res.status != 200) return false;
        res = res.data;
        if (res.status == '000') {
            return res.list || res;
        } else if (res.status == '013') {
            return false;
        }
    } catch {
        await Sleep(10 * 1000);
        await get(name, option);
    }
}

const Dart = {};
Dart.list = async () => {
    const dart = json.read(dir.dart.list, { last: 0, data: {} });
    const { data } = dart;
    if (!dt.update(dart)) return false;

    let xml = await json.xml(dir.dart.xml, {});
    if (!xml.result) {
        let res = await axios.get(url.dart.list({}), { responseType: 'arraybuffer' })
        if (res.status == 200) {
            res = res.data;
            try {
                const zip = new AdmZip(res);
                zip.extractAllTo(encode('_'), true);
                xml = await json.xml(dir.dart.xml, {});
            } catch (e) {
                console.log('file type error');
            }
        } else {
            return false;
        }
    }
    const meta = json.read(dir.meta).data;
    const list = xml.result.list;
    list.forEach(e => {
        if (e.stock_code) {
            if (meta[e.stock_code]) {
                data[e.stock_code] = e.corp_code;
            }
        }
    });
    json.write(dir.dart.list, { data });
    fs.unlinkSync(dir.dart.xml);
    return true;
};

/**
 2600 calls, 2m 30s
 */
Dart.induty = async ({ startTime }) => {
    const induty = json.read(dir.dart.induty, { data: {} });
    const data = induty.data;
    if (!dt.update(induty)) return data;

    const dcode = json.read(dir.dart.list)?.data;
    const codes = Object.keys(dcode);
    const len = codes.length
    const N = 100;
    var index = 1;
    for await (let i of Array(parseInt(len / N)).keys()) {
        const [start, end] = RANGE({ i, N, len });
        const promises = codes.slice(start, end)
            .map(scode =>
                new Promise(async (resolve, reject) => {
                    if (data[scode] == undefined) {
                        const r = await get('induty', { code: dcode[scode], index });
                        data[scode] = r.induty_code;
                    }
                    resolve(true);
                })
            );
        await Promise.all(promises);
        index++, index %= dartKeys.length;
        console.clear();
        console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${end}/${len} induty updated ${call} call`);
        await Sleep(N * TIME);
    }
    json.write(dir.dart.induty, { data });
}

const years = Array.from(Array(10).keys(), x => dt.toJson().Y - x).sort();
const types = { 3: '-03-31', 2: '-06-30', 4: '-09-30', 1: '-12-31' };
const nm = {
    '매출액': 'revenue',
    '영업수익': 'revenue',
    '자본총계': 'equity',
    '영업이익': 'profit',
    "법인세차감전 순이익": 'profit',
    '당기순이익': 'profit',
};

/**
 * 매출, 자본, 이익을 가져옴 
 * 
 * 연결재무제표가 아닌 별도만 가져옴
 * 만약 자본이 별도로 기록되지 않은 경우 자산에서 부채를 뺌
 */
const earnCode = async ({ r, code, key }) => {
    const d = dir.earn(code);
    const data = json.read(d).data;
    if (!dt.update(data)) return false;
    const each = {};
    if (r) {
        const res = r.filter(e => e.stock_code == code)
            .filter(e => e.sj_nm == '재무상태표' || e.sj_nm == '손익계산서');
        for await (let e of res) {
            let name = nm[e.account_nm];
            if (!name) continue;
            each[name] = Int(e.thstrm_amount);
        }
        if (!each.equity) {
            const asset = res.find(e => e.account_nm == '자산총계');
            const debt = res.find(e => e.account_nm == '부채총계');
            if (asset && debt) {
                each.equity = Int(asset.thstrm_amount) - Int(debt.thstrm_amount);
            }
        }
        each.data = Object.keys(each).length > 0;
    } else {
        each.data = false;
    }
    each.date = key;
    const i = data?.findIndex(e => e.date == key)
    if (i >= 0) data[i] = each;
    else data.push(each);
    json.write(d, { data });
    return true;
}

const earnRange = async ({ keys, start, end, index }) => {
    const dcode = json.read(dir.dart.list)?.data;
    keys = keys.slice(start, end);
    const codes = keys.map(e => dcode[e]);
    if (!codes.length) return;
    const promises = [];
    for await (let year of years) {
        for await (let type of '1423') {
            const key = `${year}${types[type]}`;
            promises.push(
                new Promise(async (resolve, reject) => {
                    const r = await get('earns', { codes, year, type, index });
                    let promises = keys.map(code =>
                        new Promise(async (resolve, reject) => {
                            let res = await earnCode({ r, code, key });
                            resolve(res);
                        }))
                    let res = await (await Promise.all(promises)).find(e => e);
                    resolve(res);
                })
            )
        }
    }
    await Promise.all(promises);
}

/**
 1040 calls, 2m 30s
 len / N * 40 calls each
 */
Dart.earns = async ({ startTime }) => {
    const dcode = json.read(dir.dart.list, { data: {} }).data;
    const keys = Object.keys(dcode).filter(code => {
        let earn = json.read(dir.earn(code));
        return dt.update(earn);
    })
    const len = keys.length;
    if (!len) return;
    const N = 100;
    var index = 1;
    for await (let i of Array(parseInt(len / N) + 1).keys()) {
        const [start, end] = RANGE({ i, N, len });
        await earnRange({ keys, start, end, index });
        index++, index %= dartKeys.length;
        console.clear();
        console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${end}/${len} earn updated ${call} call`);
    }
}

const shareCode = async ({ index, code }) => {
    const dart = json.read(dir.dart.list);
    const dcode = dart.data[code];
    let share = json.read(dir.share(code));
    if (!dt.update(share)) return false;
    const data = [];
    const dict = { index, code: dcode, year: dt.toJson().Y - 1 };
    const ant = await get('ant', dict);
    if (ant) {
        const amount = Int(ant[0].hold_stock_co);
        if (amount) {
            data.push({
                name: '소액주주',
                date: dt.toString(),
                amount,
            })
        }
    }
    const res = await get('share', dict);
    if (res) {
        for await (let e of res) {
            const name = e.repror;
            // const amount = Int(e.sp_stock_lmp_cnt);
            const amount = Int(e.stkqy);
            const date = e.rcept_dt;
            const exist = data.find(e => e.name == name);
            if (!exist) {
                data.push({ name, date, amount })
            } else if (new Date(exist?.date) < new Date(date)) {
                const i = data.indexOf(exist);
                data[i] = { name, date, amount };
            }
        }
    }
    data.sort((a, b) => b.amount - a.amount);
    json.write(dir.share(code), { data });
    return true;
}

const shareRange = async ({ keys, start, end, index }) => {
    const promises = keys.slice(start, end)
        .map(code =>
            new Promise(async (resolve, reject) => {
                let res = 0;
                res += await shareCode({ code, index });
                resolve(res != 0);
            })
        );
    let res = await Promise.all(promises);
    let cnt = res.filter(e => e).length;
    await Sleep(cnt * TIME * 3);
}

/**
 * 5200 calls, 4m20s
 * 지분공시 기준은 2022년 말 사업보고서
 */
Dart.shares = async ({ startTime }) => {
    const dcode = json.read(dir.dart.list, { data: {} }).data;
    const keys = Object.keys(dcode).filter(code => {
        let share = json.read(dir.share(code));
        return dt.update(share);
    });
    const len = keys.length;
    if (!len) return;
    const N = 100;
    var index = 1;
    for await (let i of Array(parseInt(len / N) + 1).keys()) {
        const [start, end] = RANGE({ i, N, len });
        await shareRange({ keys, start, end, index });
        index++, index %= dartKeys.length;
        console.clear();
        console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${end}/${len} share updated ${call} call`);
    }
}

// const amountCode = async ({ index, code }) => {
//     const dart = json.read(dir.dart.list);
//     const dcode = dart.data[code];
//     let amount = json.read(dir.share(code));
//     if (!dt.update(amount)) return false;
//     const data = [];
//     const dict = { index, code: dcode, year: dt.toJson().Y - 1 };
//     const ant = await get('ant', dict);
//     if (ant) {
//         const amount = Int(ant[0].hold_stock_co);
//         if (amount) {
//             data.push({
//                 name: '소액주주',
//                 date: dt.toString(),
//                 amount,
//             })
//         }
//     }
//     const res = await get('share', dict);
//     if (res) {
//         for await (let e of res) {
//             const name = e.repror;
//             const amount = Int(e.sp_stock_lmp_cnt);
//             const date = e.rcept_dt;
//             const exist = data.find(e => e.name == name);
//             if (!exist) {
//                 data.push({ name, date, amount })
//             } else if (new Date(exist?.date) < new Date(date)) {
//                 const i = data.indexOf(exist);
//                 data[i] = { name, date, amount };
//             }
//         }
//     }
//     data.sort((a, b) => b.amount - a.amount);
//     json.write(dir.share(code), { data });
//     return true;
// }

// const amountRange = async ({ keys, start, end, index }) => {
//     const promises = keys.slice(start, end)
//         .map(code =>
//             new Promise(async (resolve, reject) => {
//                 let res = 0;
//                 res += await amountCode({ code, index });
//                 resolve(res != 0);
//             })
//         );
//     let res = await Promise.all(promises);
//     let cnt = res.filter(e => e).length;
//     await sleep(cnt * TIME * 2);
// }

// /**
//  * 5200 calls, 4m20s
//  * 각 시기별 주식 발행량을 알 수 있는 함수 필요함
//  */
// Dart.amounts = async ({ startTime }) => {
//     const dcode = json.read(dir.dart.list, { data: {} }).data;
//     const keys = Object.keys(dcode).filter(code => {
//         let share = json.read(dir.share(code));
//         return dt.update(share);
//     });
//     const len = keys.length;
//     if (!len) return;
//     const N = 50;
//     var index = 1;
//     for await (let i of Array(parseInt(len / N) + 1).keys()) {
//         const [start, end] = RANGE({ i, N, len });
//         await shareRange({ keys, start, end, index });
//         index++, index %= dartKeys.length;
//         console.clear();
//         console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${end}/${len} share updated ${call} call`);
//     }
// }

export default Dart;