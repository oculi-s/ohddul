import styles from '$/Common/Aside.module.scss'
import Link from 'next/link'
import User from '#/User'
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { getRank } from '#/User';
import Search from '#/common/search';

import { Per, Color, Num, Int } from '@/module/ba';
import { SignError } from '#/base/base';

const SignIn = async (e, setUser, setError, setOn) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const res = await signIn("ohddul", {
        id, pw, redirect: false
    })
    if (res.ok) {
        const user = (await getSession()).user;
        const pred = user?.pred || [];
        const favs = user?.favs || [];
        setUser({ pred, favs });
        setError(0);
    } else {
        setError(Int(res.error));
        setOn(1);
        setTimeout(() => {
            setOn(0);
        }, 1000);
    }
    return res;
}

const SignOut = async (e, setUser) => {
    e.preventDefault();
    await signOut({ redirect: false });
    setUser({ pred: [], favs: [] });
}

function UserInfo({ setUser }) {
    const { status } = useSession();
    const [on, setOn] = useState(0);
    const [error, setError] = useState(0);
    let data;
    if (status == "authenticated") {
        data = <>
            <User />
            <form
                className={styles.logout}
                onSubmit={e => { SignOut(e, setUser) }}
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
                    await SignIn(e, setUser, setError, setOn);
                }}>
                <input name='id' placeholder='ID' />
                <input name='pw' placeholder="비밀번호" type="password" />
                <SignError code={error} on={on} />
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
function AsideTable({ data }) {
    const body = data?.map(e => {
        const { code, n, c, p } = e;
        return <tr key={code}>
            <th>
                <Link href={`/stock/${code}`}>{n}</Link>
            </th>
            <td align='right'>{Num(c)}</td>
            <td className={Color(c - p)} align='center'>{Per(c, p)}</td>
        </tr>
    })
    return <table><tbody>{body}</tbody></table>;
}

function StockList({ aside }) {
    return <>
        <div className={styles.box}>
            <Link href="/stock/sum">
                <span className={styles.sum}>시가총액 순위</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.sum} />
        </div>
        <div className={styles.box}>
            <Link href="/stock/up">
                <span className={styles.up}>오른종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.up} />
        </div>
        <div className={styles.box}>
            <Link href="/stock/down">
                <span className={styles.down}>떨어진종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.down} />
        </div>
    </>
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
    price, meta, group, aside,
    userMeta, setUser,
    mobAside, setAsideShow
}) {
    const [view, setView] = useState(false);
    useEffect(() => {
        if (mobAside) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobAside]);
    const props = {
        setUser, aside,
        meta, userMeta,
        price, group,
        setAsideShow, view, setView
    };
    return (
        <>
            <aside className={`${styles.aside} ${(mobAside ? styles.show : '')}`}>
                <div className={styles.search}>
                    <Search {...props} className={styles.search} />
                </div>
                <UserInfo {...props} />
                <StockList {...props} />
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
