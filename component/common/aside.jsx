import styles from '$/Common/Aside.module.scss'
import Link from 'next/link'
import User from '#/User'
import { getSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from 'react';
import { getRank } from '#/User';
import Search from '#/common/search';

import { Per, Color, Num, Int } from '@/module/ba';
import { SignError } from '#/base/base';

/**
 * 2023.07.06 useSession을 predbar에서 사용하면서
 * 
 * login, out에서는 redirect=true를 사용하는 것으로 변경
 * aside에 띄울 세션 정보는 serverside에서 getSession을 통해 받아오는 것으로 결정
 */
const SignIn = async (e, setUser, setError, setOn) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const res = await signIn("ohddul", {
        id, pw, redirect: true
    })
    if (res.ok) {
        const user = (await getSession())?.user;
        const queue = user?.queue || [];
        const favs = user?.favs || [];
        setUser({ queue, favs });
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
    await signOut({ redirect: true });
    setUser({ queue: [], favs: [] });
}

function LogOut({ setUser, user }) {
    return <>
        <User user={user} />
        <form
            className={styles.logout}
            onSubmit={e => { SignOut(e, setUser) }}
        >
            <div className={styles.submit}>
                <button type='submit'>로그아웃</button>
            </div>
        </form>
    </>
}

function LogIn({ setUser }) {
    const [on, setOn] = useState(0);
    const [error, setError] = useState(0);
    return <>
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

function UserInfo({ setUser, session }) {
    // const { status } = useSession();
    return <div className={`${styles.box} ${styles.user}`}>
        {session?.user ?
            <LogOut setUser={setUser} user={session?.user} /> :
            <LogIn setUser={setUser} />}
        {/* {status == 'loading' ? <Loading /> :
            status == 'authenticated' ?
                <LogOut setUser={setUser} /> :
                <LogIn setUser={setUser} />} */}
    </div>
}

const N = 8;
function AsideTable({ data }) {
    const body = data?.map(e => {
        const { code, n, c, p } = e;
        return <tr key={code}>
            <th>
                <Link href={`/stock/${n}`}>{n}</Link>
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

export default function Aside(props) {
    const [view, setView] = useState(false);
    const mobAside = props?.mobAside;
    const setAsideShow = props?.setAsideShow;
    props = {
        ...props,
        view, setView, mobAside, setAsideShow
    }
    useEffect(() => {
        if (mobAside) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobAside]);
    return (
        <>
            <aside className={`${styles.aside} ${(mobAside ? styles.show : '')}`}>
                <div className={styles.wrap}>
                    <div className={styles.search}>
                        <Search {...props} className={styles.search} />
                    </div>
                    <UserInfo {...props} />
                    <StockList {...props} />
                </div>
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
