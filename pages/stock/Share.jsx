import styles from '@/styles/Stock/Stock.module.scss';
import ShareChart from "@/component/chart/Share";
import { Div } from "@/module/ba";
import Help from '@/component/base/help';
import Link from 'next/link';

const nameDict = {
    "J.P.MORGANSECURITIESPLC": "J.P.모건",
    "TheCapitalGroupCompanies,Inc.": "Capital그룹"
}

const ShareTable = ({ meta, stockShare, stockMeta }) => {
    if (!stockShare) return;
    const amount = stockMeta?.amount;
    const total = amount;
    let res = 0;
    const data = stockShare?.map(e => {
        let { name, amount, date } = e;
        res += amount;
        let code = meta?.index[name];
        if (code) {
            name = <Link href={`/stock/${code}`}>{name}</Link>;
        } else if (nameDict[name]) {
            name = nameDict[name];
        }
        return <tr key={name}>
            <th>{name}</th><td>{Div(amount, total, 1)}</td>
            <td className={styles.date}>{date}</td>
        </tr>
    });
    return <div className={styles.shareTable}>
        <table>
            <thead>
                <tr>
                    <th>이름</th><th>지분</th>
                    <th>기준일<Help span={`작년 사업보고서의 데이터를 기준으로 하며, 제공된 데이터에 따라 현재 상황과 차이가 날 수 있습니다.`} /></th>
                </tr>
            </thead>
            <tbody>
                {data}
            </tbody>
            <tfoot>
                <tr>
                    <th>전체<Help span={'전체 주식발행량 대비 비율\n100%에 맞지 않는 경우 임직원의 보유주식 혹은 공시 기간에 따른 오차입니다.'} /></th>
                    <th>{Div(res, amount)}</th>
                    <th>-</th>
                </tr>
            </tfoot>
        </table>
    </div>
}

const ShareElement = (props) => {
    return <div>
        <h3>지분 차트</h3>
        <div className={styles.share}>
            <ShareChart {...props} />
            <ShareTable {...props} />
        </div>
    </div>
}

export default ShareElement;