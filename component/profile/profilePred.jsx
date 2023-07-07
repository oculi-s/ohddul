import styles from '$/Profile/Pred.module.scss';
import ToggleTab from "#/base/ToggleTab";
import { Color, Num, Per } from "@/module/ba";
import Link from "next/link";
import dt from '@/module/dt';

export function PredTable({ queue, meta, price }) {
    queue = queue?.map((e, i) => {
        const { t, c, d, o, pr, od, at } = e;
        return <tr key={`pred${i}`}>
            <th><Link href={`/stock/${c}`}>{meta[c]?.n}</Link></th>
            <td>{t == 'od' ? '오떨' : '가격'}</td>
            {t == 'pr'
                ? <>
                    <td>{dt.parse(at, 'M월D일')}</td>
                    <td>{Num(pr)}<span className='mh'>&nbsp;</span><br className='ph' />
                        <span className={Color(pr, o)}>({Per(pr, o)})</span>
                    </td>
                </>
                : <td colSpan={2}>
                    <span className={`fa fa-chevron-${od == 1 ? 'up red' : 'down blue'}`} />
                </td>
            }
            <td>{dt.parse(d, 'M월D일 HH:mm')}</td>
        </tr>;
    });
    return <table className={styles.queueTable}>
        <colgroup>
            <col width={'25%'} />
            <col width={'15%'} />
        </colgroup>
        <thead>
            <tr>
                <th>종목</th>
                <th><span className='mh'>예측</span>종류</th>
                <th colSpan={2}>예측</th>
                <th><span className='mh'>예측</span>시간</th>
            </tr>
        </thead>
        <tbody>{queue}</tbody>
    </table>
}