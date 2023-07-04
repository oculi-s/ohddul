import styles from '$/User.module.scss'
import Link from 'next/link'

import bgIron from '@/public/rank/iron.png'
import bgBronze from '@/public/rank/10.png'
import bgSilver from '@/public/rank/100.png'
import bgGold from '@/public/rank/500.png'
import bgPlatinum from '@/public/rank/1000.png'
import bgDiamond from '@/public/rank/10000.png'
import bgMaster from '@/public/rank/50000.png'
import { useSession } from 'next-auth/react'

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

/**
 * 유저정보 박스, 완전히 독립적으로 실행되도록 해야함.
 * 
 * 그러려면 session에 meta를 담아 보내야 한다.
 * 2023.07.04 수정 완료
 */
export default function User() {
    const { data: session, status } = useSession();
    if (status == 'loading' || status == 'unauthenticated') {
        return (
            <>로딩중입니다...</>
        )
    }
    const user = session?.user;
    const id = user?.id;
    const score = user?.meta?.rank;
    const [curRank, nextRank] = getRank(score);
    let rankName = curRank[0]?.toUpperCase() + curRank?.slice(-1);
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