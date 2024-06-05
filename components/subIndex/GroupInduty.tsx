import { ToggleTab } from '@/components/base/ToggleTab';
import TotalGroupTree from '@/components/chart/TotalGroupTreeMap';
import TotalIndutyTree from '@/components/chart/TotalIndutyTreeMap';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

export default function GroupInduty(props) {
    return <div className='h-[600px] w-full p-0.5 gap-0.5'>
        <Link
            className='flex items-center gap-1 bg-trade-700 px-5 py-3'
            href={'/stock/sum'}>
            <h3>오늘의 시가총액</h3>
            <FaChevronRight />
        </Link>
        <div className='bg-trade-700 w-full h-full'>
            <ToggleTab
                names={['그룹', '업종']}
                datas={[
                    <div key={1} className='h-full w-full'>
                        <TotalGroupTree {...props} />
                    </div>,
                    <div key={2} className='h-full w-full'>
                        <TotalIndutyTree {...props} />
                    </div>
                ]}
            />
            <p className='des'>클릭하시면 종목/전체가 전환됩니다.</p>
        </div>
    </div>
}
