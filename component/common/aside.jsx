import styles from '@/styles/Aside.module.scss'
import Link from 'next/link'
import User from '#/_user'
import { useSession } from "next-auth/react"
// import { Button, TextField } from '@mui/material';
import { signIn, signOut } from "next-auth/react";
import { useState } from 'react';
import { getRank } from '#/_user';
import Search from '#/common/search';

import { Per, Color, Num, Price } from '@/module/ba';
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

const Wrap = ({ children }) => {
    return (
        <div className={`${styles.box} ${styles.user}`}>
            {children}
        </div>
    )
}
const Info = ({ userMeta }) => {
    const { status } = useSession();
    const [valid, setValid] = useState(false);
    const helper = valid ? "잘못된 ID/비밀번호입니다." : "";
    if (status == "authenticated") {
        return (
            <Wrap>
                <User userMeta={userMeta}></User>
                <form onSubmit={SignOut}>
                    {/* <Button type='submit'>로그아웃</Button> */}
                </form>
            </Wrap>
        )
    }
    return (
        <Wrap>
            <form onSubmit={async (e) => {
                let res = await SignIn(e);
                if (!res.ok) setValid(true);
            }}>
                {/* <TextField
                    name='id'
                    label="ID"
                    variant="filled"
                    sx={{ p: 0 }}
                />
                <TextField
                    label="비밀번호"
                    type="password"
                    autoComplete="current-password"
                    name='pw'
                    variant="filled"
                    error={valid}
                    helperText={helper}
                    sx={{ p: 0 }}
                />
                <Button type='submit'>로그인</Button> */}
            </form>
            {/* <Button href="/create">회원가입</Button> */}
        </Wrap>
    )
}

const N = 8;
const PriceTable = ({ meta, price, sortBy, N }) => {
    if (!meta || !price) return <Loading />
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
            </tr>
        });
    return <table><tbody>{body}</tbody></table>
}

const MarketSumList = ({ price, meta }) => {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (b, a) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c * meta[a]?.a) - (pb?.c * meta[b]?.a);
    }
    return (
        <div className={styles.box}>
            <Link href="/stock/sum">
                <span className={styles.sum}>시가총액 순위</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    )
}

const UpList = ({ price, meta }) => {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (b, a) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c - pa?.p) * pb?.p - pa?.p * (pb?.c - pb?.p);
    }
    return (
        <div className={styles.box}>
            <Link href="/stock/up">
                <span className={styles.up}>오른종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    )
}
const DownList = ({ price, meta }) => {
    meta = meta?.data;
    if (!price || !meta) return <Loading />;
    const sortBy = (a, b) => {
        const pa = price[a];
        const pb = price[b];
        return (pa?.c - pa?.p) * pb?.p - pa?.p * (pb?.c - pb?.p);
    }
    return (
        <div className={styles.box}>
            <Link href="/stock/down">
                <span className={styles.down}>떨어진종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <PriceTable {...{ price, meta, N, sortBy }} />
            <p className='des'>기준일 : {dt.parse(price?.last)}</p>
        </div>
    )
}
const Rank = ({ userMeta }) => {
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
                    <td>{ }</td>
                </tr>
            )
        });
    return (
        <div className={styles.box}>
            <span className={styles.rank}>명예의 전당</span>
            <table><tbody>{data}</tbody></table>
        </div>
    )
}

const Total = () => {
    return (
        <div className={styles.box}>
            <span className={styles.rank}>예측 상위</span>
        </div>
    )
}

export default function Index({
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
                <Info {...props} />
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
