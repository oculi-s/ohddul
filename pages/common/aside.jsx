import styles from '@/styles/Aside.module.scss'
import Link from 'next/link'
import User from '@/pages/_user'
import { useSession } from "next-auth/react"
import { Button, TextField } from '@mui/material';
import { signIn, signOut } from "next-auth/react";
import { useState, useRouter } from 'react';
import { getRank } from '@/pages/_user';
import Search from '@/pages/common/search';

import { Per, Color, Fix, Num } from '@/module/ba';

const SignIn = async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const res = await signIn("my-credential", {
        id, pw, redirect: true
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
    console.log(status);
    const [valid, setValid] = useState(false);
    const helper = valid ? "잘못된 ID/비밀번호입니다." : "";
    if (status == "authenticated") {
        return (
            <Wrap>
                <User userMeta={userMeta}></User>
                <form onSubmit={SignOut}>
                    <Button type='submit'>로그아웃</Button>
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
                <TextField
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
                <Button type='submit'>로그인</Button>
            </form>
            <Button href="/create">회원가입</Button>
        </Wrap>
    )
}

const N = 8;
const PriceTable = ({ code, price, i, meta }) => {
    const { prev, close } = price;
    return (
        <tr key={i}>
            <th>
                <Link href={`/stock/${code}`}>
                    {meta.data[code]?.name}
                </Link>
            </th>
            <td align='right'>{Num(close)}</td>
            <td className={Color(close - prev)} align='center'>
                {Per(close, prev)}
            </td>
        </tr>
    )
}

const Up = ({ price, meta }) => {
    if (!price || !meta) {
        return (<>로딩중입니다...</>)
    }
    let data = Object.entries(price)
        .filter(([code, price], i) => meta.data[code])
        .sort(([ka, a], [kb, b]) => (b.close - b.prev) * a.prev - b.prev * (a.close - a.prev))
        .slice(0, N)
        .map(([code, price], i) => PriceTable({ code, price, i, meta }));
    return (
        <div className={styles.box}>
            <Link href="/stock/up">
                <span className={styles.up}>오른종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <table><tbody>{data}</tbody></table>
        </div>
    )
}
const Down = ({ price, meta }) => {
    if (!price || !meta) {
        return (<>로딩중입니다...</>)
    }
    let data = Object.entries(price)
        .filter(([code, price], i) => meta.data[code])
        .sort(([ka, a], [kb, b]) => (a.close - a.prev) * b.prev - a.prev * (b.close - b.prev))
        .slice(0, N)
        .map(([code, price], i) => PriceTable({ code, price, i, meta }));
    return (
        <div className={styles.box}>
            <Link href="/stock/down">
                <span className={styles.down}>떨어진종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <table><tbody>{data}</tbody></table>
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
    price, meta,
    userMeta,
    mobAside, setAsideShow
}) {
    let props = { meta, userMeta, price, setAsideShow };
    return (
        <>
            <aside className={`${styles.aside} ${(mobAside ? styles.show : '')}`}>
                <div className={styles.search}>
                    <Search {...props} className={styles.search} />
                </div>
                <Info {...props} />
                {/* <Rank {...props} /> */}
                <Up {...props} />
                <Down {...props} />
                {/* <Total {...props} /> */}
            </aside>
            <div className={styles.shadow}
                onClick={e => { setAsideShow(false) }}
            >
                <button className='fa fa-close'
                    onClick={e => { setAsideShow(false) }}
                />
            </div>
        </>
    )
}
