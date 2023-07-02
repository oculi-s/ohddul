import styles from '@/styles/Common/Aside.module.scss'
import Link from 'next/link'
import User from '#/User'
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react";
import { useState } from 'react';
import { getRank } from '#/User';
import Search from '#/common/search';

import { Per, Color, Num } from '@/module/ba';
import dt from '@/module/dt';
import { Loading } from '#/_base';

const SignIn = async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const res = await signIn("my-credential", {
        id, pw, redirect: false
    })
    console.log(res);
    return res;
}

const SignOut = async (e) => {
    e.preventDefault();
    const res = await signOut('my-credential', {
        redirect: false
    });
    console.log(res);
}

function UserInfo({ userMeta }) {
    const { status } = useSession();
    const [valid, setValid] = useState(false);
    let data;
    if (status == "authenticated") {
        data = <>
            <User userMeta={userMeta}></User>
            <form
                className={styles.logout}
                onSubmit={SignOut}
            >
                <div className={styles.submit}>
                    <button type='submit'>로그아웃</button>
                </div>
            </form>
        </>
    } else {
        data = <>
            <form
                className={styles.login}
                onSubmit={async (e) => {
                    let res = await SignIn(e);
                    if (!res.ok) setValid(true);
                }}>
                <input name='id' placeholder='ID' />
                <input name='pw' placeholder="비밀번호" type="password" />
                <div className={styles.submit}>
                    <Link href="/create">회원가입</Link>
                    <button type='submit'>로그인</button>
                </div>
            </form>
        </>
    }
    return <div className={`${styles.box} ${styles.user}`}>
        {data}
    </div>
}

const N = 8;
function PriceTable({ meta, price, sortBy, N }) {
    if (!meta || !price) return <Loading />;
    const body = Object.keys(meta)
        .filter(e => price[e]?.c && meta[e]?.a)
        .sort(sortBy)
        .slice(0, N)
        .map(code => {
            const c = price[code]?.c;
            const p = price[code]?.p;
            return <tr key={code}>
                <th>
                    <Link href={`/stock/${code}`}>
                        {meta[code]?.n}
                    </Link>
                </th>
                <td align='right'>{Num(c)}</td>
                <td className={Color(c - p)} align='center'>{Per(c, p)}</td>
            </tr>;
        });
    return <table><tbody>{body}</tbody></table>;
}

function MarketSumList({ price, meta }) {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (b, a) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c * meta[a]?.a) - (pb?.c * meta[b]?.a);
    };
    return (
        <div className={styles.box}>
            <Link href="/stock/sum">
                <span className={styles.sum}>시가총액 순위</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    );
}

function UpList({ price, meta }) {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (b, a) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c - pa?.p) * pb?.p - pa?.p * (pb?.c - pb?.p);
    };
    return (
        <div className={styles.box}>
            <Link href="/stock/up">
                <span className={styles.up}>오른종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    );
}
function DownList({ price, meta }) {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (a, b) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c - pa?.p) * pb?.p - pa?.p * (pb?.c - pb?.p);
    };
    return (
        <div className={styles.box}>
            <Link href="/stock/down">
                <span className={styles.down}>떨어진종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    );
}

function Rank({ userMeta }) {
    if (!userMeta) {
        return (<>로딩중입니다...</>);
    };
    let userList = Object.values(userMeta).sort((a, b) => b.rank - a.rank);
    let data = (userList)
        .slice(0, N)
        .map(({ id, rank }, i) => {
            let [curRank, nextRank] = getRank(rank);
            return (
                <tr key={i}>
                    <th className={curRank.slice(0, -1)}>
                        <Link href={`/profile/${id}`}>
                            {id}
                        </Link>
                    </th>
                    <td>{rank}</td>
                    <td></td>
                </tr>
            );
        });
    return (
        <div className={styles.box}>
            <span className={styles.rank}>명예의 전당</span>
            <table><tbody>{data}</tbody></table>
        </div>
    );
}

function Total() {
    return (
        <div className={styles.box}>
            <span className={styles.rank}>예측 상위</span>
        </div>
    );
}

export default function Aside({
    price, meta, group,
    userMeta,
    mobAside, setAsideShow
}) {
    const [view, setView] = useState(false);
    const props = { meta, userMeta, price, group, setAsideShow, view, setView };
    if (!meta) return;
    return (
        <>
            <aside className={`${styles.aside} ${(mobAside ? styles.show : '')}`}>
                <div className={styles.search}>
                    <Search {...props} className={styles.search} />
                </div>
                <UserInfo {...props} />
                {/* <Rank {...props} /> */}
                <MarketSumList {...props} />
                <UpList {...props} />
                <DownList {...props} />
            </aside>
            <div className={styles.shadow}
                onClick={e => { setAsideShow(false); setView(false); }}
            >
                <button className='fa fa-close'
                    onClick={e => { setAsideShow(false); setView(false); }}
                />
            </div>
        </>
    )
}
