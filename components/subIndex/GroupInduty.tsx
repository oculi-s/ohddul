import { ToggleTab } from '@/components/base/ToggleTab';
import TotalGroupTree from '@/components/chart/TotalGroupTreeMap';
import TotalIndutyTree from '@/components/chart/TotalIndutyTreeMap';
import { TotalTreeType } from '@/utils/type/chartTree';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

export default function GroupInduty({ tree }: {
    tree: TotalTreeType
}) {

    return <div className='h-[600px] w-full p-0.5 gap-0.5 flex flex-col'>
        <Link
            className='flex items-center gap-1 bg-trade-700 px-5 py-3'
            href={'/stock/sum'}>
            <h3>오늘의 시가총액</h3>
            <FaChevronRight />
        </Link>
        <div className='bg-trade-700 w-full h-full p-3'>
            <ToggleTab
                names={['그룹', '업종']}
                datas={[
                    <TotalGroupTree tree={tree} key={1} />,
                    <TotalIndutyTree tree={tree} key={2} />
                ]}
            />
            <div className='absolute bottom-0 right-0'>클릭하시면 종목/전체가 전환됩니다.</div>
        </div>
    </div>
}
