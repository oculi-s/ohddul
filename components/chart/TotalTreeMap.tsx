import '@/module/array';
import { parseFix } from '@/module/ba';
import colors from '@/module/colors';
import { GroupBg } from '@/public/group/color';
import GroupImg from '@/public/group/Default';
import { TotalTreeType } from '@/utils/type/chartTree';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import squarify from 'squarify';

const customGroupStyle = {
    '카카오': 'text-gray-700 font-bold',
    '영풍': 'text-gray-700 font-bold',
}

export function StockTreeElement({
    x0, y0, x1, y1, c, g, n, value: v, index, isInduty
}: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    c: boolean;
    g: string;
    n: string;
    value: number;
    index: { [key: string]: string };
    isInduty?: boolean;
}) {
    if (!index) return;
    const gn = index[g];
    const fs = Math.sqrt((x1 - x0) * (y1 - y0));

    return <div
        className={cn('absolute hover:brightness-125 bg-trade-700')}
        style={{
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${x1 - x0}%`,
            height: `${y1 - y0}%`,
        }}
    >
        <div className='w-full h-full relative'>
            <div
                className={cn('absolute w-full h-full', {
                    'opacity-50': !c,
                    'opacity-70': c,
                })}
                style={{ backgroundColor: GroupBg[gn] || colors[g] }}
            />
            <Link
                href={c ? `/stock/${n}` : `/group/${gn}`}
                className='w-full h-full flex flex-col justify-center items-center relative text-gray-300'
            >
                <div className='w-full h-full flex flex-col justify-center items-center' onClick={e => { e.stopPropagation(); }}>
                    {c
                        ? <div
                            className={cn('w-4/5 text-center whitespace-pre overflow-ellipsis overflow-hidden', customGroupStyle[gn])}
                            style={{ fontSize: fs }}>
                            {n}
                        </div>
                        : isInduty
                            ? <div className='text-gray-300' style={{ fontSize: fs }}>{gn}</div>
                            : <div className='h-1/2 w-4/5 text-center'>
                                <GroupImg name={gn} className='flex justify-center' />
                            </div>
                    }
                    <div
                        style={{ fontSize: fs * 0.6 }}
                        className={cn(customGroupStyle[gn])}
                    >
                        ({parseFix(v / 10, 1)}%)
                    </div>
                </div>
            </Link>
        </div>
    </div>;
}

export function TotalGroupTree({ tree, fullScreen, stock, n }: {
    tree: TotalTreeType;
    fullScreen?: boolean;
    stock: boolean;
    n?: number;
}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!tree?.group) return;
        setData(tree?.group
            ?.slice(0, n)
            ?.map(e => {
                const t = { ...e };
                if (!stock) delete t.children;
                return t;
            }));
    }, [stock, tree]);

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const index = tree?.index?.group;

    return (
        <div
            className={cn('w-full h-full relative', {
                '!fixed left-0 top-0 z-40': fullScreen
            })}
        >
            {squarify(data, box)?.map((e, i) => <StockTreeElement {...e} index={index} c={stock} key={i} />)}
        </div>
    );
}


export function TotalIndutyTree({ tree, fullScreen, stock, n }: {
    tree: TotalTreeType;
    fullScreen?: boolean;
    stock: boolean;
    n?: number;
}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!tree?.induty) return;
        setData(tree?.induty
            ?.slice(0, n)
            ?.map(e => {
                const t = { ...e };
                if (!stock) delete t.children;
                return t;
            }));
    }, [stock, tree]);

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const index = tree?.index?.induty;

    return (
        <div
            className={cn('w-full h-full relative', {
                '!fixed left-0 top-0 z-40': fullScreen
            })}
        >
            {squarify(data, box)?.map((e, i) => <StockTreeElement {...e} index={index} c={stock} key={i} isInduty={true} />)}
        </div>
    );
}
