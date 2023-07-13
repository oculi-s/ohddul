import styles from '$/Stock/StockHead.module.scss';
import { Color, Per } from '@/module/ba';
import dir from '@/module/dir';
import dt from '@/module/dt';
import { json } from '@/pages/api/xhr';
import Help from '#/base/Help';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Bid = (price) => {
    return price < 2000 ? 1 : price < 20000 ? 10 : 100;
}

const Alert = ({ name, ohddul, change, date, origin }) => {
    date = dt.toString(dt.num() + dt.DAY * date);
    const od = (ohddul, change) => {
        var res = -1;
        if (change > 0) res = 1;
        if (ohddul == 1) res = 1;
        if (ohddul == undefined && change == 0) res = 0;
        return res == 0 ? '보합' : res == 1 ? '오름' : '떨어짐';
    };
    const value = (`${date}일 목표가 ${change + origin}원으로 `);
    const msg = `${name}, ${ohddul ? '' : value}${od(ohddul, change)}을 예측하셨습니다.`;
    alert(msg);
}

/**
 * 제출 데이터
 * 
 * 1. ohddul : 오/떨 예측, -1은 떨어짐, 1은 오름, 점수계산의 p와 유사함
 * 2. change : 가격변화, useState가 가격 변화를 중심으로 돌아가므로 사용함
 * 3. origin : 초기 기준 가격, change+origin을 목표가로 설정함
 * 4. date : 가격 예측인 경우 사용, n일 뒤의 n
 * 
 * * 기존에 사용하던 setBar, setOpacity, setTime은 폐기
 * * session 업데이트와 함께 상위문서인 stockHead에서 자동 리렌더
 */
async function submit({
    update, again, uid,
    code, name,
    ohddul, change, origin, date,

    testing,
    setChange, setDate, setAgain
}) {
    if (again) return;
    if (!ohddul && !date) {
        alert('0일 뒤 변화는 예측할 수 없습니다.\n날짜를 선택해주세요.');
        return;
    }
    Alert({ name, ohddul, change, date, origin });

    if (testing) {
        setDate(1);
        setChange(0);
        return;
    }
    const d = dt.num();
    const data = { o: origin, d }
    if (ohddul) {
        data.t = 'od', data.od = ohddul;
    } else {
        // 만약 가격 예측인경우 date일 뒤 장전일에 예측한 것처럼 설정함
        const at = dt.now(d);
        at.set({ date: at.date() + date, hour: 8, minute: 50, second: 0 });
        data.t = 'pr', data.pr = origin + change;
        data.at = dt.num(at);
    }

    const predData = { ...data, uid };
    const userData = { ...data, c: code };
    await json.queue({ url: dir.user.pred(uid), data: userData, });
    await json.queue({ url: dir.stock.pred(code), data: predData, });
    await json.up({
        url: dir.stock.predAll,
        data: { code, key: 'queue' }
    });
    update(userData);
    setAgain(true);
}

function Return({ setType, setChange }) {
    return <button onClick={() => {
        setType(0);
        if (setChange) setChange(0);
    }} className={styles.return}>
        <span className='fa fa-chevron-left'></span>
    </button>;
}

function DateForm({ date = 1, setDate }) {
    const keyDown = e => {
        if (e.key == '-') {
            e.preventDefault();
            set(date - 1);
        }
        else if (e.key == '=') {
            e.preventDefault();
            set(date + 1);
        }
    };
    const set = d => {
        d = parseInt(d || 0);
        d = Math.min(d, 90);
        d = Math.max(d, 0);
        setDate(d);
        return d;
    };
    return <div className={styles.date}>
        <input
            type="text"
            value={date}
            onChange={e => e.target.value = set(e.target.value)}
            onKeyDown={keyDown} />
        <span>일 뒤</span>
    </div>;
}

function PriceForm({
    change, origin, setChange, submitProps
}) {
    const set = (p) => {
        p = parseInt(p || 0);
        p = Math.min(p, origin * 5);
        p = Math.max(p, 0);
        setChange(p - origin);
        return p;
    };
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
    };
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
            onChange={e => { e.target.value = set(e.target.value); }}
            onKeyDown={keyDown} />
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
            type='button' />
    </div>;
}

/**
 * 오떨을 맞추는 element
 * 
 * testing이 true이면 실제 데이터로 저장되지 않음
 */
export default function PredBar({
    name, code, last,
    setView, setCnt,
    testing = false, help = true, defaultType = 0
}) {
    const { data: session, update } = useSession();
    const [change, setChange] = useState(0);
    const [type, setType] = useState(defaultType);
    const [date, setDate] = useState(1);
    const [again, setAgain] = useState(false); // 중복제출 방지
    const [origin, setOrigin] = useState(last?.c || last || 0);
    const uid = session?.user?.uid;

    const submitProps = {
        update,
        again, setAgain,
        code, name, testing,
        change, origin,
        uid, date,
        setView, setCnt, setChange, setDate,
    };
    useEffect(() => {
        if (!testing) {
            setView(0);
            setTimeout(() => {
                setOrigin(last?.c || last || 0);
                setChange(0);
                setDate(1);
                setAgain(false);
                setType(0);
            }, 500);
        }

        // const queue = session?.user?.queue?.qsort(dt.sort);
        // const defTime = queue?.find(e => e.c == code)?.d;
        // const can = dt.pred(defTime);
        // document.onkeydown = e => {
        //     if (e.key == 'F9') {
        //         e.preventDefault();
        //         if (can)
        //             submit({ ...submitProps, ohddul: 1 });
        //     } else if (e.key == 'F10') {
        //         e.preventDefault();
        //         if (can)
        //             submit({ ...submitProps, ohddul: -1 });
        //     }
        // }
    }, [code]);


    if (type == 0) {
        return <div className={styles.type}>
            <button onClick={() => setType(1)}>
                오/떨 맞추기
            </button>
            <button onClick={() => setType(2)}>
                가격 맞추기
            </button>
        </div>;
    } else if (type == 1) {
        return <div className={`${styles.type} ${styles.type1}`}>
            <Return {...{ setType }} />
            <button onClick={e => {
                e.preventDefault();
                submit({ ...submitProps, ohddul: 1 });
            }} className={styles.up}>
                오른다 <span className='mh'>(F9)</span>
            </button>
            <button onClick={e => {
                e.preventDefault();
                submit({ ...submitProps, ohddul: -1 });
            }} className={styles.down}>
                떨어진다 <span className='mh'>(F10)</span>
            </button>
        </div>;
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
    );
}