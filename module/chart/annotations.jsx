import { Div, Per } from '@/module/ba';
import scss from '@/styles/variables.module.scss';

export function maxPoint({ max, i, last, len }) {
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
        xValue: i,
        yValue: max,
        yAdjust: 5,
    });
}

export function minPoint({ min, i, last, len }) {
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
        xValue: i,
        yValue: min,
        yAdjust: -5,
    });
}
