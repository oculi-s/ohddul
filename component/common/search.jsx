import styles from '@/styles/Search.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ToggleTab from '#/base/ToggleTab';
import toggleOnPageChange from '#/toggle';
import Inko from 'inko';
import Link from 'next/link';
const inko = new Inko();

const valueChange = ({ e, setView, setResult, meta, group, userMeta }) => {
    let q = e.target?.value;
    if (!q) {
        setView(false);
        return;
    }
    setView(true);
    q = q?.toLowerCase();
    const reg = new RegExp(`${q}|${inko?.en2ko(q)}|${inko?.ko2en(q)}`);
    const res = { stock: [], user: [], group: [] }
    for (let [name, code] of Object.entries(meta?.index || {})) {
        name = name.toLowerCase();
        if (reg.test(name))
            res.stock.push({ code, name });
        else if (code?.includes(q))
            res.stock.push({ code, name });
        if (res.stock.length >= 10) break;
    }

    for (let [code, gname] of Object.entries(group?.index || {})) {
        gname = gname.toLowerCase();
        let name = meta?.data[code]?.n;
        if (reg.test(gname))
            res.group.push({ code, name, gname });

        if (res.group.length >= 10) break;
    }

    for (let { id, rank } of Object.values(userMeta || {})) {
        let idl = id.toLowerCase();
        if (reg.test(idl))
            res.user.push({ id, rank });
        if (res.user.length >= 20) break;
    }
    setResult(res);
}

const elementKeydown = ({ e, i, refs, tabIndex }) => {
    if (e.key == 'ArrowDown') {
        e.preventDefault();
        refs.current.stock[i + 1]?.focus();
    } else if (e.key == 'ArrowUp') {
        e.preventDefault();
        if (i == 0) {
            refs.current.text.focus();
        } else if (tabIndex) {
            refs.current.user[i - 1]?.focus();
        } else {
            refs.current.stock[i - 1]?.focus();
        }
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        e.preventDefault();
    }
}

const inputKeydown = ({ e, tabIndex, setView, setTabIndex, refs }) => {
    const Tab = e.key == 'Tab' && !e.altKey && !e.shiftKey && !e.ctrlKey;
    if (e.key == "ArrowDown") {
        e.preventDefault();
        if (tabIndex) {
            refs.current.user[0]?.focus();
        } else {
            refs.current.stock[0]?.focus();
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
const resKeydown = ({ e, setTabIndex, tabIndex, refs }) => {
    const Tab = e.key == 'Tab' && !e.altKey && !e.shiftKey && !e.ctrlKey;
    const LeftRight = e.key == "ArrowRight" || e.key == "ArrowLeft";
    if (Tab || LeftRight) {
        e.preventDefault();
        setTabIndex(1 - tabIndex);
        // if (!tabIndex) {
        //     refs.current.user[0]?.focus();
        // } else {
        //     refs.current.stock[0]?.focus();
        // }
        refs.current.text.focus();
    }
}

const moveQuery = ({ e, meta, userMeta, router, setAsideShow, result }) => {
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
}

const Search = ({
    meta, group, router, refs, userMeta, setAsideShow, view, setView
}) => {
    const [result, setResult] = useState({ stock: [], user: [], group: [] });
    const [tabIndex, setTabIndex] = useState(0);
    const props = {
        setResult, refs, router,
        meta, group, userMeta, result,
        setView, tabIndex, setTabIndex, setAsideShow
    }

    const N = result?.stock?.length;
    const StockResult = () => result.stock?.map((e, i) => {
        return (
            <Link
                key={`stock${e.code}`}
                onKeyDown={e => { elementKeydown({ e, i, ...props }) }}
                ref={e => { refs.current.stock[i] = e }}
                href={`/stock/${e.code}`}
                className={styles.element}
            >
                <span>{e.code}</span>
                <span>{e.name?.toUpperCase()}</span>
            </Link>
        )
    });

    const GroupResult = () => result.group
        ?.sort((a, b) => a.gname.localeCompare(b.gname))
        .map((e, i) => {
            return <Link
                key={`group${e.code}`}
                onKeyDown={e => { elementKeydown({ e, i: N + i, ...props }) }}
                ref={e => { refs.current.stock[N + i] = e }}
                href={`/stock/${e.code}`}
                className={styles.element}
            >
                <span>{e.gname?.toUpperCase()}</span>
                <span>{e.name}</span>
            </Link>
        })

    const UserResult = () => result.user
        ?.map((e, i) => {
            return <Link
                key={e.id}
                onKeyDown={e => { elementKeydown({ e, i, ...props }) }}
                ref={e => { refs.current.user[i] = e }}
                href={`/profile/${e.id}`}
                className={styles.element}
            >
                <span>{e.id}</span>
                <span>{e.rank}</span>
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
    ]
    return (
        <div className={styles.search}>
            <form onSubmit={e => moveQuery({ e, ...props })} >
                <input
                    onInput={e => { valueChange({ e, ...props }) }}
                    onKeyDown={e => { inputKeydown({ e, ...props }) }}
                    placeholder='종목/유저 검색 (ctrl+F)'
                    id='q'
                    type='text'
                    autoComplete='off'
                    ref={e => refs.current.text = e}
                />
                <button
                    className="fa fa-search"
                    type='submit'
                />
            </form>
            <div
                className={`${styles.result} ${view ? '' : styles.d}`}
                onKeyDown={e => { resKeydown({ e, ...props }) }}
            >
                <ToggleTab {...{ names, datas, tabIndex, setTabIndex }} />
            </div>
        </div>
    )
}

export default function Index({
    meta, group, userMeta, setAsideShow, view, setView
}) {
    const refs = useRef({ stock: [], user: [] });
    const router = useRouter();
    toggleOnPageChange(router, setAsideShow);
    toggleOnPageChange(router, setView);

    const props = { meta, group, router, refs, userMeta, setAsideShow, view, setView };
    useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key == 'f') {
                e.preventDefault();
                if (setAsideShow) setAsideShow(true);
                refs.current.text?.focus();
            }
        });
    })
    return (
        <Search {...props} />
    )
}