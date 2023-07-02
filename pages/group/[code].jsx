import styles from '@/styles/Group/Index.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import { Price } from "@/module/ba";
import GroupFold from "#/stockFold/GroupFold";
import GroupTreeMap from '#/chart/GroupTreeMap';
import ToggleTab from '#/base/ToggleTab';

const MetaTable = ({ group, meta, price, code }) => {
    meta = meta?.data;
    group = group?.data[code];
    if (!group) return;
    const equityTotal = group?.equity;
    const priceTotal = group?.price;
    const groupPrice = group?.child
        ?.map(e => { return { code: e, price: meta[e]?.a * price[e]?.c } })
        ?.sort((b, a) => a.price - b.price);
    const first = groupPrice[0];
    return <div className={styles.meta}>
        <table>
            <tbody>
                <tr><th>자산총액</th><td>{Price(10 * equityTotal)}</td></tr>
                <tr><th>시가총액</th><td>{Price(priceTotal)}</td></tr>
                <tr><th>종목 수</th><td>{group?.child?.length}</td></tr>
                <tr>
                    <th>대표주</th>
                    <td>
                        <Link href={`/stock/${first?.code}`}>
                            {meta[first?.code]?.n}
                        </Link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

const Index = ({ meta, price, group, predict }) => {
    const router = useRouter();
    const { code } = router.query;

    const props = {
        meta, code, price, group, predict, router,
    };
    const names = ['오약정보', '상세정보']
    const datas = [
        <div key={0} className={styles.area}>
            <h3>그룹사 주가 요약정보</h3>
            <GroupTreeMap {...props} />
        </div>,
        <div key={1}>
            <h3>그룹사 상세정보</h3>
        </div>
    ]
    return <>
        <div>
            <h2>{code}그룹</h2>
            <GroupFold {...props} />
            <MetaTable {...props} />
        </div>
        <hr />
        <div style={{ height: 300 }}>
            <ToggleTab names={names} datas={datas} />
        </div>
    </>
}

import container, { getServerSideProps } from "@/container";
export { getServerSideProps };
export default container(Index);