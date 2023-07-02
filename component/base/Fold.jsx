import toggleOnPageChange from '#/toggle';
import styles from '@/styles/Base/Fold.module.scss';
import { useState } from 'react';

const Fold = ({ head, body, name, router, folded = true }) => {
    const [view, setView] = useState(!folded);
    toggleOnPageChange(router, setView);
    return (
        <>
            <div className={styles.title}>
                <div className={styles.name}>{name}</div>
                <div className={styles.btn}
                    onClick={e => { setView(!view) }}
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