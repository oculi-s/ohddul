import IndexLine from '@/components/chart/IndexLine';
import { Color, Div, parseFix, Per } from '@/module/ba';
import dt from '@/module/dt';
import { FetcherRead } from '@/module/fetcher';
import { getMaData } from '@/module/filter/priceAvg';
import countryName from '@/utils/country/countryName';
import { CountType, EcosType, MarketType } from '@/utils/type/marketData';
import { PriceCloseDailyType } from '@/utils/type/stock';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Flag from 'react-flagkit';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Index({ data, last, prev, count, name, className }: {
    data: PriceCloseDailyType[],
    name: 'kospi' | 'kosdaq';
    last: { kospi: number, kosdaq: number },
    prev: { kospi: number, kosdaq: number },
    count: CountType;
    className?: string
}) {
    data = data?.qsort(dt.sort);
    const { avg60, top60, bot60 } = getMaData(data);
    const lastPrice = last[name];
    const prevPrice = prev[name];
    const up = count?.up[name];
    const down = count?.down[name];
    const total = count?.all[name];
    return <div className={cn('relative h-[350px] p-3 bg-trade-700', className)}>
        <div className='flex flex-col gap-1 whitespace-pre z-10 relative w-fit'>
            <div className='flex gap-1 bg-trade-500 bg-opacity-70 px-3 rounded-full items-end'>
                <span>{name == 'kospi' ? '코스피' : '코스닥'}</span>
                <span>{parseFix(lastPrice, 1)}</span>
                <span className={cn(Color(lastPrice - prevPrice), 'text-sm')}>
                    ({Per(lastPrice, prevPrice)})
                </span>
            </div>
            <div className='flex gap-1 items-center relative rounded-full overflow-hidden px-3 h-5 text-xs'>
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
        <div className='flex gap-1 bg-trade-500 bg-opacity-70 px-2 rounded-full text-sm justify-center absolute left-3 bottom-3 z-10'>
            <div className='flex gap-0.5'>
                <div>%B</div>
                <div className='text-trade-50'>{Div(lastPrice - bot60, top60 - bot60, 1)}</div>
            </div>
            <div className='flex gap-0.5'>
                <div>BW</div>
                <div className='text-trade-50'>{Div(top60 - bot60, lastPrice, 1)}</div>
            </div>
        </div>
        <div className='absolute left-0 top-0 z-0 w-full h-full'>
            <IndexLine data={data} />
        </div>
    </div>
}

function Ecos({ className }: {
    className?: string
}) {
    const [cpiData, setCpiData] = useState<EcosType>();
    const [rateData, setRateData] = useState<EcosType>();
    const [loading, setLoading] = useState<boolean>(true);
    const [ppiData, setPpiData] = useState<EcosType>();
    const [selectView, setSelectView] = useState<boolean>(false);
    const [hovered, setHovered] = useState<string>('KR');

    const cpi = cpiData?.data;
    const ppi = ppiData?.data;
    const rate = rateData?.data;

    const [c1, setC1] = useState<string>('KR');
    const [c2, setC2] = useState<string>('US');
    useEffect(() => {
        FetcherRead('meta/ecos/cpi.json').then((res) => {
            setCpiData(res);
            FetcherRead('meta/ecos/rate.json').then((res) => {
                setRateData(res);
                setLoading(false);
            });
        });
        FetcherRead('meta/ecos/ppi.json').then((res) => {
            setPpiData(res);
        });
        return () => {
            setCpiData(undefined);
            setPpiData(undefined);
            setRateData(undefined);
        }
    }, []);

    const name = ['CPI (소비자물가지수)', 'PPI (생산자물가지수)', '기준금리'];
    return (
        <div className={cn('bg-trade-700 text-sm', className)}>
            <div className='flex justify-between p-3 items-center'>
                <div>물가지수 1년 비교</div>
                <div className='flex gap-1'>
                    <div className='relative'>
                        <Flag country={c2} onClick={() => setSelectView(!selectView)} className='w-4 cursor-pointer' />
                        <div className={cn('absolute top-5 right-0 bg-trade-500 rounded-md w-40 grid grid-cols-3 p-3', selectView ? 'block' : 'hidden')}>
                            <div className='col-span-3 text-center'>{countryName[hovered]}</div>
                            {Object.keys(countryName).map((c, i) => {
                                return <div
                                    key={i}
                                    onClick={() => { setC2(c); setSelectView(false) }}
                                    className='cursor-pointer hover:bg-trade-700 p-1'
                                    onMouseEnter={() => setHovered(c)}
                                >
                                    <Flag country={c} className='mx-auto' />
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <table className='text-right w-full'>
                <tbody>
                    {[cpi, ppi, rate].map((data, i) => {
                        return <>
                            <tr><th colSpan={4} className='text-left py-1 bg-trade-600'>{name[i]}</th></tr>
                            {[c1, c2].map((c, i) => {
                                let d = data?.[countryName[c]]?.slice(-13);
                                let d1 = d?.[0];
                                let d2 = d?.slice(-1)[0];
                                return (
                                    <tr key={i} className='*:py-1'>
                                        <th>
                                            <Flag country={c} className='mx-auto w-4' />
                                            <div className='text-xs text-center'>{d2?.d.slice(2)}</div>
                                        </th>
                                        <td>{d1?.v}</td>
                                        <td>{d2?.v}</td>
                                        <td className={Color(d2?.v, d1?.v)}>
                                            {Per(d2?.v, d1?.v)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </>
                    })}
                </tbody>
            </table>
        </div>
    )
}

const N = 200;
export default function Market() {
    const [market, setMarket] = useState<MarketType>();
    const [count, setCount] = useState<CountType>();
    const [kospi, kosdaq] = [market?.kospi, market?.kosdaq];
    useEffect(() => {
        FetcherRead("meta/light/market.json").then((res) => {
            res.kospi = res.kospi.slice(0, N);
            res.kosdaq = res.kosdaq.slice(0, N);
            setMarket(res);
        });
        FetcherRead("meta/light/updown.json").then((res) => {
            setCount(res);
        });
        return () => {
            setMarket(undefined);
            setCount(undefined);
        };
    }, []);
    const last = { kospi: kospi?.[0]?.c, kosdaq: kosdaq?.[0]?.c };
    const prev = { kospi: kospi?.[1]?.c, kosdaq: kosdaq?.[1]?.c };
    return (
        <div className='grid lg:grid-cols-8 gap-0.5 p-0.5 relative'>
            <Ecos className='lg:col-span-2' />
            <Index data={kospi} name={'kospi'} last={last} prev={prev} count={count} className='lg:col-span-3' />
            <Index data={kosdaq} name={'kosdaq'} last={last} prev={prev} count={count} className='lg:col-span-3' />
            <div className='absolute right-3 bottom-3 text-xs'>* 기준일 : {kospi?.[0]?.d}</div>
        </div>
    );
}