import styles from '@/styles/Index.module.scss';
import Kospi from './subindex/Kospi';
import Group from './subindex/Group';

import GroupBubble from './subindex/GroupBubble';
import container from "@/pages/container";

import json from '@/module/json';
import dir from '@/module/dir';

const N = 252 * 5;
export const getServerSideProps = () => {
    const meta = json.read(dir.stock.meta, { data: {}, index: {} });
    const group = json.read(dir.stock.group);
    const price = json.read(dir.stock.all);
    const predict = json.read(dir.stock.predAll);
    const userMeta = json.read(dir.user.meta);
    const index = json.read(dir.stock.induty);
    const induty = json.read(dir.stock.dart.induty);

    const market = json.read(dir.stock.market, { kospi: [], kosdaq: [] });
    market.kospi = market.kospi?.slice(0, N);
    market.kosdaq = market.kosdaq?.slice(0, N);
    const props = {
        userMeta,
        price, meta, group, index, induty,
        predict, market
    };
    return { props };
}

const Column = () => {
    return <>
        - 칼럼 500자 이상<br />
        - 최신칼럼 / 인기칼럼<br />
        - 랭커들의 칼럼만 보기<br />
        - 좋아요 / 댓글 / 공유<br />
    </>
}

const GroupInduty = ({ group, price, meta, induty, index }) => {
    meta = meta?.data;
    Object.keys(group)
        .filter(name => group[name].child?.length)
        .map(name => {
            const data = group[name].child;
            return data.map(code => {

            })
        })
    return <div className={styles.area}>
        <h3>그룹/업종</h3>
        <div className={styles.inline}>
            <div>
                <table><tbody>

                </tbody></table>
            </div>
            <div>
                <table><tbody>
                </tbody></table>
            </div>
        </div>
    </div>;
}

const index = function ({
    group, induty, index, market, price, meta
}) {
    const props = { group, meta, induty, market, index, price };
    return (
        <div>
            <Kospi {...props} />
            {/* <Column /> */}
            <Group {...props} />
            {/* <GroupBubble {...props} /> */}
            <GroupInduty {...props} />
        </div>
    )
}

export default container(index);