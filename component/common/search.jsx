import styles from '$/Common/Search.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ToggleTab from '#/base/ToggleTab';
import scss from '$/variables.module.scss';
import Inko from 'inko';
import Link from 'next/link';
import { json } from '@/pages/api/xhr';
import dir from '@/module/dir';
import { Int } from '@/module/ba';

const inko = new Inko();

function makeResult({ e, setView, setResult, meta, group, userMeta }) {
    let q = e.target?.value;
    if (!q) {
        setView(false);
        return;
    }
    setView(true);
    q = q?.toLowerCase();
    const reg = new RegExp(`${q}|${inko?.en2ko(q)}|${inko?.ko2en(q)}`);
    const res = { stock: [], user: [], group: [] };
    for (let [name, code] of Object.entries(meta?.index || {})) {
        name = name?.toLowerCase();
        if (reg?.test(name))
            res?.stock?.push({ code, name });
        else if (code?.includes(q))
            res?.stock?.push({ code, name });
        if (res?.stock?.length >= 10) break;
    }

    for (let [code, gname] of Object.entries(group?.index || {})) {
        gname = gname?.toLowerCase();
        let name = meta?.data[code]?.n;
        if (reg?.test(gname))
            res?.group?.push({ code, name, gname });

        if (res?.group?.length >= 10) break;
    }

    for (let { id, rank } of Object.values(userMeta || {})) {
        let idl = id?.toLowerCase();
        if (reg?.test(idl))
            res?.user?.push({ id, rank });
        if (res?.user?.length >= 20) break;
    }
    setResult(res);
}

function elementKeydown({ e, i, stockRef, userRef, tabIndex, inputRef, setView }) {
    if (e.key == 'ArrowDown') {
        e.preventDefault();
        stockRef?.current[i + 1]?.focus();
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

function moveQuery({ e, meta, userMeta, router, setAsideShow, setView, result }) {
    e.preventDefault();
    const q = e.target?.q?.value?.toLowerCase();
    const resStock = Object.entries(meta?.data)?.find(([code, e]) => code == q || e.name?.toLowerCase() == q);
    const resUser = Object.values(userMeta).find(e => e.id == q);
    if (resStock) {
        router.push(`/stock/${resStock[0]}`);
    } else if (resUser) {
        router.push(`/profile/${resUser.id}`);
    } else if (result.stock.length) {
        let res = result.stock[0].code;
        router.push(`/stock/${res}`);
    } else if (result.group.length) {
        let res = result.group[0].id;
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

function Search(props) {
    const [result, setResult] = useState({ stock: [], user: [], group: [] });
    const [tabIndex, setTabIndex] = useState(0);
    props = {
        ...props,
        result, setResult, tabIndex, setTabIndex
    };
    const { inputRef, userRef, stockRef, view } = props || {}
    const N = result?.stock?.length;

    const StockResult = () => result.stock
        ?.map((e, i) => <Link
            key={`stock${e.code}`}
            onKeyDown={e => { elementKeydown({ e, i, ...props }); }}
            ref={e => { stockRef.current[i] = e; }}
            href={`/stock/${e.code}`}
            className={styles.element}
        >
            <span>{e?.code}</span>
            <span>{e?.name?.toUpperCase()}</span>
        </Link>);

    const GroupResult = () => result.group
        ?.sort((a, b) => a?.gname?.localeCompare(b?.gname))
        .map((e, i) => <Link
            key={`group${e.code}`}
            onKeyDown={e => { elementKeydown({ e, i: N + i, ...props }); }}
            ref={e => { stockRef.current[N + i] = e; }}
            href={`/stock/${e?.code}`}
            className={styles.element}
        >
            <span>{e?.gname?.toUpperCase()}</span>
            <span>{e?.name}</span>
        </Link>);

    const UserResult = () => result.user
        ?.map((e, i) => <Link
            key={e.id}
            onKeyDown={e => { elementKeydown({ e, i, ...props }); }}
            ref={e => { userRef.current[i] = e; }}
            href={`/profile/${e?.id}`}
            className={styles.element}
        >
            <span>{e?.id}</span>
            <span>{e?.rank}</span>
        </Link>);

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
            <StockResult />
            <p className={styles.title}>
                <span className='fa fa-chevron-right' />
                그룹
            </p>
            <GroupResult />
        </div>,
        <div key={1}>
            <UserResult />
        </div>
    ];
    return (
        <div className={styles.search}>
            <form onSubmit={e => moveQuery({ e, ...props })}>
                <input
                    onInput={e => { makeResult({ e, ...props }); }}
                    onKeyDown={e => { inputKeydown({ e, ...props }); }}
                    placeholder='종목/유저 검색 (ctrl+F)'
                    id='q'
                    type='text'
                    autoComplete='off'
                    ref={e => { inputRef.current = e; }} />
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
        </div>
    );
}

export default function Index(props) {
    const [meta, setMeta] = useState(props?.meta);
    const [group, setGroup] = useState(props?.group);
    const [userMeta, setUserMeta] = useState(props?.userMeta);
    useEffect(() => {
        /**
         * meta와 userMeta의 lazyloading
         */
        async function lazyLoad() {
            if (!meta?.data || !meta?.index || meta?.light) {
                console.log('meta lazyload')
                setMeta(await json.read({ url: dir.stock.meta }));
            }
            if (!group?.data || group?.light) {
                console.log('group lazyload')
                setGroup(await json.read({ url: dir.stock.group }));
            }
            if (!userMeta) {
                console.log('user meta lazyload')
                setUserMeta(await json.read({ url: dir.user.meta }));
            }
        }
        lazyLoad();
    }, [])

    const setAsideShow = props?.setAsideShow;
    const stockRef = useRef([]);
    const userRef = useRef([]);
    const inputRef = useRef();

    const router = useRouter();
    props = { ...props, meta, group, userMeta, router, stockRef, userRef, inputRef };

    useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key == 'f') {
                e.preventDefault();
                if (window.innerWidth < Int(scss.midWidth)) {
                    if (setAsideShow) setAsideShow(true);
                }
                inputRef?.current?.focus();
            }
        });
    })

    return <Search {...props} />
}