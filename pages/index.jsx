import Market from '#/subIndex/MarketInfo';
import GroupInduty from '#/subIndex/GroupInduty'

import json from '@/module/json';
import dir from '@/module/dir';
import Container from '@/container/light';

/**
 * 2023.07.04 데이터 380kb, treemap을 만드는 시간이 오래걸리므로 squrify된 데이터를 미리 저장할 것
 */
const N = 252;
export const getServerSideProps = () => {
    const aside = json.read(dir.stock.light.aside);
    const meta = json.read(dir.stock.meta);
    const group = json.read(dir.stock.group);
    const price = json.read(dir.stock.all);
    const predict = json.read(dir.stock.predAll);
    const index = json.read(dir.stock.induty);
    const induty = json.read(dir.stock.dart.induty);

    const market = json.read(dir.stock.light.market, { kospi: [], kosdaq: [] });
    market.kospi = market?.kospi?.slice(0, N);
    market.kosdaq = market?.kosdaq?.slice(0, N);
    const props = {
        aside, price, meta, group, index, induty,
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

const index = function (props) {
    return (
        <div>
            <Market {...props} />
            <GroupInduty {...props} />
        </div>
    )
}

export default Container(index);