import styles from '$/Common/Search.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ToggleTab from '#/base/ToggleTab';
import scss from '$/variables.module.scss';
import Inko from 'inko';
import Link from 'next/link';
import api from '@/pages/api';
import dir from '@/module/dir';
import { Int } from '@/module/ba';
import { getRank } from '#/User';

const inko = new Inko();

function makeResult({ e, setView, setResult, meta, group, users }) {
    let q = e.target?.value;
    if (!q) {
        if (setView) setView(false);
        return;
    }
    if (setView) setView(true);
    q = q?.toLowerCase();
    let N = 10;
    if (window.innerWidth < Int(scss?.midWidth)) N = 5;
    const reg = new RegExp(`${q}|${inko?.en2ko(q)}|${inko?.ko2en(q)}`);
    const res = { stock: [], user: [], group: [] };
    for (let [name, code] of Object.entries(meta?.index || {})) {
        name = name?.toLowerCase();
        if (reg?.test(name))
            res?.stock?.push({ code, name });
        else if (code?.includes(q))
            res?.stock?.push({ code, name });
        if (res?.stock?.length >= N) break;
    }

    for (let [code, gname] of Object.entries(group?.index || {})) {
        gname = gname?.toLowerCase();
        let name = meta?.data[code]?.n;
        if (reg?.test(gname))
            res?.group?.push({ code, name, gname });

        if (res?.group?.length >= N) break;
    }

    for (let [id, rank] of users) {
        let idl = id?.toLowerCase();
        if (reg?.test(idl))
            res?.user?.push({ id, rank });
        if (res?.user?.length >= N * 2) break;
    }
    setResult(res);
}

function elementKeydown({ e, i, stockRef, userRef, tabIndex, inputRef, setView }) {
    if (e.key == 'ArrowDown') {
        e.preventDefault();
        if (tabIndex) {
            if (i < userRef?.current?.length - 1) {
                userRef?.current[i + 1]?.focus();
            } else {
                inputRef?.current?.focus();
            }
        } else {
            if (i < stockRef?.current?.length - 1) {
                stockRef?.current[i + 1]?.focus();
            } else {
                inputRef?.current?.focus();
            }
        }
    } else if (e.key == 'ArrowUp') {
        e.preventDefault();
        if (i == 0) {
            inputRef?.current?.focus();
        } else if (tabIndex) {
            userRef?.current[i - 1]?.focus();
        } else {
            stockRef?.current[i - 1]?.focus();
        }
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        e.preventDefault();
    } else if (e.key == 'Enter') {
        inputRef.current.value = '';
        if (setView) setView(false);
        e.target.click();
    } else if (e.key == 'Escape') {
        if (setView) setView(false);
    }
}

function inputKeydown({ e, tabIndex, setView, setTabIndex, stockRef, userRef }) {
    const Tab = e.key == 'Tab' && !e.altKey && !e.shiftKey && !e.ctrlKey;
    if (e.key == "ArrowDown") {
        e.preventDefault();
        if (tabIndex) {
            userRef?.current[0]?.focus();
        } else {
            stockRef?.current[0]?.focus();
        }
    } else if (e.key == 'ArrowUp') {
        e.preventDefault();
        if (tabIndex) {
            userRef?.current.slice(-1)[0]?.focus();
        } else {
            stockRef?.current.slice(-1)[0]?.focus();
        }
    } else if (e.key == 'Escape') {
        e.preventDefault();
        setView(false);
    } else if (Tab) {
        e.preventDefault();
        setTabIndex(1 - tabIndex);
    }
}

/**
 * tab을 바꾸면서 첫번째 element를 focus해야하는데 안되는 오류 있음
 * 
 * 2023.06.25
 */
function resKeydown({ e, setTabIndex, tabIndex, inputRef }) {
    const Tab = e.key == 'Tab' && !e.altKey && !e.shiftKey && !e.ctrlKey;
    const LeftRight = e.key == "ArrowRight" || e.key == "ArrowLeft";
    if (Tab || LeftRight) {
        e.preventDefault();
        setTabIndex(1 - tabIndex);
        inputRef?.current?.focus();
    }
}

function moveQuery({ e, meta, users, router, setAsideShow, setView, result }) {
    e.preventDefault();
    const q = e.target?.q?.value?.toLowerCase();
    const resStock = Object.entries(meta?.data)?.find(([code, e]) => code == q || e.name?.toLowerCase() == q);
    const resUser = Object.values(users).find(e => e.id == q);
    if (resStock) {
        router.push(`/stock/${resStock[0]}`);
    } else if (resUser) {
        router.push(`/profile/${resUser.id}`);
    } else if (result.stock.length) {
        let res = result.stock[0].code;
        router.push(`/stock/${res}`);
    } else if (result.group.length) {
        let res = result.group[0].code;
        router.push(`/stock/${res}`);
    } else if (result.user.length) {
        let res = result.user[0].id;
        router.push(`/profile/${res}`);
    } else {
        router.push('/search?q=' + e.target.q.value);
    }
    e.target.q.value = '';
    if (setAsideShow) setAsideShow(false);
    if (setView) setView(false);
}

function Index(props) {
    const stockDef = props?.aside?.sum?.map(({ code, n }) => ({ code, name: n }));
    const userDef = props?.users?.map(([id, rank]) => ({ id, rank }));
    const [result, setResult] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    props = {
        ...props,
        result, setResult, tabIndex, setTabIndex
    };
    const { inputRef, userRef, stockRef, view, setView } = props || {}
    const N = result?.stock?.length;

    const StockResult = () => (result?.stock || stockDef)
        ?.map((e, i) => <Link
            key={`stock${e.code}`}
            onKeyDown={e => { elementKeydown({ e, i, ...props }); }}
            ref={e => { stockRef.current[i] = e; }}
            href={`/stock/${e.code}`}
            className={styles.element}
            onClick={e => setView(false)}
        >
            <span>{e?.code}</span>
            <span>{e?.name?.toUpperCase()}</span>
        </Link>);

    const GroupResult = () => result?.group
        ?.qsort((a, b) => a?.gname?.localeCompare(b?.gname))
        .map((e, i) => <Link
            key={`group${e.code}`}
            onKeyDown={e => { elementKeydown({ e, i: N + i, ...props }); }}
            ref={e => { stockRef.current[N + i] = e; }}
            href={`/stock/${e?.code}`}
            className={styles.element}
            onClick={e => setView(false)}
        >
            <span>{e?.gname?.toUpperCase()}</span>
            <span>{e?.name}</span>
        </Link>);

    const UserResult = () => (result?.user || userDef)
        ?.map((e, i) => {
            const [color] = getRank(e?.rank);
            return <Link
                key={e.id}
                onKeyDown={e => { elementKeydown({ e, i, ...props }); }}
                ref={e => { userRef.current[i] = e; }}
                href={`/profile/${e?.id}`}
                className={`${styles.element} ${color}`}
                onClick={e => setView(false)}
            >
                <span>{e?.id}</span>
                <span>{Int(e?.rank)}</span>
            </Link>
        });

    const names = [
        <span key={`tab0`}>종목정보</span>,
        <span key={`tab1`}>유저정보</span>
    ];
    const datas = [
        <div key={0}>
            <p className={styles.title}>
                <span className='fa fa-chevron-right' />
                종목
            </p>
            <div className={styles.list}>
                <StockResult />
            </div>
            {result?.group?.length ? <>
                <p className={styles.title}>
                    <span className='fa fa-chevron-right' />
                    그룹
                </p>
                <div className={styles.list}>
                    <GroupResult />
                </div>
            </> : ''}
        </div>,
        <div key={1}>
            <div className={styles.list}>
                <UserResult />
            </div>
        </div>
    ];
    return (
        <div className={styles.search}>
            <form onSubmit={e => moveQuery({ e, ...props })}>
                <div className={styles.inputWrap}>
                    <span className={styles.placeHolder}>
                        종목/유저 검색<span className='mh'> (ctrl+F)</span>
                    </span>
                    <input
                        onClick={e => { setView(true) }}
                        onInput={e => { makeResult({ e, ...props }); }}
                        onKeyDown={e => { inputKeydown({ e, ...props }); }}
                        id='q'
                        type='text'
                        autoComplete='off'
                        ref={e => { inputRef.current = e; }}
                        required
                    />
                </div>
                <button
                    className="fa fa-search"
                    type='submit' />
            </form>
            <div
                className={`${styles.result} ${view ? '' : styles.d}`}
                onKeyDown={e => { resKeydown({ e, ...props }); }}
            >
                <ToggleTab {...{ names, datas, tabIndex, setTabIndex }} />
            </div>
            <div className={`${styles.shadow} ${view ? '' : styles.d}`} onClick={e => setView(false)}></div>
        </div>
    );
}

export default function Search(props) {
    const [meta, setMeta] = useState();
    const [group, setGroup] = useState();
    const [users, setUsers] = useState();
    useEffect(() => {
        /**
         * meta와 userMeta의 lazyloading
         */
        async function lazyLoad() {
            setMeta(await api.json.read({ url: dir.stock.meta }));
            setGroup(await api.json.read({ url: dir.stock.group }));
            setUsers(await api.user.meta({}));
        }
        lazyLoad();
    }, [])

    const setAsideShow = props?.setAsideShow;
    const stockRef = useRef([]);
    const userRef = useRef([]);
    const inputRef = useRef();

    const router = useRouter();
    props = {
        ...props,
        meta, group, users,
        router,
        stockRef, userRef, inputRef
    };

    useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key == 'f') {
                e.preventDefault();
                if (window.innerWidth < Int(scss.midWidth)) {
                    if (setAsideShow) setAsideShow(false);
                }
                inputRef?.current?.focus();
            }
        });
    })

    return <Index {...props} />
}