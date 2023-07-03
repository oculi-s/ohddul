import dt from '@/module/dt';

export function Last({ data }) {
    return <p className="des">* 마지막 업데이트 : {dt.toString(data?.last, { time: 1, day: 1 })}</p>
}