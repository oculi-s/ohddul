import styles from '$/Stock/Stock.module.scss';
import ShareDonut from "#/chart/ShareDonut";
import { Div } from "@/module/ba";
import Help from '#/base/Help';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const NameDict = {
    "J.P.MORGANSECURITIESPLC": "JP모건",
    "JPMorganAssetManagement(AsiaPacific)Limited": "JP모건",
    "국민연금공단": "국민연금",
    "TheCapitalGroupCompanies,Inc.": "Capital그룹",
    "BlackRockFundAdvisors": "BlackRock",
    "MacquarieInvestmentManagementBusinessTrust": "Macquarie",
    "CreditSuisseGroupAG": "CreditSuiss",
    "MORGANSTANLEY&COINTLPLC": "MorganStanley",
    "국민은행": "KB금융",
    "미래에셋자산운용": "미래에셋증권",
    "한국투자증권": "한국금융지주",
    "KB자산운용": "KB금융",
    "현대자동차": "현대차",
}

const ShareTable = ({ meta, stockShare, stockMeta }) => {
    stockShare = stockShare?.data;
    if (!stockShare) return;
    const [data, setData] = useState();
    const [foot, setFoot] = useState();
    useEffect(() => {
        if (stockShare?.length) {
            const amount = stockMeta?.a;
            const total = amount;
            let res = 0;
            if (stockShare?.length) {
                const data = stockShare?.map((e, i) => {
                    let { name, amount, date } = e;
                    res += amount;
                    if (NameDict[name]) name = NameDict[name];
                    const code = meta?.index[name];
                    if (code) {
                        name = <Link href={`/stock/${code}`}>{name}</Link>;
                    }
                    return <tr key={i}>
                        <th>{name}</th><td>{Div(amount, total, 1)}</td>
                        <td className={styles.date}>{date}</td>
                    </tr>
                });
                setData(data);
                setFoot(Div(res, amount));
            }
        }
    }, [stockShare])
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
                    <th>전체
                        <Help
                            title={'전체 주식발행량 대비 비율'}
                            span={'100%에 맞지 않는 경우 임직원의 보유주식 혹은 공시 기간에 따른 오차입니다.'}
                        />
                    </th>
                    <th>{foot}</th>
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
            <ShareDonut {...props} />
            <ShareTable {...props} />
        </div>
    </div>
}

export default ShareElement;