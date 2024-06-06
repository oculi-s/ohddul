import IndexLine from '@/components/chart/IndexLine';
import { Color, Div, parseFix, Per } from '@/module/ba';
import dt from '@/module/dt';
import { getMaData } from '@/module/filter/priceAvg';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Index({ data, last, prev, count, name, loading }) {
    const { avg60, top60, bot60 } = getMaData(data);
    last = last[name];
    prev = prev[name];
    const up = count?.up[name];
    const down = count?.down[name];
    const total = count?.all[name];
    return <div className='relative h-[350px] p-3 bg-trade-700'>
        <div className='flex justify-between z-10 relative'>
            <div className='flex flex-col gap-1'>
                <div className='flex gap-1 bg-trade-500 bg-opacity-70 px-3 rounded-full'>
                    <span>{name == 'kospi' ? '코스피' : '코스닥'}</span>
                    <span>{parseFix(last, 1)}</span>
                    <span className={Color(last - prev)}>
                        ({Per(last, prev)})
                    </span>
                </div>
                <div className='flex gap-1 bg-trade-500 bg-opacity-70 px-2 rounded-full text-sm justify-center'>
                    <div className='flex gap-0.5'>
                        <div>%B</div>
                        <div className='text-trade-50'>{Div(last - bot60, top60 - bot60, 1)}</div>
                    </div>
                    <div className='flex gap-0.5'>
                        <div>BW</div>
                        <div className='text-trade-50'>{Div(top60 - bot60, last, 1)}</div>
                    </div>
                </div>
            </div>
            <div className='flex gap-1 items-center relative rounded-full overflow-hidden px-3 h-5'>
                <div className='absolute top-0 left-0 bg-red-500 opacity-20 z-0 h-full' style={{ width: Div(up, total) }}></div>
                <div className='absolute top-0 right-0 bg-blue-500 opacity-20 z-0 h-full' style={{ width: Div(down, total) }}></div>
                <FaChevronUp className='text-red-500' />
                <span>{up}</span>
                <span> ({Div(up, total)})</span>
                <FaChevronDown className='text-blue-500' />
                <span>{down}</span>
                <span> ({Div(down, total)})</span>
            </div>
        </div>
        <div className='absolute left-0 top-0 z-0 w-full h-full'>
            <IndexLine {...{
                data, addBollinger: true,
            }} load={loading} />
        </div>
    </div>
}

const Market = ({ market, count }) => {
    const [loading, setLoading] = useState<Boolean>(true);
    useEffect(() => {
        if (market && count) setLoading(false);
    }, [market, count])
    const kospi = market?.kospi?.qsort(dt.sort);
    const kosdaq = market?.kosdaq?.qsort(dt.sort);
    const last = { kospi: kospi?.[0]?.c, kosdaq: kosdaq?.[0]?.c };
    const prev = { kospi: kospi?.[1]?.c, kosdaq: kosdaq?.[1]?.c };
    const props = { last, prev, count };
    return (
        <div className='grid lg:grid-cols-2 gap-0.5 p-0.5'>
            <Index {...props} data={kospi} name={'kospi'} loading={loading} />
            <Index {...props} data={kosdaq} name={'kosdaq'} loading={loading} />
            <div className='absolute right-0 bottom-0'>* 기준일 : {kospi?.[0]?.d}</div>
        </div>
    )
}

export default Market;