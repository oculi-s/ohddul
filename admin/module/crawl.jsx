process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import json from '@/module/json';
import dt from '@/module/dt';
import axios from 'axios';
import { stock as dir } from '@/module/dir';
import { Int, Big } from '@/module/ba';

const enc = encodeURIComponent;
export const dartKeys = ['ddc46e8d5875b4509384917299a12b04dac84f2e'] // oculis gmail
dartKeys.push('ba27edfaf6468373b8e954ac888ee0e3c151cba1') // oculis naver
dartKeys.push('454e2adc2467385a2be79c9cc9e9d6572c37044f') // kjunhun9 gmail
dartKeys.push('ede76544593162fae7d94efc73a9d1893ed2890f') // kjunhun9 naver
// dartKeys.push('') // kjunhun9 nate
// dartKeys.push('') // kjunhun9 daum
// dartKeys.push('') // kjunhun9 sogang
// dartKeys.push('') // oculis yonsei
// dartKeys.push('') // kjunhun9 o365.sogang
// dartKeys.push('') // oculis o365.yonsei
export const dataKeys = [enc('sADCAp5KTAsBnP0AZ/ahAnoz8/tQh6ihzNLJYUANgPx4YBREDRZWCMSRRDtKoZL7XWgJvsqh2wacWtWGw/johw==')];
const dataQuery = `ServiceKey=${dataKeys[0]}&numOfRows=200000&pageNo=1&resultType=json`;
const dataPath = (code = 1160100) => `https://apis.data.go.kr/${code}`;

const N = 10000;
export const url = {
    holi: (y, m) => `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${dataKeys[0]}&solYear=${y}&solMonth=${m}`,
    meta: date => `${dataPath()}/service/GetKrxListedInfoService/getItemInfo?${dataQuery}&basDt=${date}`,
    amount: date => `${dataPath()}/service/GetStocIssuInfoService/getItemBasiInfo?${dataQuery}&basDt=${date}`,
    kospi: `${dataPath()}/service/GetMarketIndexInfoService/getStockMarketIndex?${dataQuery}&idxNm=코스피`,
    kosdaq: `${dataPath()}/service/GetMarketIndexInfoService/getStockMarketIndex?${dataQuery}&idxNm=코스닥`,
    group: `${dataPath(1130000)}/affiliationCompSttusList/affiliationCompSttusListApi?${dataQuery}&presentnYear=${dt.toJson().Y}`,
    rank: `${dataPath(1130000)}/appnGroupAssetsList/appnGroupAssetsListApi?${dataQuery}&presentnYear=${dt.toJson().Y}`,
    price: (code, from = '19800101') => `${dataPath()}/service/GetStockSecuritiesInfoService/getStockPriceInfo?${url.query}&likeSrtnCd=${code}&beginBasDt=${from}`,
    induty: `https://api.odcloud.kr/api/15049591/v1/uddi:5e38a64c-9482-4cda-8169-860015fa3406?serviceKey=${dataKeys[0]}&perPage=${N}`,
    // earn: ({ page, year }) => `${dataPath()}/service/GetFinaStatInfoService_V2/getSummFinaStat_V2?ServiceKey=${dataKeys[0]}&numOfRows=${N}&pageNo=${page}&resultType=json&bizYear=${year}`,
    dart: {
        list: ({ index = 0 }) => `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${dartKeys[index]}`,
        induty: ({ index = 0, code }) => `https://opendart.fss.or.kr/api/company.json?crtfc_key=${dartKeys[index]}&corp_code=${code}`,
        earn: ({ index = 0, code, year, type }) => `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?crtfc_key=${dartKeys[index]}&corp_code=${code}&bsns_year=${year}&reprt_code=1101${type}`,
        earns: ({ index = 0, codes = [], year, type }) => `https://opendart.fss.or.kr/api/fnlttMultiAcnt.json?crtfc_key=${dartKeys[index]}&corp_code=${codes.join(',')}&bsns_year=${year}&reprt_code=1101${type}`,
        share: ({ index = 0, code, year = '2021' }) => `https://opendart.fss.or.kr/api/majorstock.json?crtfc_key=${dartKeys[index]}&corp_code=${code}&bsns_year=${year}`,
        ant: ({ index = 0, code, year = '2021' }) => `https://opendart.fss.or.kr/api/mrhlSttus.json?crtfc_key=${dartKeys[index]}&corp_code=${code}&bsns_year=${year}&reprt_code=11011`
    }
}

async function get(url) {
    const r = await axios.get(url)
    if (r.status != 200) return false;
    return r.data?.response?.body?.items?.item || r.data;
}

async function xml(url) {
    const r = await axios.get(url);
    if (r.status != 200) return false;
    return r.data?.affiliationCompSttus || r.data?.appnGroupAssets;
}

/**
 * 특정일자에 데이터를 읽어지는지 여부를 확인하는 함수
 * 
 * 아래의 이유로 2023.06.19 폐기
 */
async function check(now) {
    const count = async url => {
        const res = await axios.get(url);
        return res?.data?.response?.body?.totalCount || 0;
    }
    let value = 1;
    value *= await count(url.meta(now) + '&crno=1301110006246');
    value *= await count(url.amount(now) + '&crno=1301110006246');
    // value *= await count(url.price('005930', now));
    return value;
}

let basDt;
const Crawl = {};
/**
 * 데이터가 유효한 일자를 받아오기
 * 
 * meta를 읽는 과정에서 문제 생겨서 0619 폐기 후 0621 복원
 */
Crawl.date = async () => {
    const date = json.read(dir.date, { last: 0, value: "" });
    const { value } = date;
    basDt = value;
    if (!dt.update(date)) return false;
    // const price = json.read(dir.price('005930'), { data: [] }).data;
    // let [cur, prev] = price.sort(dt.sort).slice(0, 2);
    // cur = cur.date.replace(/-/g, '');
    // prev = prev.date.replace(/-/g, '');
    // basDt = cur
    // json.write(dir.date, { value: cur, prev });
    // return true;
    const y = dt.toJson();
    const r = await get(url.holi(y.Y, y.M));
    if (r?.totalCount) {
        if (r?.totalCount == 1)
            holi = [holi?.locdt?.toString()];
        else
            holi = holi?.map(e => e.locdate);
        while (holi?.includes(y.s) || y.day <= 1) { dt.prev(y); }
    }
    while (!(await check(y.s))) { dt.prev(y); }
    basDt = y.s;
    dt.prev(y);
    while (!(await check(y.s))) { dt.prev(y); }
    json.write(dir.date, { value: basDt, prev: y.s });
    return true;
}

Crawl.meta = async () => {
    const meta = json.read(dir.meta, { last: 0, data: {}, index: {} });
    if (!dt.update(meta)) return false;

    const { data, index } = meta;
    let crno = {};
    let res = await get(url.meta(basDt));
    if (res) {
        for await (let e of res) {
            const c = e.srtnCd.replace(/A/g, '');
            const n = e.itmsNm;
            if (e.mrktCtg == 'KONEX') continue;
            const type = e.mrktCtg == 'KOSPI' ? 'K' : 'Q';
            crno[e.crno] = c;
            data[c] = {
                name: n,
                // code: e.crno,
                isin: e.isinCd,
                type
            };
            index[n] = c;
        };
    }
    res = await get(url.amount(basDt));
    if (res) {
        res = await res.filter(e => e.scrsItmsKcdNm == '보통주')
        for await (let e of res) {
            let c = crno[e.crno];
            if (c != undefined) {
                data[c].amount = Int(e.issuStckCnt);
            } else {
                let s = e.isinCd;
                c = Object.keys(data).find(e => data[e].isin == s);
                if (c) data[c].amount = Int(e.issuStckCnt);
            }
            if (c != undefined) {
                delete data[c].isin;
            }
        }
    }
    json.write(dir.crno, { data: crno });
    json.write(dir.meta, { data, index });
    return true;
}

const gname = {
    "에스케이": "SK",
    "엘지": "LG",
    "엘엑스": "LX",
    "지에스": "GS",
    "케이티": "KT",
    "씨제이": "CJ",
    "엘에스": "LS",
    "디엘": "DL",
    "에쓰-오일": "S-Oil",
    "에이치디씨": "HDC",
    "에스엠": "SM",
    "케이티앤지": "KT&G",
    "케이씨씨": "KCC",
    "오씨아이": "OCI",
    "에이치엠엠": "HMM",
    "포스코": "POSCO",
    "반도홀딩스": "반도",
    "현대자동차": "현대차",
    "고려에이치씨": "고려HC",
    "오케이금융그룹": "OK금융그룹",
    "아이에스지주": "IS",
    "엠디엠": "MDM"
}

Crawl.group = async () => {
    const crno = json.read(dir.crno).data;
    const meta = json.read(dir.meta).data;
    const group = json.read(dir.group, { last: 0, data: {}, index: {} });
    const { data, index } = group;
    if (!dt.update(group)) return false;

    let res = await xml(url.rank);
    if (res) {
        for await (let e of res) {
            let g = gname[e.unityGrupNm] || e.unityGrupNm;
            let sum = e.assetsTotamt.replace(/,/g, '');
            data[g] = {
                name: g, sum: parseInt(sum), rank: e.rn,
                child: []
            };
        }
    }

    res = await xml(url.group);
    if (res) {
        res = res.filter(e => e.psitnCmpnyChangeSeCode != '0002');
        res = res.filter(e => Object.keys(crno).includes(e.jurirno));
        for await (let e of res) {
            let g = gname[e.unityGrupNm] || e.unityGrupNm;
            let c = e.jurirno;
            if (data[g] == undefined) data[g] = { child: [] };
            data[g].child.push(crno[c]);
            index[crno[c]] = g;
        };
    }
    json.write(dir.group, { data, index });
    return true;
}

const rec = ({ tree, code, name, key }) => {
    if (key.length == 0) {
        tree._ = code;
    } else {
        if (!tree[key[0]]) tree[key[0]] = {};
        tree = tree[key[0]], key = key.slice(1);
        rec({ tree, code, name, key });
    }
}

Crawl.induty = async () => {
    const induty = json.read(dir.induty);
    if (!dt.update(induty)) return false;
    const res = await get(url.induty);
    const data = {}, index = {};
    res.data.sort((a, b) => a['순번'] - b['순번']);

    for await (let e of res.data) {
        const i = e['순번'];
        let code = e['산업분류코드'];
        let name = e['산업분류명칭'];
        if (isNaN(parseInt(code))) { // 대분류
            rec({ tree: data, code, name, key: code });
            index[code] = name;
            continue;
        }
        if (i <= 98) code = '0' + code; // 08로 시작하는 끝
        code = Big(code);
        index[code] = name;
        if (!data[code[0]]) data[code[0]] = {};
        let tree = data[code[0]];
        let first = code.slice(1, 3);
        if (!tree[first]) tree[first] = {};
        tree = tree[first];
        let key = code.slice(3);
        rec({ tree, code, name, key });
    }
    json.write(dir.induty, { data, index });
    return true;
}


// var cnt;
// const earnYear = async ({ startTime, year, page = 1 }) => {
//     const crno = json.read(dir.crno).data;
//     const res = await get(url.earn({ year, page }));
//     for await (let e of res?.items?.item) {
//         const code = crno[e.crno];
//         if (code) {
//             const data = json.read(dir.earn(code)).data;
//             const each = {
//                 date: dt.parse(e.basDt),
//                 equity: Int(e.enpTcptAmt),
//                 revenue: Int(e.enpSaleAmt),
//                 profit: Int(e.enpCrtmNpf)
//             }
//             const i = await data.findIndex(e => e.date == each.date);
//             if (i >= 0) data[i] = each;
//             else data.push(each);
//             json.write(dir.earn(code), { data });
//             cnt++;
//         }
//     }
//     const total = res.totalCount;
//     if ((page * N) < total) {
//         console.clear();
//         console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${page}/${Int((total + N) / N)} ${year} earn updated`);
//         await earnYear({ startTime, year, page: page + 1 });
//     }
// }

/**
 * Data.go.kr에서 실적 받아오기
 * 
 * 문제는 4분기 데이터밖에 안주고, dart에서도 정확한 데이터 받아올 수 있음
 * 2023.06.20 폐기
 */
// Crawl.earn = async ({ startTime }) => {
//     const years = Array.from(Array(10).keys(), x => dt.toJson().Y - x).sort();
//     for await (let year of years) {
//         cnt = 0;
//         await earnYear({ startTime, year });
//         console.clear();
//         console.log(`${dt.hhmmss(dt.now() - startTime, { time: 1 })} ${year} earn of ${cnt} updated`);
//     }
// }

/**
 * Data.go.kr에서 가격 받아오기
 * 
 * 빠르고 좋은데 얖에서 가져오면 장점이 많고 데이터를 100개씩 가져올 수 있음
 * 2023.06.19 폐기, 얖의 block이 있는 
 */
Crawl.price = async ({ code, from }) => {
    let MIN_LENGTH = 20;
    let price = json.read(dir.price(code), { data: [], last: 0 });
    let { data } = price;
    if (!dt.update(price)) return false;
    let res = await getJSON(url.price(code, from));
    if (res) {
        res = res.filter(e => !data.some(d => d.date === e.basDt)).reverse();
        for await (let e of res) {
            let date = e.basDt,
                temp = {
                    date: `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6)}`,
                    close: parseInt(e.clpr),
                    high: parseInt(e.hipr),
                    low: parseInt(e.lopr),
                    open: parseInt(e.mkp),
                    volume: parseInt(e.trqu)
                };
            data.push(temp);
        }
        if (res.length + data.length > MIN_LENGTH) {
            json.write(dir.price(code), { data });
        } else {
            return data;
        }
    }
    return true;
}

/**
 * 마찬가지로 kospi, kosdaq데이터 가져오는 코드
 * 
 * 2023.06.19 폐기
 */
// Crawl.market = async () => {
// }


export default Crawl;