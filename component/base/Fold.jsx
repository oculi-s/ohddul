import toggleOnPageChange from '#/toggle';
import styles from '$/Base/Fold.module.scss';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

const Fold = ({ head, colgroup, body, name, view, setView }) => {
    const ref = useRef();
    if (!view && !setView) {
        [view, setView] = useState(false);
    }
    toggleOnPageChange(useRouter(), setView);
    const height = ref.current?.offsetHeight + 20;
    return (
        <>
            <div className={styles.title}>
                <div className={styles.name}>{name}</div>
                <div className={styles.btn}
                    onClick={e => setView(!view)}
                >
                    [펼치기 / 접기]
                </div>
            </div>
            <div
                className={styles.content}
                style={{
                    maxHeight: view ? height : 0,
                    transition: `max-height ${height / 10000}s ease-in`
                }}
            >
                <table
                    className={colgroup ? 'fixed' : ''}
                    ref={ref}
                >
                    {colgroup ? colgroup : ''}
                    {head ? <thead>{head}</thead> : ''}
                    {body?.type == 'tbody' ?
                        body :
                        <tbody>{body}</tbody>
                    }
                </table>
            </div>
        </>
    )

}

export default Fold;