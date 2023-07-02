import Market from '#/subIndex/MarketInfo';
import Group from '#/subIndex/GroupTree'
import Induty from '#/subIndex/IndutyTree';

import container from "@/container";
import json from '@/module/json';
import dir from '@/module/dir';

const N = 252;
export const getServerSideProps = () => {
    const meta = json.read(dir.stock.meta, { data: {}, index: {} });
    const group = json.read(dir.stock.group);
    const price = json.read(dir.stock.all);
    const predict = json.read(dir.stock.predAll);
    const userMeta = json.read(dir.user.meta);
    const index = json.read(dir.stock.induty);
    const induty = json.read(dir.stock.dart.induty);

    const market = json.read(dir.stock.marketClose, { kospi: [], kosdaq: [] });
    market.kospi = market?.kospi?.slice(0, N);
    market.kosdaq = market?.kosdaq?.slice(0, N);
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

const index = function ({
    group, induty, index, market, price, meta
}) {
    const props = { group, meta, induty, market, index, price };
    return (
        <div>
            <Market {...props} />
            <Group {...props} />
            <Induty {...props} />
        </div>
    )
}

export default container(index);