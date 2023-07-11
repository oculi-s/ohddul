import Market from '#/subIndex/MarketInfo';
import GroupInduty from '#/subIndex/GroupInduty'
import MajorShare from '#/subIndex/MajorShare';

import json from '@/module/json';
import dir from '@/module/dir';
import '@/module/array';

const N = 252;
const names = ['국민연금', 'JP모건'];
export async function getServerSideProps(ctx) {
    const predict = json.read(dir.stock.predAll);
    const tree = json.read(dir.stock.light.tree);
    const count = json.read(dir.stock.light.updown);

    const major = Object.fromEntries(names?.map(e =>
        [e, json.read(dir.stock.major(e), { data: [] }).data?.slice(0, 10)]
    ));
    const market = json.read(dir.stock.light.market, { kospi: [], kosdaq: [] });
    market.kospi = market?.kospi?.slice(0, N);
    market.kosdaq = market?.kosdaq?.slice(0, N);
    const props = { tree, predict, market, count, major };
    return { props };
}

function Column() {
    return <>
        - 칼럼 500자 이상<br />
        - 최신칼럼 / 인기칼럼<br />
        - 랭커들의 칼럼만 보기<br />
        - 좋아요 / 댓글 / 공유<br />
    </>;
}

function Index(props) {
    return (
        <div>
            <Market {...props} />
            <GroupInduty {...props} />
            <MajorShare {...props} />
        </div>
    );
}

export default Index;