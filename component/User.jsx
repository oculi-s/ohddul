import styles from '$/User.module.scss'
import Link from 'next/link'

import bgIron from '@/public/rank/iron.png'
import bgBronze from '@/public/rank/10.png'
import bgSilver from '@/public/rank/100.png'
import bgGold from '@/public/rank/500.png'
import bgPlatinum from '@/public/rank/1000.png'
import bgDiamond from '@/public/rank/10000.png'
import bgMaster from '@/public/rank/50000.png'
import { useEffect, useState } from 'react'
import api from '@/pages/api'
import dir from '@/module/dir'
import { Int } from '@/module/ba'
import { Loading } from './base/base'

export const getBg = rank => {
    return rank.includes('bronze') ? (bgBronze
    ) : rank.includes('silver') ? (bgSilver
    ) : rank.includes('gold') ? (bgGold
    ) : rank.includes('platinum') ? (bgPlatinum
    ) : rank.includes('diamond') ? (bgDiamond
    ) : rank.includes('master') ? (bgMaster
    ) : bgIron;
}

export const getRank = rank => {
    const rlist = [
        'unranked0',
        'bronze4', 'bronze3', 'bronze2', 'bronze1',
        'silver4', 'silver3', 'silver2', 'silver1',
        'gold4', 'gold3', 'gold2', 'gold1',
        'platinum4', 'platinum3', 'platinum2', 'platinum1',
        'diamond4', 'diamond3', 'diamond2', 'diamond1',
        'master4', 'master3', 'master2', 'master1'
    ]
    for (let [i, e] of rlist.entries()) {
        if (rank <= 1000 + i * 100) {
            const p = i == 0 ? rlist[0] : rlist[i - 1];
            const n = rlist[i + 1];
            return [
                { color: p.slice(0, -1), num: p.slice(-1), score: 1000 + (i - 2) * 100 },
                { color: e.slice(0, -1), num: e.slice(-1), score: 1000 + (i - 1) * 100 },
                { color: n.slice(0, -1), num: n.slice(-1), score: 1000 + i * 100 },
            ]
        }
    }
    return ['master', '1', 'master', '1', 5000, 5000];
}

/**
 * 유저정보 박스, 완전히 독립적으로 실행되도록 해야함.
 */
export function User({ user, setAsideShow }) {
    const id = user?.id;
    const [meta, setMeta] = useState({ rank: 1000 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetch() {
            const uid = user?.uid;
            if (uid) {
                setMeta(await api.json.read({ url: dir.user.meta(uid) }));
            }
            setLoading(false);
        }
        fetch();
    }, [])
    const Lazy = (data) => loading ? <Loading size={14} /> : data;
    const [prev, cur, next] = getRank(meta?.rank);
    let rankName = cur.color[0]?.toUpperCase() + cur.num;
    if (cur.color == 'unranked') rankName = "IRON";
    return (
        <div className={styles.user}>
            <Link href='/profile' onClick={e => setAsideShow(false)}>
                <div className={styles.id}>{id}</div>
                <div className={styles.rank}>
                    {Lazy(<>
                        <span className={cur.color}>
                            {Int(meta?.rank)}
                        </span> {rankName}
                    </>)}
                </div>
            </Link>
        </div>
    )
}

export function Alarms({ uid, setAsideShow }) {
    const [len, setLen] = useState(0);
    useEffect(() => {
        async function lazyLoad() {
            const data = await api.json.read({ url: dir.user.alarm(uid) });
            setLen(data?.filter(e => !e.ch)?.length);
        }
        if (uid) lazyLoad();
    }, [uid])
    if (!uid) return;
    return <>
        <div className={styles.box}>
            <Link
                href={'/alarm'}
                className={`fa fa-bell ${styles.alarm}`}
                onClick={e => { if (setAsideShow) setAsideShow(false) }}
            >
                {len ? <span data-count={len} /> : ''}
            </Link>
        </div>
    </>
}

function Setting({ setAsideShow }) {
    return <>
        <div className={styles.box}>
            <Link
                className='fa fa-cog'
                href={'/setting'}
                onClick={e => { if (setAsideShow) setAsideShow(false) }}
            />
        </div>
    </>
}

export function AlarmSetting({ uid, setAsideShow }) {
    return <span className={styles.alarmSetting}>
        <Alarms uid={uid} setAsideShow={setAsideShow} />
        <Setting setAsideShow={setAsideShow} />
    </span>
}