import { ToggleTab } from '@/components/base/ToggleTab';
import FavStar from '@/components/baseStock/FavStar';
import '@/module/array';
import { Div } from '@/module/ba';
import { FetcherRead } from '@/module/fetcher';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Inner({ share }: {
    share?: { n: string, p: number, a: number, t: number, d: string, code: string }[]
}) {
    share?.qsort((b, a) => a?.a * b?.t - b?.a * a?.t);
    share?.qsort((b, a) => a.p - b.p);
    return <div>
        <table>
            <colgroup>
                <col width={'30%'} />
                <col width={'15%'} />
                <col width={'15%'} />
                <col width={'15%'} className='mh' />
            </colgroup>
            <thead className='bg-trade-600'>
                <tr>
                    <th>종목</th>
                    <th>비중</th>
                    <th>시총대비</th>
                    <th className='mh'>기준일</th>
                </tr>
            </thead>
            <tbody>
                {share?.map((e, i) => {
                    return <tr key={i}>
                        <th className='text-left'>
                            <div className='flex items-center gap-2'>
                                <FavStar code={e?.code} />
                                <Link href={`/stock/${e?.n}`}>{e?.n}</Link>
                            </div>
                        </th>
                        <td>{Div(e.p, 1, 2)}</td>
                        <td>{Div(e?.a, e?.t, 1)}</td>
                        <td className='des mh'>{e?.d}</td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>;
}

const List = {
    연기금: ['국민연금', '산업은행'],
    기관: ['KB금융', '신한지주', '미래에셋증권', '삼성증권', '한국금융지주', '메리츠금융지주', 'OK저축은행', 'VIP자산운용'],
    외인: ['JP Morgan', 'MorganStanley', 'BlackRock', 'Capital', 'CreditSuiss', 'Fidelity']
}
export default function MajorShare() {
    const [major, setMajor] = useState();

    async function fetchMajor() {
        const major = {};
        for await (const e of Object.values(List).flat()) {
            const res = await FetcherRead(`share/${e}.json`);
            major[e] = res.data.slice(0, 10);
        }
        return major;
    }
    useEffect(() => {
        fetchMajor().then((res) => {
            setMajor(res);
        });
        return () => {
            setMajor(undefined);
        };
    }, [])
    const names = Object.keys(List);
    return <div className='grid lg:grid-cols-3 gap-0.5 p-0.5'>
        <div className='flex justify-between items-end lg:col-span-3 px-5 bg-trade-700 py-3'>
            <h3>주요기관의 선택</h3>
            <div className='des'>
                <Link href={'/board'}>
                    추가요청하기&nbsp;
                    <span className='fa fa-caret-right'></span>
                </Link>
            </div>
        </div>
        {Object.keys(List).map(e => {
            const datas = List[e]?.map((e, i) =>
                <Inner share={major?.[e]} key={i} />
            )
            return <div className='p-3 bg-trade-700'>
                <ToggleTab names={List[e]} datas={datas} />
            </div>
        })}
    </div>
}