import ToggleTab from '#/base/ToggleTab';
import styles from '$/Index.module.scss';
import { Div } from '@/module/ba';
import Link from 'next/link';
import '@/module/array';
import FavStar from '#/baseStock/FavStar';
import NameDict from '#/stockData/NameDict';

/**
 * 미리 데이터 저장해서 만들어놔야함
 */
export default function MajorShare({ major }) {
    const names = Object.keys(major)?.map(e => NameDict[e] || e);
    const datas = Object.entries(major)?.map(([_, share], i) => {
        share?.qsort((b, a) => a?.a * b?.t - b?.a * a?.t);
        share?.qsort((b, a) => a.p - b.p);
        return <div key={i}>
            <table className={`${styles.major} fixed`}>
                <colgroup>
                    <col width={'30%'} />
                    <col width={'15%'} />
                    <col width={'15%'} />
                    <col width={'15%'} className='mh' />
                </colgroup>
                <thead>
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
                            <th>
                                <FavStar code={e?.code} />
                                <Link href={`/stock/${e?.n}`}>{e?.n}</Link>
                            </th>
                            <td>{Div(e.p, 1, 2)}</td>
                            <td>{Div(e?.a, e?.t, 1)}</td>
                            <td className='des mh'>{e?.d}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    });
    return <div className={styles.area}>
        <h3>주요기관의 선택</h3>
        <p className='des'><Link href={'/idea'}>
            추가요청하기&nbsp;
            <span className='fa fa-caret-right'></span>
        </Link></p>
        <ToggleTab names={names} datas={datas} />
    </div>
}