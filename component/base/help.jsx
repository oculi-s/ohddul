import styles from '@/styles/Base/Help.module.scss';
import { innerText } from '@/component/_base';
import { useRef, useState } from 'react';

const adjustDir = ({ ref, dir, setDir }) => {
    const { left, right } = ref?.current?.getBoundingClientRect();
    const width = window?.innerWidth;
    if (width < right) {
        setDir('left');
    } else if (left < 0) {
        setDir('right');
    }
    console.log(left, right, width, dir);
}

const Help = ({ des, data, span }) => {
    const [dir, setDir] = useState('right');
    const ref = useRef();
    const inner = data || span;
    if (!innerText(inner)) return <></>;
    if (span) {
        return (
            <span className={`${styles.help} ${styles[dir]}`}
                onMouseDown={() => { adjustDir({ ref, dir, setDir }) }}>
                <span className='fa fa-question-circle'>{des}</span>
                <dialog ref={ref}>
                    <span>
                        {span}
                    </span>
                </dialog>
            </span>
        )
    }
    return (
        <div className={`${styles.wrap}`}>
            <span className={`${styles.help} ${styles[dir]}`}
                onMouseDown={() => { adjustDir({ ref, dir, setDir }) }}>
                <span className='fa fa-question-circle'>{des}</span>
                <dialog ref={ref}>
                    <div>
                        <table>
                            <tbody>
                                {data}
                            </tbody>
                        </table>
                    </div>
                </dialog>
            </span>
        </div>
    )
}
export default Help;