import Link from 'next/link';
import Image from 'next/image';
import groupImg from '@/public/group';
import { Num, Price } from '@/module/ba';
import Fold from '@/component/base/fold';

const GroupFold = ({
    meta, code, price, group, predict, router,
    folded
}) => {
    if (!group?.index) return <></>;
    const gname = group?.index[code] || code;
    if (!gname) return <></>;
    const imgName = gname.replace("&", "").replace("-", "");
    meta = meta?.data;
    group = group?.data[gname];
    if (!group) return <></>;
    const priceDict = Object.fromEntries(group?.child.map(e => [e, meta[e]?.amount * price[e]?.close]));
    const priceSum = Object.values(priceDict).reduce((a, b) => a + b, 0)
    const name = <>
        <Link href={`/group/${gname}`}>
            <Image src={groupImg[imgName]} alt={`${gname}로고`} />
        </Link>
        <p>{gname}그룹 자산 : ({Price(group.sum * 10)}, {group.rank}위) 시총 : ({Price(priceSum)})</p>
    </>
    const head = <>
        <tr>
            <th>이름</th>
            <th>전일종가</th>
            <th>시총</th>
            <th>예측수</th>
            <th>정답률</th>
        </tr>
    </>

    const body = group?.child
        .filter(code => meta[code])
        .sort((a, b) => (priceDict[b] || 0) - (priceDict[a] || 0))
        .map((code) => {
            let cnt = predict[code]?.queue || 0 + predict[code]?.data || 0;
            return (
                <tr key={code}>
                    <th>
                        <Link href={`/stock/${code}`}>
                            {meta[code]?.name}
                        </Link>
                    </th>
                    <td>{Num(price[code]?.close)}</td>
                    <td>{Price(priceDict[code])}</td>
                    <td>{cnt}</td>
                    <td>{(predict[code]?.right || 0 / cnt) || 0}%</td>
                </tr>
            )
        })
    const props = { name, head, body, router, folded };
    return <Fold {...props} />
}

export default GroupFold;