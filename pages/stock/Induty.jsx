import Link from 'next/link';
import { Price, Big } from '@/module/ba';
import Fold from '@/component/base/fold';
import json from '@/module/json';
import '@/module/array'

const setStock = ({ induty, code, meta, price, dict, stockDict }) => {
    const stock = Object.entries(induty)
        .filter(([e, v]) => v == code)
        .filter(([e, v]) =>
            meta[e]?.a && price[e]?.c)
        .sort(([a, _1], [b, _2]) =>
            meta[b]?.a * price[b]?.c -
            meta[a]?.a * price[a]?.c
        )
    stock.forEach(([e, v]) => {
        const name = meta[e]?.n;
        const amount = meta[e]?.a;
        const close = price[e]?.c;
        const stockKey = `<a href=/stock/${e}>${name}</a>`
        dict[stockKey] = `<td>${Price(amount * close) || "-"}</td>`;
        stockDict[e] = 1;
    });
}

const setIndex = ({
    data, dict, key, origin, index, induty,
    i, meta, price, stockDict, go = true
}) => {
    if (!data) return;
    if (!data._) return;
    const next = i ? key.slice(1) : key.slice(2);
    key = i ? key.slice(0, 1) : key.slice(0, 2);
    const name = index?.index[data?._];
    const code = data?._?.slice(1);
    const newKey = code ? `<a href=/induty/${code}>${name}</a>` : name;
    const validKeys = Object.keys(data).filter(e => e != '_');
    dict[newKey] = { isth: true, cs: 2 };
    const nextProps = {
        i: i + 1, meta, price, origin,
        key: next, index, induty,
        data: data[key],
        dict: dict[newKey],
        stockDict,
        code
    }
    if (key.length) { // key가 남아있으면 그 key에 대해서만 진행
        setIndex(nextProps)
    } else if (validKeys.length && go) { // code를 prefix로 하는 하위 induty
        validKeys.forEach(key => {
            nextProps.data = data[key];
            nextProps.go = false;
            setIndex(nextProps);
        })
    }
    if (code == origin) {
        setStock(nextProps);
    }
}

const IndutyFold = ({
    meta, code, price, induty, index, router,
    folded = true
}) => {
    induty = induty?.data;
    meta = meta?.data;
    if (!induty) return <></>;
    const stockInduty = Big(induty[code] || code);
    const iname = index?.index[stockInduty];
    if (!iname) return <></>;
    const data = index?.data[stockInduty[0]];
    if (!data) return <></>;
    const dict = {};
    const stockDict = {};
    setIndex({
        data, dict, key: stockInduty.slice(1),
        origin: stockInduty.slice(1),
        i: 0, index, induty, meta, price, stockDict
    });
    const stock = Object.keys(stockDict)
        .filter(e => meta[e] && price[e]);
    const total = stock.map(e => meta[e].a * price[e].c || 0).sum();
    const name = <>
        <h3 style={{ margin: "10px auto" }}><Link href={`/induty/${induty[code]}`}>{iname}</Link></h3>
        <p>{stock.length} 종목 시총 : ({Price(total)})</p>
    </>
    const body = json.toTable(dict);
    const props = { router, name, body, folded };
    return <Fold {...props} />
}

export default IndutyFold;