import toggleOnPageChange from '#/toggle';
import styles from '$/Base/Fold.module.scss';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Fold = ({ head, body, name, view, setView }) => {
    if (!view && !setView) {
        [view, setView] = useState(false);
    }
    toggleOnPageChange(useRouter(), setView);
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
            <div className={`${styles.content} ${view ? styles.view : ''}`}>
                <table>
                    <thead>{head}</thead>
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