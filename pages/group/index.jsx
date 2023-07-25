/**
 * 이걸로 Pagination을 연습하고 게시판에 적용
 */

import styles from '$/Stock/Sum.module.scss'
import { Color, H2R, Price } from "@/module/ba";
import { stock as dir } from "@/module/dir";
import json from "@/module/json";
import dt from '@/module/dt';
import GroupImg from "@/public/group/Default";
import Link from "next/link";
import '@/module/array';
import { ToggleQuery } from '#/base/ToggleTab';
import colors from '@/module/colors';

import "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { hairline } from '@/module/chart/plugins';
import { RadioSelect } from '#/base/InputSelector';
import { useEffect, useRef, useState } from 'react';
import deepmerge from 'deepmerge';
import api from '../api';
import { Loading } from '#/base/base';
import { GroupBg } from '@/public/group/color';
import { Pagination } from '#/base/Pagination';

export async function getServerSideProps(ctx) {
    const tab = ctx.query?.tab || 'rank';

    let props = { tab };
    if (tab == 'rank') {
        const Group = json.read(dir.light.group);
        const p = parseInt(ctx?.query?.p || 1);
        const N = parseInt(ctx?.query?.N || 15);
        const T = Object.keys(Group.data)?.length || 0;
        const group = Object.values(Group.data)
            ?.filter(g => g?.ch?.length)
            ?.qsort((b, a) => a.p - b.p)
            ?.slice((p - 1) * N, p * N);
        props = { ...props, group, p, N, T };
    }
    return { props };
}

function GroupTable({ p, N, T, group }) {
    const hisSort = Array.from(group)?.qsort((b, a) => a.h - b.h);
    const body = group?.map((e, i) => {
        const { n, p: pr, ch, h } = e;
        const j = hisSort?.findIndex(e => e.h == h);
        const d = j - i;
        return <tr key={i}>
            <th align='center' className={styles.num}>{(p - 1) * N + i + 1}</th>
            <th className={styles.groupTh}>
                <Link href={`/group/${n}`}>
                    <GroupImg name={n} />
                    <span className={`${styles.gname} mh`}>&nbsp;({n})</span>
                </Link>
            </th>
            <td>{Price(pr)}</td>
            <td className={styles.num}>
                {j + 1}<span>&nbsp;</span>
                {d ? <span className={Color(d)}>
                    (<span className={`fa fa-caret-${d > 0 ? 'up' : 'down'}`} />{Math.abs(d)})
                </span> : '(-)'}
            </td>
            <td>{ch?.length}개</td>
        </tr>
    })

    const data = <table className={`${styles.stockSum} fixed`}>
        <colgroup>
            <col width={'10%'} />
            <col width={'30%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'20%'} />
        </colgroup>
        <thead>
            <tr>
                <th>#</th>
                <th>이름</th>
                <th>
                    <span className='ph'>시총</span><span className='mh'>시가총액</span>
                </th>
                <th>1년전</th>
                <th>자회사</th>
            </tr>
        </thead>
        <tbody>{body}</tbody>
    </table>
    return <Pagination {...{ p, N, T, data }} />
}

const defaultOptions = {
    plugins: {
        legend: { display: false },
        tooltip: {
            itemSort: function (a, b) {
                return b.raw - a.raw;
            }
        }
    },
    animation: {
        x: { duration: 0 },
        duration: 100
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"
            },
            ticks: {
                maxTicksLimit: 3,
                callback: function (value) {
                    return dt.parse(value);
                }
            }
        }, y: {
            max: 12,
        }
    }
}
const plugins = [hairline];

function GroupChart() {
    const ref = useRef();
    const [len, setLen] = useState(dt.YEAR * 5);
    const from = dt.num() - len;
    const [data, setData] = useState();
    const [options, setOptions] = useState(defaultOptions);
    const [isLoad, setLoad] = useState(true);
    useEffect(() => {
        async function fetch() {
            console.time('ratio');
            if (data?.labels?.length) return;
            const ratio = (await api.json.read({ url: dir.light.ratio })).data;
            const labels = ratio?.삼성?.map(e => e.d);
            const datasets = Object.keys(ratio)
                ?.sort((a, b) => ratio[a].slice(-1)[0].c - ratio[b].slice(-1)[0].c)
                ?.map(e => [e, ratio[e]])
                ?.map(([g, e], i) => ({
                    label: g,
                    borderColor: GroupBg[g] || colors[i],
                    backgroundColor: H2R(GroupBg[g] || colors[i], .5 - i * .05),
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: true,
                    data: e?.map(e => e.c)
                }))
            setData({ labels, datasets });
            setLoad(false);
            console.timeEnd('ratio');
        }
        fetch();
    }, [])
    useEffect(() => {
        const option = { scales: { x: { min: from } } };
        setOptions(deepmerge(options, option));
    }, [len])
    return <div>
        <div className={styles.buttonGroup}>
            <RadioSelect
                title={'기간'}
                onChange={setLen}
                names={['3M', '6M', '1Y', '2Y', '3Y', '4Y', '5Y']}
                values={[dt.YEAR / 4, dt.YEAR / 2, dt.YEAR, dt.YEAR * 2, dt.YEAR * 3, dt.YEAR * 4, dt.YEAR * 5]}
                defaultValue={len}
            />
        </div>
        <div className={styles.chart}>
            {isLoad
                ? <Loading left={"auto"} right={"auto"} />
                : <Line
                    ref={ref}
                    plugins={plugins}
                    data={data}
                    options={options}
                />
            }
        </div>
    </div>
}

export default function Group({ tab, group, p, N, T }) {
    const query = ['rank', 'change'];
    const names = ['순위', '변화'];

    return <>
        <div className={styles.title}>
            <h2>그룹 시가총액 순위</h2>
            <Link href={'/stock/sum'}>
                개별종목 보러가기&nbsp;
                <span className='fa fa-chevron-right'></span>
            </Link>
        </div>
        <ToggleQuery names={names} query={query} />
        {tab == 'rank' ? <div className={styles.wrap}>
            <GroupTable group={group} p={p} N={N} T={T} />
        </div> : <div className={styles.wrap}>
            <GroupChart />
        </div>}
    </>
}