/**
 * 외부 라이브러리 없이 donut 차트를 만드는 함수
 * 
 * 도무지 도넛 조각을 만들 방법이 없어서 clip-path polygon 등등을 이용해 시도중
 */

import React, { useState } from 'react';
import styles from '$/temp.module.scss';
import { Div } from '@/module/ba';

const data = [
    { value: 30, color: 'red' },
    { value: 50, color: 'blue' },
    { value: 20, color: 'green' },
];

const DonutChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const angle = data.map(e => 360 * e.value / total);

    const renderSection = (e, i) => {
        const isHovered = hoveredIndex == i;
        const a = angle[i];
        const d = a - angle[(i - 1 + data.length) % data.length];
        const k = Div(Math.sin(a) / Math.cos(d) / Math.sqrt(2), 1, 2);
        return (
            <div
                key={i}
                className={styles.circle}
                style={{
                    // background: `linear-gradient(${a}deg, #272b66 ${k}, transparent ${k}) 0 0`,
                    opacity: isHovered ? 0.7 : 1
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
            />
        );
    };

    return <div className={styles.chart}>
        <div className={styles.donut}>
            {data.map(renderSection)}
        </div>
        <div className={styles.center}></div>
    </div>

    return <div className={styles.chart}>{data.map(renderSection)}</div>;
};

export default DonutChart;
