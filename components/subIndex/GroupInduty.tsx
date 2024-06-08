import { TotalGroupTree, TotalIndutyTree } from '#/chart/TotalTreeMap';
import { ToggleTab } from '@/components/base/ToggleTab';
import { FetcherRead } from '@/module/fetcher';
import { TotalTreeType } from '@/utils/type/chartTree';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";
import { FaChevronRight } from 'react-icons/fa';
import { RxEnterFullScreen } from "react-icons/rx";

export default function GroupInduty() {
    const [tree, setTree] = useState<TotalTreeType>();
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [stock, setStock] = useState<boolean>(false);
    const [n, setN] = useState<number>(-1);

    useEffect(() => {
        FetcherRead("meta/light/tree.json").then((res) => {
            setTree(res);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) setN(8);
            else setN(-1);
        });
        if (window.innerWidth < 768) setN(8);
        else setN(-1);

        return () => {
            setTree(undefined);
            setN(-1);
            window.removeEventListener('resize', () => { });
        };
    }, []);

    return <div className='max-lg:h-[600px] lg:h-[800px] w-full p-0.5 gap-0.5 flex flex-col'>
        <Link
            className='flex items-center gap-1 bg-trade-700 px-5 py-3'
            href={'/stock/sum'}>
            <h3>오늘의 시가총액</h3>
            <FaChevronRight />
        </Link>
        <div className='bg-trade-700 w-full h-full p-3'>
            <ToggleTab
                names={['그룹', '업종']}
                right={<div className={cn('flex gap-1 text-lg items-center', {
                    'fixed left-0 z-50 w-full justify-center gap-5 top-5': fullScreen,
                })}>
                    <BsFillGridFill className='cursor-pointer' onClick={e => { setStock(false) }} title='그룹보기' />
                    <BsFillGrid3X3GapFill className='cursor-pointer' onClick={e => { setStock(true) }} title='종목보기' />
                    <RxEnterFullScreen className='cursor-pointer' onClick={e => { setFullScreen(!fullScreen) }} title='전체화면' />
                </div>}
                datas={[
                    <TotalGroupTree tree={tree} key={1} fullScreen={fullScreen} stock={stock} n={n} />,
                    <TotalIndutyTree tree={tree} key={2} fullScreen={fullScreen} stock={stock} n={n} />,
                ]}
            />
            <div className='absolute bottom-0 right-0'>클릭하시면 종목/전체가 전환됩니다.</div>
        </div>
    </div>
}
