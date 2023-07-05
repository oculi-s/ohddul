import Link from 'next/link';
import Image from 'next/image';
import GroupImg from '@/public/group/Default';
import { Num, Price } from '@/module/ba';
import Fold from '#/base/Fold';
import { useSession } from 'next-auth/react';
import FavStar from '#/base/FavStar';

/**
 * 데이터로 전체 group데이터를 가져올게 아니고
 * 데이터를 원하는 그룹의 데이터만 입력
 */
const GroupFold = ({
    meta, price, group, predict, router,
    folded, User, setUser
}) => {
    meta = meta?.data || meta;
    if (!group) return;
    const gname = group?.name;
    if (!gname) return;
    const priceDict = Object.fromEntries(group?.child.map(e => [e, meta[e]?.a * price[e]?.c]));
    const priceSum = Object.values(priceDict).reduce((a, b) => a + b, 0)
    const name = <>
        <Link href={`/group/${gname}`}>
            <GroupImg name={gname} />
            {/* <Image src={groupImg[imgName]} alt={`${gname}그룹 로고`} /> */}
        </Link>
        <p>{gname}그룹 자산 : ({Price(group.equity * 10)}, {group.rank}위) 시총 : ({Price(priceSum)})</p>
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
            const cnt = predict[code]?.queue || 0 + predict[code]?.data || 0;
            return (
                <tr key={code}>
                    <th className={styles.stock}>
                        <FavStar {...{ code, User, setUser }} />
                        <Link href={`/stock/${code}`}>{meta[code]?.n}</Link>
                    </th>
                    <td>{Num(price[code]?.c)}</td>
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