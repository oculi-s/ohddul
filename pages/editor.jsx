import { MustLogin } from "#/base/Kakao";
import { useState } from "react";
import styles from '$/Editor.module.scss'

export function getServerSideProps(ctx) {
    const props = {};
    return { props };
}

export default function Editor({ session }) {
    const [type, setType] = useState(0);

    return <>준비중입니다.</>;
    if (!session) return <MustLogin />

    if (type == 0) {
        return <div className={styles.box}>
            <button onClick={e => setType(1)}>
                Editor
            </button>
            <button onClick={e => setType(2)}>
                HTML
            </button>
            <button onClick={e => setType(3)}>
                MarkDown
            </button>
        </div>
    } else if (type == 1) {

    }
}