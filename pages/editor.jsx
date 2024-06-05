import styles from '$/Editor.module.scss';
import { MustLogin } from "@/components/base/Kakao";
import { useState } from "react";

export function getServerSideProps(ctx) {
    const props = {};
    return { props };
}

export default function Editor({ session }) {
    const [type, setType] = useState(0);

    if (!session) return <MustLogin />
    if (type == 0) {
        return <div className={styles.box}>
            <button onClick={e => setType(1)}>
                Editor
            </button>
            <button onClick={e => setType(2)}>
                HTML
                <span className="fa fa-code"></span>
            </button>
            <button onClick={e => setType(3)}>
                MarkDown
                <span className="fa fa-hashtag"></span>
            </button>
        </div>
    } else if (type == 1) {

    }
}