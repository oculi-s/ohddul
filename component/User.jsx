import styles from '$/User.module.scss'
import Link from 'next/link'

import bgIron from '@/public/rank/iron.png'
import bgBronze from '@/public/rank/10.png'
import bgSilver from '@/public/rank/100.png'
import bgGold from '@/public/rank/500.png'
import bgPlatinum from '@/public/rank/1000.png'
import bgDiamond from '@/public/rank/10000.png'
import bgMaster from '@/public/rank/50000.png'
import { useEffect, useRef, useState } from 'react'
import toggleOnPageChange from './toggle'
import { useRouter } from 'next/router'
import { json, user } from '@/pages/api/xhr'
import { useSession } from 'next-auth/react'
import dir from '@/module/dir'
import { Int } from '@/module/ba'

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
    let rlist = [
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
            return [e.slice(0, -1), e.slice(-1), rlist[i + 1]];
        }
    }
    return ['master1', 'master1'];
}

/**
 * 유저정보 박스, 완전히 독립적으로 실행되도록 해야함.
 * 
 * 그러려면 session에 meta를 담아 보내야 한다.
 * 2023.07.04 수정 완료
 */
export function User({ user, setAsideShow }) {
    const id = user?.id;
    const rank = user?.rank;
    const [color, num, next] = getRank(rank);
    let rankName = color[0]?.toUpperCase() + num;
    if (color == 'unranked') rankName = "IRON";
    return (
        <div className={styles.user}>
            <Link href='/profile' onClick={e => setAsideShow(false)}>
                <div className={styles.id}>{id}</div>
                <div className={styles.rank}>
                    <span className={color}>{Int(rank)}</span>
                    &nbsp;{rankName}
                </div>
            </Link>
        </div>
    )
}

export function Alarms({ uid, setAsideShow }) {
    const [len, setLen] = useState(0);
    useEffect(() => {
        async function lazyLoad() {
            const data = await json.read({ url: dir.user.alarm(uid) });
            setLen(data?.filter(e => !e.ch)?.length);
        }
        if (uid) lazyLoad();
    }, [])
    if (!uid) return;
    return <>
        <div className={styles.box}>
            <Link
                href={'/alarm'}
                className={`fa fa-bell ${styles.alarm}`}
                onClick={e => setAsideShow(false)}
            >
                {len ? <span
                    data-count={len}
                /> : ''}
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
                onClick={e => setAsideShow(false)}
            />
        </div>
    </>
}

export function AlarmSetting({ user, setAsideShow }) {
    const [settingShow, setSettingShow] = useState(false);
    const router = useRouter();
    toggleOnPageChange(router, setSettingShow);

    useEffect(() => {
        if (settingShow) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [settingShow]);
    return <div className={styles.alarmSetting}>
        <Alarms uid={user?.uid} setAsideShow={setAsideShow} />
        <Setting setAsideShow={setAsideShow} />
    </div>
}