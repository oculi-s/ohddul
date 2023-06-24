import json from '@/module/json';
import dt from '@/module/dt';
import styles from '@/styles/Help.module.scss';
import { getSession } from 'next-auth/react';
import dir from '@/module/dir';
import fs from 'fs';
import Info from './info';
import Pred from './pred';
import Board from './board';
import ToggleTab from '@/component/base/tab';

export const getServerSideProps = async (ctx) => {
    const updating = json.read('$/.update', { updating: 0 }).updating;
    if (updating) return { props: { updating } };
    const userInfo = (await getSession(ctx))?.user;
    const uid = userInfo?.uid;
    const userMeta = json.read(dir.user.meta);
    const now = dt.num();
    const price = json.read(dir.stock.all);
    const meta = json.read(dir.stock.meta);
    const YEARS = dt.YEARS();
    const earnCount = {};
    const earns = Object.keys(meta.data).map(e => json.read(dir.stock.earn(e)).data);
    const types = { 3: '-03-31', 2: '-06-30', 4: '-09-30', 1: '-12-31' };
    for await (let year of YEARS) {
        earnCount[year] = [0, 0, 0, 0];
        for await (let type of '1423') {
            const key = `${year}${types[type]}`;
            const i = dt.toJson(key).M / 3 - 1;
            earnCount[year][i] = earns
                .filter(e =>
                    e.find(c => (c.date == key) && c.data)
                ).length;
        }
    }
    const earnTotal = Object.keys(meta.data)
        .filter(code => fs.existsSync(dir.stock.earn(code))).length;
    const shareCount = Object.keys(meta.data)
        .filter(code => fs.existsSync(dir.stock.share(code))).length;
    const update = json.read('$/.update', {
        updating: 0, startTime: dt.num()
    });
    const props = {
        ...update, now, price, meta,
        uid, userMeta,
        earnCount, shareCount, earnTotal
    };
    return { props };
}

const index = ({
    meta, price, induty, index, predict,
    earnCount, shareCount, earnTotal
}) => {
    meta = meta.data;
    const props = { meta, price, induty, index, predict, earnCount, earnTotal, shareCount };
    const names = [
        '기본정보', '예측과 랭크', '커뮤니티규칙'
    ];
    const datas = [
        <div key={0}>
            <Info {...props} />
        </div>,
        <div key={1}>
            <Pred {...props} />
        </div>,
        <div key={2}>
            <Board {...props} />
        </div>
    ]
    return <div className={styles.docs}>
        예측으로 얘기하자! 오르고 떨어지고, 오떨에 오신 여러분을 환영합니다.
        <ToggleTab {...{ names, datas }} />
    </div>;
}

import container from "@/pages/container";
export default container(index);