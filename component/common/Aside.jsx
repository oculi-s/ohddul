import styles from '$/Common/Aside.module.scss'
import Link from 'next/link'
import { signIn, signOut } from "next-auth/react";
import { useEffect } from 'react';
import { AlarmSetting, User, getRank } from '#/User';

import Image from 'next/image';
import { Per, Color, Num, Price } from '@/module/ba';
import KakaoLogin from '@/public/kakao_sync_login/kakao_login_large_narrow.png';
import { Logo } from '#/base/base';
import GroupImg from '@/public/group/Default';

/**
 * 2023.07.06 useSession을 predbar에서 사용하면서
 * 
 * login, out에서는 redirect=true를 사용하는 것으로 변경
 * aside에 띄울 세션 정보는 serverside에서 getSession을 통해 받아오는 것으로 결정
 * 
 * 2023.07.06 kakao 로그인으로 바꾸면서 signin, out, 나머지 함수들 전부 폐기
 */
function LogOut({ user, setAsideShow }) {
    return <>
        <div className={styles.logout}>
            <User user={user} setAsideShow={setAsideShow} />
            <div className={styles.buttonWrap}>
                <AlarmSetting user={user} setAsideShow={setAsideShow} />
                <button onClick={e => signOut()}>로그아웃</button>
            </div>
        </div>
    </>
}

function LogIn() {
    return <>
        <div className={styles.login}>
            <p>지금 바로 시작하세요</p>
            <Image
                src={KakaoLogin.src}
                width={214}
                height={53}
                onClick={e => signIn('kakao')}
            />
        </div>
    </>
}

function UserInfo({ session, setAsideShow }) {
    return <div className={`${styles.box} ${styles.user}`}>
        {session?.user ?
            <LogOut user={session?.user} setAsideShow={setAsideShow} /> :
            <LogIn />}
    </div>
}

const N = 8;
function AsideTable({ data, setAsideShow }) {
    const body = data?.map(e => {
        const { code, n, c, p } = e;
        return <tr key={code}>
            <th>
                <Link
                    href={`/stock/${n}`}
                    onClick={e => setAsideShow(false)}
                >{n}</Link>
            </th>
            <td align='right'>{Num(c)}</td>
            <td className={Color(c - p)} align='center'>{Per(c, p)}</td>
        </tr>
    })
    return <table><tbody>{body}</tbody></table>;
}
function AsideGroup({ data, setAsideShow }) {
    const body = data?.map(e => {
        const { n, c, p } = e;
        return <tr key={n}>
            <th>
                <Link
                    href={`/group/${n}`}
                    onClick={e => setAsideShow(false)}
                ><GroupImg name={n} /></Link>
            </th>
            <td align='right'>{Price(c)}</td>
            <td className={Color(c - p)} align='center'>{Per(c, p)}</td>
        </tr>
    })
    return <table className={styles.group}>
        <tbody>
            {body}
        </tbody>
    </table>;
}

function StockList({ aside, setAsideShow }) {
    return <>
        <div className={styles.box}>
            <Link
                href="/stock/sum"
                onClick={e => setAsideShow(false)}
            >
                <Logo size={18} />
                <span className={styles.sum}>시가총액 순위</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.sum} setAsideShow={setAsideShow} />
        </div>
        <div className={styles.box}>
            <Link
                href="/stock/group"
                onClick={e => setAsideShow(false)}
            >
                <Logo size={18} />
                <span className={styles.sum}>그룹 순위</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideGroup data={aside?.group} setAsideShow={setAsideShow} />
        </div>
        <div className={styles.box}>
            <Link
                href="/stock/up"
                onClick={e => setAsideShow(false)}
            >
                <span className={styles.up}>오른종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.up} setAsideShow={setAsideShow} />
        </div>
        <div className={styles.box}>
            <Link
                href="/stock/down"
                onClick={e => setAsideShow(false)}
            >
                <span className={styles.down}>떨어진종목</span>
                &nbsp;<span className='fa fa-chevron-right'></span>
            </Link>
            <AsideTable data={aside?.down} setAsideShow={setAsideShow} />
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
            const [color, num, next] = getRank(rank);
            return (
                <tr key={i}>
                    <th className={color}>
                        <Link
                            href={`/profile/${id}`}
                        >
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
    const mobAside = props?.mobAside;
    const setAsideShow = props?.setAsideShow;
    props = {
        ...props,
        mobAside, setAsideShow
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
                    <UserInfo {...props} />
                    <StockList {...props} />
                </div>
            </aside>
            <div className={styles.shadow}
                onClick={e => setAsideShow(false)}
            >
                <button className='fa fa-close'
                    onClick={e => setAsideShow(false)}
                />
            </div>
        </>
    )
}
