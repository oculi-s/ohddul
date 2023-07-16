/**
 * 이걸로 Pagination을 연습하고 게시판에 적용
 */

import styles from '$/Stock/Sum.module.scss'
import { Color, Price } from "@/module/ba";
import { stock as dir } from "@/module/dir";
import json from "@/module/json";
import GroupImg from "@/public/group/Default";
import Link from "next/link";
import '@/module/array';
import ToggleTab from '#/base/ToggleTab';
import groupColors from '@/public/group/color';
import colors from '@/module/colors';

import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { hairline } from '@/module/chart/plugins';

export async function getServerSideProps(ctx) {
    const Group = json.read(dir.light.group);
    const group = Object.values(Group.data)
        ?.filter(g => g?.ch?.length)
        ?.qsort((b, a) => a.p - b.p);
    const ratio = json.read(dir.light.ratio).data;
    const props = { group, ratio };
    return { props };
}

function GroupTable({ group }) {
    const hisSort = Array.from(group)?.qsort((b, a) => a.h - b.h);
    const body = group?.map((e, i) => {
        const { n, p, ch, h } = e;
        const j = hisSort?.findIndex(e => e.h == h);
        const d = j - i;
        return <tr key={i}>
            <th align='center' className={styles.num}>{i + 1}</th>
            <th className={styles.groupTh}>
                <Link href={`/group/${n}`}>
                    <GroupImg name={n} />
                    <span className={`${styles.gname} mh`}>&nbsp;({n})</span>
                </Link>
            </th>
            <td>{Price(p)}</td>
            <td className={styles.num}>
                {j + 1}<span>&nbsp;</span>
                {d ? <span className={Color(d)}>
                    (<span className={`fa fa-caret-${d > 0 ? 'up' : 'down'}`} />{Math.abs(d)})
                </span> : '(-)'}
            </td>
            <td>{ch?.length}개</td>
        </tr>
    })
    return <table className={`${styles.stockSum} fixed`}>
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
}


const options = {
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
            display: false,
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"
            }
        }, y: {
            max: 12,
            min: .8
        }
    }
}
const plugins = [hairline];

function GroupChart({ ratio }) {
    const N = 252 * 2;
    const labels = ratio?.삼성?.map(e => e.d)?.slice(0, N);
    const datasets = Object.keys(ratio)
        ?.map(e => [e, ratio[e]])
        ?.map(([g, e], i) => ({
            label: g,
            borderColor: groupColors[g] || colors[i],
            backgroundColor: groupColors[g] || colors[i],
            borderWidth: 1,
            pointRadius: 0,
            // fill: true,
            data: e?.map(e => e.c)?.slice(0, N)
        }))
    return <div style={{ height: 600 }}>
        <Line
            plugins={plugins}
            data={{ labels, datasets }}
            options={options}
        />
    </div>
}

export default function Group(props) {
    const names = ['순위', '변화'];
    const datas = [
        <div className={styles.wrap} key={0}>
            <GroupTable {...props} />
        </div>,
        <div className={styles.wrap} key={1}>
            <GroupChart {...props} />
        </div>
    ]

    return <>
        <div className={styles.title}>
            <h2>그룹 시가총액 순위</h2>
            <Link href={'/stock/sum'}>
                개별종목 보러가기&nbsp;
                <span className='fa fa-chevron-right'></span>
            </Link>
        </div>
        <ToggleTab names={names} datas={datas} />
    </>
}