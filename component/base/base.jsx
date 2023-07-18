import dt from '@/module/dt';
import styles from '$/Base/base.module.scss'
import { useState } from "react"
import Image from 'next/image';
import { Int } from '@/module/ba';

export function LastUpdate({ last }) {
    last = last || 1;
    if (last < 2e9) last *= 1000;
    return <p className="des">* 마지막 업데이트 : {dt.toString(last, { time: 1, day: 1 })}</p>
}

export function LastData({ data }) {
    let last = (data?.last || data?.data || data || [])?.find(e => true)?.d || 1;
    return <p className="des">* 기준일 : {dt.toString(last, { time: 1, day: 1 })}</p>
}

export function Logo({ size = 32 }) {
    return <Image src='/android-chrome-512x512.png'
        width={size}
        height={size}
        alt='오떨 로고'
    />
}

export function Bar({ width = '0%' }) {
    return <div className={styles.bar} style={{ width }} />;
}

// export function SignError({ on, code }) {
//     const msg = {
//         0: '',
//         400: "ID를 입력해주세요.",
//         401: "패스워드를 입력해주세요.",
//         402: "패스워드 형식이 맞지 않습니다.",
//         403: "확인 패스워드가 같지 않습니다.",
//         404: "잘못된 ID/비밀번호입니다.",
//         300: "이미 존재하는 ID입니다.",
//     };
//     return <p className={`red ${styles.error}`} style={{ opacity: on }}>
//         {msg[code]}
//     </p>;
// }

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

export const Loading = ({
    left = 'auto', right = 10, size = 60
}) => {
    return <div
        className={styles.spinner}
        style={{
            marginRight: right,
            marginLeft: left,
        }}
    >
        <div
            style={{
                width: size, height: size,
                borderWidth: Int(size / 6),
            }}
        />
    </div>
}

export function getPageSize() {
    const data = document.getElementById("__NEXT_DATA__").text;
    const len = (new TextEncoder().encode(data)).length;
    if (len > 1024 * 1024) console.log((len / 1024 / 1024).toFixed(1) + ' MB');
    else if (len > 1024) console.log((len / 1024).toFixed(1) + ' KB');
    else console.log(len + ' B');
}

export function Ban() {
    return <div className={styles.ban}>
        거래정지 종목입니다.
    </div>
}