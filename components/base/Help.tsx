import styles from '$/Base/Help.module.scss';
import { innerText } from '@/module/data';
import { useEffect, useRef, useState } from 'react';

const setDirWidth = ({ ref }) => {
    const span = ref.current.span;
    const dialog = ref.current.dialog;
    if (!span || !dialog) return;
    var { left, right } = span?.getBoundingClientRect();
    const Width = window?.innerWidth;
    const width = Math.min(Width, 350);
    dialog.style.width = width + 'px';
    left = left - 175 + 5;
    right = right + 175 - 5;
    if (left < 0) {
        dialog.style.left = '20px';
        dialog.style.right = 'auto';
    } else if (Width - right < 0) {
        dialog.style.right = '20px'
        dialog.style.left = 'auto';
    } else {
        dialog.style.left = left + 'px';
        dialog.style.right = right + 'px'
    }
}

function Help({ data, span, title }: {
    data?: JSX.Element[];
    span?: JSX.Element | string;
    title?: string;
}) {
    const [hydrated, setHydrated] = useState(false);
    const ref = useRef({});
    const inner = data || span;
    useEffect(() => {
        if (!hydrated) {
            if (ref.current.span) {
                setDirWidth({ ref });
            }
            setHydrated(true);
        }
    });
    if (!innerText(inner)) return <></>;
    const innerData = <span
        ref={e => { ref.current.span = e; }}
        className={styles.help}
    >
        <span className={`fa fa-question-circle ${styles.question}`}>
            <span className={styles.arrow} />
        </span>
        <dialog ref={e => { ref.current.dialog = e; }}>
            <div>
                {title && <h4 className={styles.head}>{title}</h4>}
                {span && <span>{span}</span>}
                {data && <table>
                    <tbody>
                        {data}
                    </tbody>
                </table>}
            </div>
        </dialog>
    </span>;
    if (span)
        return innerData;
    return (
        <div className={`${styles.wrap}`}>
            {innerData}
        </div>
    );
}
export default Help;