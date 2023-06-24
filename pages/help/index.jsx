import json from '@/module/json';
import dt from '@/module/dt';
import styles from '@/styles/Help.module.scss';
import { getSession } from 'next-auth/react';
import dir from '@/module/dir';
import Info from './info';
import Pred from './pred';
import Board from './board';
import ToggleTab from '@/component/base/tab';

export const getServerSideProps = async (ctx) => {
    const userInfo = (await getSession(ctx))?.user;
    const uid = userInfo?.uid || false;
    const userMeta = json.read(dir.user.meta);
    const now = dt.num();
    const price = json.read(dir.stock.all, {});
    const meta = json.read(dir.stock.meta);
    const earnCount = {};
    const earnDatas = Object.fromEntries(Object.keys(meta.data)
        .map(code => [code, json.read(dir.stock.earn(code), { data: [] })]));
    const shareDatas = Object.fromEntries(Object.keys(meta.data)
        .map(code => [code, json.read(dir.stock.share(code), { data: [] })]));
    const types = { 3: '-03-31', 2: '-06-30', 4: '-09-30', 1: '-12-31' };
    for await (let year of dt.YEARS()) {
        earnCount[year] = [0, 0, 0, 0];
        for await (let type of '1423') {
            const key = `${year}${types[type]}`;
            const i = dt.toJson(key).M / 3 - 1;
            earnCount[year][i] = Object.values(earnDatas)
                .filter(e => e.data?.length)
                .filter(e =>
                    e.data?.find(c => (c.date == key) && c.data)
                ).length;
        }
    }
    const earnNull = Object.entries(earnDatas)
        .filter(([k, v]) => !v.data?.length)
        .map(e => e[0]);
    const shareNull = Object.entries(shareDatas)
        .filter(([k, v]) => !v.data?.length)
        .map(e => e[0]);
    const props = {
        now, price, meta,
        uid, userMeta,
        earnCount, shareNull, earnNull
    };
    return { props };
}

const index = (props) => {
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