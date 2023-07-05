import dt from '@/module/dt';
import styles from '$/Base/base.module.scss'
import { useState } from "react"

export function LastUpdate({ data }) {
    let last = data?.last;
    return <p className="des">* 마지막 업데이트 : {dt.toString(last, { time: 1, day: 1 })}</p>
}

export function LastData({ data }) {
    let last = (data?.last || data?.data || data || [])?.find(e => true)?.d;
    return <p className="des">* 기준일 : {dt.toString(last, { time: 1, day: 1 })}</p>
}

export function SignError({ on, code }) {
    const msg = {
        0: '',
        400: "ID를 입력해주세요.",
        401: "패스워드를 입력해주세요.",
        402: "패스워드 형식이 맞지 않습니다.",
        403: "확인 패스워드가 같지 않습니다.",
        404: "잘못된 ID/비밀번호입니다.",
        300: "이미 존재하는 ID입니다.",
    };
    return <p className={`red ${styles.error}`} style={{ opacity: on }}>
        {msg[code]}
    </p>;
}

export function Collapse({ title, children }) {
    const [open, setOpen] = useState(false);
    return <div className={`${styles.collapse} ${open ? styles.open : ''}`}>
        <button onClick={e => setOpen(!open)}>
            {title || '펼쳐보기'} <span className='fa fa-chevron-right'></span>
        </button>
        <div><div>
            {children}
        </div></div>
    </div>
}

export const Loading = (props) => {
    return <div className={styles.spinner}>
        <div />
    </div>
}