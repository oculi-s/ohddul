import styles from '$/Common/Aside.module.scss';
import { AlarmSetting, User, getRank } from '@/components/User';
import { signOut } from "next-auth/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/base/base';
import { KakaoLogin } from '@/components/base/Kakao';
import { Color, Num, Per, Price } from '@/module/ba';
import { FetcherRead } from '@/module/fetcher';
import GroupImg from '@/public/group/Default';
import cn from 'classnames';
import { FaChevronRight } from 'react-icons/fa';
import { IoIosClose } from "react-icons/io";
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * 2023.07.06 useSession을 predbar에서 사용하면서
 * 
 * login, out에서는 redirect=true를 사용하는 것으로 변경
 * aside에 띄울 세션 정보는 serverside에서 getSession을 통해 받아오는 것으로 결정
 * 
 * 2023.07.06 kakao 로그인으로 바꾸면서 signin, out, 나머지 함수들 전부 폐기
 */
function Box({ children, className }: {
    children: React.ReactNode,
    className?: string
}) {
    return <div className={cn('bg-trade-700 p-5 relative text-sm', className)}>{children}</div>;
}

function LogOut({ user, setAsideShow }) {
    return (
        <div className={styles.logout}>
            <User user={user} setAsideShow={setAsideShow} />
            <div className={styles.buttonWrap}>
                <AlarmSetting uid={user?.uid} setAsideShow={setAsideShow} />
                <button onClick={e => signOut()}>로그아웃</button>
            </div>
        </div>
    )
}

function LogIn() {
    return (
        <div className='flex flex-col gap-2 items-center'>
            <div>지금 바로 시작하세요</div>
            <KakaoLogin />
        </div>
    )
}

function UserInfo({ session, setAsideShow }) {
    return <Box>
        {session?.user ?
            <LogOut user={session?.user} setAsideShow={setAsideShow} /> :
            <LogIn />}
    </Box>
}

const N = 12;
function AsideTable({ data, setAsideShow }) {
    const body = data?.map(e => {
        const { code, n, c, p } = e;
        return <tr key={code}>
            <th>
                <Link
                    href={`/stock/${n}`}
                    onClick={e => setAsideShow()}
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
                    onClick={e => setAsideShow()}
                >
                    <GroupImg name={n} className='!h-5 flex justify-center' />
                </Link>
            </th>
            <td align='right'>{Price(c)}</td>
            <td className={Color(c - p)} align='center'>{Per(c, p)}</td>
        </tr>
    })
    return <table><tbody>{body}</tbody></table>;
}

function StockList({ aside, setAsideShow }) {
    return <>
        <Box>
            <Link
                href="/stock/sum"
                onClick={e => setAsideShow()}
                className='flex items-center gap-2 justify-between text-slate-100'
            >
                <div className='flex gap-1 items-center'>
                    <Logo size={18} />
                    <span>시가총액 순위</span>
                </div>
                <FaChevronRight />
            </Link>
            <AsideTable data={aside?.sum} setAsideShow={setAsideShow} />
        </Box>
        <Box>
            <Link
                href="/group"
                onClick={e => setAsideShow()}
                className='flex items-center gap-2 justify-between text-slate-100'
            >
                <div className='flex gap-1 items-center'>
                    <Logo size={18} />
                    <span>그룹 순위</span>
                </div>
                <FaChevronRight />
            </Link>
            <AsideGroup data={aside?.group} setAsideShow={setAsideShow} />
        </Box>
        <Box>
            <Link
                href="/stock/up"
                onClick={e => setAsideShow()}
                className='flex items-center gap-2 justify-between text-slate-100'
            >
                <div className='flex gap-1 items-center'>
                    <Logo size={18} />
                    <span>오른 종목</span>
                </div>
                <FaChevronRight />
            </Link>
            <AsideTable data={aside?.up} setAsideShow={setAsideShow} />
        </Box>
        <Box>
            <Link
                href="/stock/down"
                onClick={e => setAsideShow()}
                className='flex items-center gap-2 justify-between text-slate-100'
            >
                <div className='flex gap-1 items-center'>
                    <Logo size={18} />
                    <span>떨어진 종목</span>
                </div>
                <FaChevronRight />
            </Link>
            <AsideTable data={aside?.down} setAsideShow={setAsideShow} />
        </Box>
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
        <Box>
            <span className={styles.rank}>명예의 전당</span>
            <table><tbody>{data}</tbody></table>
        </Box>
    );
}

function Total() {
    return (
        <div className={styles.box}>
            <span className={styles.rank}>예측 상위</span>
        </div>
    );
}

export default function Aside({ session, mobAside, setAsideShow }: {
    session: any,
    mobAside: boolean,
    setAsideShow: Function
}) {
    const [aside, setAside] = useState();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        FetcherRead('meta/light/aside.json').then(res => {
            setAside(res);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (mobAside) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobAside]);
    return (
        <>
            <aside className='grid gap-0.5 p-0.5 min-w-aside'>
                <UserInfo session={session} setAsideShow={setAsideShow} />
                <StockList setAsideShow={setAsideShow} aside={aside} />
            </aside>
            <div className={styles.shadow}
                onClick={e => setAsideShow()}
            >
                <IoIosClose
                    onClick={e => setAsideShow()}
                />
            </div>
        </>
    )
}
