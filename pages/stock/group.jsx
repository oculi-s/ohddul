/**
 * 이걸로 Pagination을 연습하고 게시판에 적용
 */

import styles from '$/Stock/Sum.module.scss'
import { Color, Num, Price } from "@/module/ba";
import { stock as dir } from "@/module/dir";
import json from "@/module/json";
import GroupImg from "@/public/group/Default";
import Link from "next/link";
import Help from '#/base/Help';

export async function getServerSideProps(ctx) {
    const Hist = json.read(dir.hist);
    const Group = json.read(dir.light.group).data;
    const group = Object.values(Group)
        ?.filter(e => e?.ch?.length)
        ?.sort((b, a) => a.p - b.p);
    const props = { group };
    return { props };
}

export default function Group({ group }) {
    const hisSort = Array.from(group)?.sort((b, a) => a.h - b.h);
    const body = group?.map((e, i) => {
        const { n, p, ch, h } = e;
        const j = hisSort?.findIndex(e => e.h == h);
        const d = j - i;
        return <tr key={i}>
            <th align='center'>{i + 1}</th>
            <th className={styles.groupTh}>
                <Link href={`/group/${n}`}>
                    <GroupImg name={n} />
                    <span className={styles.gname}>&nbsp;({n})</span>
                </Link>
            </th>
            <td>{Price(p)}</td>
            <td>{j + 1} {d ? <span className={Color(d)}>
                (<span className={`fa fa-caret-${d > 0 ? 'up' : 'down'}`} />{Math.abs(d)})
            </span> : '(-)'}</td>
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
                <th><span className='ph'>시총</span><span className='mh'>시가총액</span></th>
                <th>변화<Help span={<>
                    <p>1년전과 변화를 비교합니다.</p>
                </>} /></th>
                <th>자회사</th>
            </tr>
        </thead>
        <tbody>{body}</tbody>
    </table>

    return <>
        <h2>그룹사 순위</h2>
        {data}
    </>
}