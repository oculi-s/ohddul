import Link from 'next/link';
import { Price, Big } from '@/module/ba';
import Fold from '#/base/Fold';
import json from '@/module/json';
import '@/module/array'


/**
 * json to table과 재귀함수 이용해서 만들었다가
 * 데이터 구조 바꾸고, 재귀함수 시간 문제 때문에 폐기하고
 * 
 * 2023.07.03 원점에서 다시 제작
 */
const IndutyFold = ({
    meta, code, price, induty, index, router,
    folded = true
}) => {
    induty = induty?.data;
    index = index?.data;
    meta = meta?.data;
    if (!induty) return <></>;
    const stockInduty = Big(induty[code] || code);
    const data = index[stockInduty];
    if (!data) return <></>;
    const dict = {};
    const stock = Object.keys(induty).filter(e => induty[e] == induty[code]);
    const total = stock.map(e => meta[e]?.a * price[e]?.c || 0).sum();
    const name = <>
        <h3 style={{ margin: "10px auto" }}><Link href={`/induty/${code}`}>{data?.n}</Link></h3>
        <p>{data?.c} 종목 시총 : ({Price(total)})</p>
    </>
    const body = json.toTable(dict);
    const props = { router, name, body, folded };
    return <Fold {...props} />
}

export default IndutyFold;