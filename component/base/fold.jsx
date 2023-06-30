import toggleOnPageChange from '#/toggle';
import styles from '@/styles/Fold.module.scss';
import { useState } from 'react';

const Fold = ({ head, body, name, router, folded = true }) => {
    const [view, setView] = useState(!folded);
    toggleOnPageChange(router, setView);
    return (
        <>
            <div
                className={`${styles.title} ${view ? styles.view : ''}`}
                onClick={e => { setView(!view) }}
            >{name}</div>
            <div className={styles.content}>
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