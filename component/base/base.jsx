import dt from '@/module/dt';

export function Last({ data }) {
    let last = data?.last;
    if (last < 1e10) last *= 1000;
    return <p className="des">* 마지막 업데이트 : {dt.toString(last, { time: 1, day: 1 })}</p>
}