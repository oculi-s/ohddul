import styles from '@/styles/Stock/StockHead.module.scss';
import { json } from '@/pages/api/xhr';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Help from '@/component/base/help';
import toggleOnPageChange from '@/component/base/toggle';
import { useRouter } from 'next/router';
import { Color, Per } from '@/module/ba';
import dir from '@/module/dir';
import dt from '@/module/dt';

const toggleFav = async ({ favs, setFavs, code, uid }) => {
    setFavs(!favs);
    await json.toggle({
        url: dir.user.fav(uid),
        data: code
    });
}

export const FavStar = ({ favs, setFavs, code, uid }) => {
    return <span className={`${favs ? 'yellow' : ''}`}
        style={{ paddingRight: '5px', fontSize: "1.2em", cursor: "pointer" }}
    >
        <span
            className={`fa fa-star${favs ? '' : '-o'}`}
            onClick={e => { toggleFav({ favs, setFavs, code, uid }) }}
        />
    </span>
}

const Bid = (price) => {
    return price < 2000 ? 1 : price < 20000 ? 10 : 100;
}

const submit = async ({
    code, name, again,
    ohddul, change, uid, origin, date,
    testing,
    setTime, setChange, setDate, setAgain,
    setBar, setOpacity
}) => {
    if (again) return;
    if (ohddul == undefined && !date) {
        alert('0일 뒤 변화는 예측할 수 없습니다.\n날짜를 선택해주세요.')
        return;
    }
    date = dt.toString(dt.num() + dt.DAY * date);

    const od = (ohddul, change) => {
        var res = 0;
        if (ohddul || change > 0) {
            res = 1;
        } else if (ohddul == undefined && change == 0) {
            return '보합'
        }
        return res ? '오름' : '떨어짐'
    }
    const value = (`${date}일 목표가 ${change + origin}원으로 `)
    const msg = `${name}, ${ohddul == undefined ? value : ''}${od(ohddul, change)}을 예측하셨습니다.`;
    alert(msg);
    if (testing) {
        setDate(1);
        setChange(0);
        return;
    }
    await json.queue({
        url: dir.user.pred(uid),
        data: { code, change, ohddul, origin }
    })
    await json.queue({
        url: dir.stock.pred(code),
        data: { uid, change, ohddul, origin }
    })
    await json.up({
        url: dir.stock.predAll,
        data: { code, key: 'queue' }
    })
    setAgain(true);
    setOpacity(0);
    setTimeout(() => setBar(false), 500);
    setTime(dt.num());
}

const Return = ({ setType, setChange }) => {
    return <button onClick={
        () => {
            setType(0);
            if (setChange) setChange(0);
        }
    } className={styles.return}>
        <span className='fa fa-chevron-left'></span>
    </button>
}

const DateForm = ({ date = 1, setDate }) => {
    const keyDown = e => {
        if (e.key == '-') {
            e.preventDefault();
            set(date - 1);
        }
        else if (e.key == '=') {
            e.preventDefault();
            set(date + 1);
        }
    }
    const set = d => {
        d = parseInt(d || 0);
        d = Math.min(d, 90);
        d = Math.max(d, 0);
        setDate(d);
        return d;
    }
    return <div className={styles.date}>
        <input
            type="text"
            value={date}
            onChange={e => e.target.value = set(e.target.value)}
            onKeyDown={keyDown}
        />
        <span>일 뒤</span>
    </div>
}

const PriceForm = ({
    change, origin, setChange, submitProps
}) => {
    const set = (p) => {
        p = parseInt(p || 0);
        p = Math.min(p, origin * 5);
        p = Math.max(p, 0);
        setChange(p - origin);
        return p;
    }
    const keyDown = e => {
        if (e.key == '=' || e.key == '-') {
            e.preventDefault();
            set(origin + change + e.target.step * (e.key == '=' ? 1 : -1));
        } else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
            e.preventDefault();
            set(origin + change + e.target.step * (e.key == 'ArrowUp' ? 1 : -1));
        } else if (e.key == 'r' && !e.ctrlKey) {
            e.preventDefault();
            set(origin);
        } else if (e.key == 'Enter') {
            e.preventDefault();
            submit({ e, ...submitProps });
        }
    }
    const changePercent = (Math.round(change / origin * 1000) / 10).toFixed(1);
    const changeSym = changePercent > 0 ? '+' : '';
    return <div
        className={styles.price}
        onClick={e => {
            let input = e.target?.querySelector('input');
            if (input) {
                input.focus();
                const i = input.value.length;
                input.setSelectionRange(i, i);
            }
        }}>
        <input
            type="text"
            id='price'
            step={Bid(change + origin)}
            value={change + origin}
            onChange={e => { e.target.value = set(e.target.value) }}
            onKeyDown={keyDown}
        />
        <div className={Color(change)}>
            <span>
                <span className={styles.priceDiff}>
                    {changeSym}{change}
                </span>
                (<span className={styles.pricePercent}>
                    {Per(change + origin, origin)}
                </span>)
                {/* 여기 input으로 바꾸기 */}
            </span>
        </div>
        <button
            className='fa fa-refresh'
            onClick={e => setChange(0)}
            type='button'
        />
    </div>
}

/**
 * 오떨을 맞추는 element
 * 
 * testing이 true이면 실제 데이터로 저장되지 않음
 */
export const PredBar = ({
    name, code, last,
    setView, setCnt, setTime,
    setBar, setOpacity,
    testing = false, help = true, defaultType = 0
}) => {
    const origin = last?.close;
    const [change, setChange] = useState(0);
    const [type, setType] = useState(defaultType);
    const [date, setDate] = useState(1);
    const [again, setAgain] = useState(false); // 중복제출 방지
    const { data: session } = useSession();
    const uid = session?.user?.uid;
    const router = useRouter();

    toggleOnPageChange(router, setChange, 0);
    const submitProps = {
        again, setAgain,
        code, name, testing,
        change, origin,
        uid, setTime, date,
        setView, setCnt, setChange, setDate,
        setBar, setOpacity
    };

    if (type == 0) {
        return <div className={styles.type}>
            <button onClick={() => setType(1)}>
                오/떨 맞추기
            </button>
            <button onClick={() => setType(2)}>
                가격 맞추기
            </button>
        </div>
    } else if (type == 1) {
        return <div className={`${styles.type} ${styles.type1}`}>
            <Return {...{ setType }} />
            <button onClick={e => {
                e.preventDefault();
                submit({ ...submitProps, ohddul: 1 })
            }} className={styles.up}>
                오른다
            </button>
            <button onClick={e => {
                e.preventDefault();
                submit({ ...submitProps, ohddul: 0 })
            }} className={styles.down}>
                떨어진다
            </button>
        </div>
    }
    return (
        <div className={styles.fade}>
            <div className={`${styles.type} ${styles.type2}`}>
                <Return {...{ setType, setChange }} />
                <form
                    className={styles.predForm}
                    onSubmit={e => {
                        e.preventDefault();
                        submit(submitProps);
                    }}
                >
                    <DateForm {...{ date, setDate }} />
                    <PriceForm {...{ change, origin, setChange, submitProps }} />
                    <button type='submit' className='fa fa-arrow-right'></button>
                </form>
            </div>
            {help && <div className={styles.help}>
                <Help {...{
                    des: ' 단축키',
                    data: <>
                        <tr><th>&uarr;, &darr;</th><td rowSpan={2}>가격 변경</td></tr>
                        <tr><th>+, -</th></tr>
                        <tr><th>Enter</th><td>맞추기</td></tr>
                        <tr><th>R</th><td>가격 초기화</td></tr>
                    </>
                }} />
            </div>}
        </div>
    )
}

const Open = ({ time, view, setView }) => {
    const { status } = useSession();
    if (status != 'authenticated') return <></>;
    if (dt.toString(time) == dt.toString())
        return (
            <span className={styles.open}>
                <span className='des'>
                    예측완료 : {dt.toString(time, { time: 1 })}
                </span>
            </span>
        )
    return <span className={styles.open}>
        <button
            className={`fa fa-chevron-down ${view ? styles.up : ''}`}
            onClick={e => { setView(!view) }}
        >
            &nbsp;오떨 맞추기
        </button>
    </span>
}

const StockHead = ({
    name, code, last,
    uid, userFavs, userPred,
    stockMeta,
}) => {
    const predTime = userPred?.queue?.find(e => e.code == code)?.date;
    const { status } = useSession();
    const orig = userFavs?.find(e => e == code);
    const type = stockMeta?.type;

    const [bar, setBar] = useState(true);
    const [view, setView] = useState(0);
    const [favs, setFavs] = useState(orig);
    const [time, setTime] = useState(predTime);
    const [opacity, setOpacity] = useState(1);

    const router = useRouter();
    toggleOnPageChange(router, setBar, true);
    toggleOnPageChange(router, setOpacity, 1);
    toggleOnPageChange(router, setView, 0);
    toggleOnPageChange(router, setFavs, orig);
    toggleOnPageChange(router, setTime, predTime);

    const props = {
        name, code, last,
        setView, setTime,
        setBar, setOpacity
    };
    if (!name) return <></>;
    return <>
        <div className={styles.head}>
            <FavStar {...{ favs, setFavs, code, uid }} />
            <h2>
                <Link href={'/stock/' + code}>
                    {name}
                </Link>
                <span
                    className={`${styles.market} ${styles[type == "K" ? 'k' : 'q']}`}
                    title={type == "K" ? "코스피(유가증권)" : "코스닥"}
                ></span>
            </h2>
            <Open {...{ code, time, view, setView }} />
        </div>
        {
            status == 'authenticated' &&
            <div className={`${styles.slide} ${view ? styles.view : ''}`}>
                <div>
                    <div style={{ opacity }} className={styles.fade}>
                        {bar &&
                            <PredBar {...props} />
                        }
                    </div>
                </div>
            </div>
        }
    </>
}

export default StockHead;