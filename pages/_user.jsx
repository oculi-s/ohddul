import styles from '@/styles/User.module.scss'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import bgIron from '$/rank/iron.png'
import bgBronze from '$/rank/10.png'
import bgSilver from '$/rank/100.png'
import bgGold from '$/rank/500.png'
import bgPlatinum from '$/rank/1000.png'
import bgDiamond from '$/rank/10000.png'
import bgMaster from '$/rank/50000.png'

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
            return [e, rlist[i + 1]];
        }
    }
    return ['master1', 'master1'];
}

export default function Index({ userMeta }) {
    const { data: session, status } = useSession();
    if (status == 'loading' || status == 'unauthenticated') {
        return (
            <>로딩중입니다...</>
        )
    }
    const { id, uid } = session.user;
    const score = userMeta[uid]?.rank;
    const [curRank, nextRank] = getRank(score);
    let rankName = curRank[0].toUpperCase() + curRank.slice(-1);
    if (curRank == 'unranked0') rankName = "IRON";
    return (
        <div className={styles.user}>
            <Link href='/profile'>
                <div className={styles.id}>{id}</div>
                <div className={styles.rank}>
                    <span className={curRank.slice(0, -1)}>{score}</span>
                    &nbsp;{rankName}
                </div>
            </Link>
        </div>
    )
}