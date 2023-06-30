import styles from '@/styles/Group/Index.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import { Price } from "@/module/ba";
import GroupFold from "#/stockFold/GroupFold";

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
    return <>
        <div>
            <h2>{code}그룹</h2>
            <GroupFold {...props} />
            <MetaTable {...props} />
        </div>
    </>
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(Index);