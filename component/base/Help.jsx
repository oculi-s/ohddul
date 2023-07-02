import styles from '@/styles/Base/Help.module.scss';
import { innerText } from '#/_base';
import { useEffect, useRef, useState } from 'react';

const setDirWidth = ({ ref, dir, setDir }) => {
    var { left, right } = ref?.current?.getBoundingClientRect();
    const width = window?.innerWidth;
    left = Math.max(left, 20);
    right = Math.min(right, width - 20);
    ref.current.style.width = Math.max(right - left) + 'px';
    var { left, right } = ref?.current?.getBoundingClientRect();
    if (width < right) {
        setDir('left');
    } else if (left < 0) {
        setDir('right');
    }
}

const Help = ({ data, span, title }) => {
    const [dir, setDir] = useState('right');
    const ref = useRef();
    const inner = data || span;
    if (!innerText(inner)) return <></>;
    useEffect(() => {
        setDirWidth({ ref, dir, setDir })
    }, [data])
    const innerData = <span className={`${styles.help} ${styles[dir]}`}
        onMouseDown={() => { setDirWidth({ ref, dir, setDir }) }}>
        <span className='fa fa-question-circle'></span>
        <dialog ref={ref}>
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
    </span>
    if (span)
        return innerData;
    return (
        <div className={`${styles.wrap}`}>
            {innerData}
        </div>
    )
}
export default Help;