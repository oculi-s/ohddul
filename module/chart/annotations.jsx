import { Div, Per } from '@/module/ba';
import scss from '$/variables.module.scss';

export function maxPoint({ max, i, d, last, len }) {
    return ({
        type: 'label',
        color: scss.red,
        backgroundColor: scss.bgBright,
        borderRadius: 10,
        content: `${max}\n(${Per(max, last)})`,
        font: { size: 14, family: 'sans-serif' },
        position: {
            x: i * 2 <= len ? 'start' : 'end',
            y: 'center'
        },
        xValue: d,
        yValue: max,
        yAdjust: 5,
    });
}

export function minPoint({ min, i, d, last, len }) {
    return ({
        type: 'label',
        color: scss.blue,
        backgroundColor: scss.bgBright,
        borderRadius: 10,
        style: { opacity: .5 },
        content: `${min}\n(${Per(min, last)})`,
        font: { size: 14, family: 'sans-serif' },
        position: {
            x: i * 2 <= len ? 'start' : 'end',
            y: 'center'
        },
        xValue: d,
        yValue: min,
        yAdjust: -5,
    });
}
