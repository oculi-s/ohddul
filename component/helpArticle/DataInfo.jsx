import Link from "next/link";
import dt from '@/module/dt';
import Help from '#/base/Help';
import styles from '$/Help/Help.module.scss';
import { Div } from '@/module/ba';
import { Collapse } from "#/base/base";
import { H3, H4 } from "@/module/help/header";
import { Stock } from "@/pages/help";

function InfoBlock1({
    cnt, earn, none
}) {
    const YEARS = dt.YEARS;
    const len = YEARS.length;
    return <div className={styles.box}>
        <H3>데이터 정보</H3>
        <H4>제공데이터</H4>
        전체 {cnt}개의 종목에 대한 정보가 제공되고 예측이 가능합니다.
        <table><tbody>
            <tr>
                <th>가격</th>
                <td>
                    <span className='red'>{cnt - none?.price?.length}</span>
                    ({Div(cnt - none?.price?.length, cnt)}) 개 종목의 가격정보가 제공됩니다.
                </td>
            </tr>
            <tr>
                <th>실적</th>
                <td>
                    <span className='red'>{cnt - none?.earn?.length}</span>
                    ({Div(cnt - none?.earn?.length, cnt)}) 개 종목의 실적정보가 제공됩니다.
                </td>
            </tr>
            <tr>
                <th>지분</th>
                <td>
                    <span className='red'>{cnt - none?.share?.length}</span>
                    ({Div(cnt - none?.share?.length, cnt)}) 개 종목의 지분정보가 제공됩니다.
                </td>
            </tr>
        </tbody></table>
        모든 가격 정보는 장 마감 이전에는 <span className="red">전일 종가</span>를 기준으로 제공됩니다.
        업데이트는 <span className="red">장 마감 이후 30분 이내로</span> 진행되며 업데이트 이후에는 당일 종가가 제공됩니다.
        <H4>실적데이터 상세</H4>
        실적은 별도재무제표 기준이며, 10년치 데이터가 다음과 같이 제공됩니다.
        외부에서 제공되지 않는 2014년 데이터와 아직 발표되지 않은 실적 정보는 확인하실 수 없습니다.
        <div className={styles.inline}>
            <table><tbody>
                {YEARS.slice(0, len / 2).map(year => {
                    const yearCount = earn[year];
                    return <tr key={year}><th>{year}</th>
                        {yearCount.map((c, i) => (
                            <td key={`${year}_${i}`}>
                                <span>{i + 1}Q <span className={styles.per}>({Div(c, cnt)})</span></span>
                                <div className={styles.bar} style={{ width: Div(c, cnt) }}></div>
                            </td>
                        ))}
                    </tr>;
                })}
            </tbody></table>
            <table><tbody>
                {YEARS.slice(len / 2).map(year => {
                    const yearCount = earn[year];
                    return <tr key={year}><th>{year}</th>
                        {yearCount.map((c, i) => (
                            <td key={`${year}_${i}`}>
                                <span>{i + 1}Q <span className={styles.per}>({Div(c, cnt)})</span></span>
                                <div className={styles.bar} style={{ width: Div(c, cnt) }}></div>
                            </td>
                        ))}
                    </tr>;
                })}
            </tbody></table>
        </div>
        {/* <H4>데이터 출처</H4> */}
        {/* <p>데이터는 <Link href='https://opendart.fss.or.kr' target='blank'>openDart</Link>와 <Link href='https://data.go.kr' target='blank'>공공데이터포털</Link>, <Link href="https://apiportal.koreainvestment.com/">KIS developers</Link>를 이용합니다.</p> */}
    </div>;
}

function InfoBlock2({ none }) {
    const SPAC = none?.price?.filter(e => e[1]?.includes('스팩'));
    const notSPAC = none?.price?.filter(e => !e[1]?.includes('스팩'));
    return <div className={styles.box}>
        <H3>가격정보가 제공되지 않은 종목 ({none?.price?.length}개)</H3>
        <H4>합병이 예정된 스팩주
            <Help
                title={'기업인수목적회사'}
                span={<>
                    2000억의 시총을 가지고 비상장 회사를 물색하여
                    회사의 지분을 매입한 뒤 사명을 변경하는 방식으로
                    우회상장하는 목적으로 설립된 회사
                </>} /> ({SPAC?.length}개)</H4>
        <Collapse>{SPAC?.map(Stock)}</Collapse>
        <H4>거래불가({notSPAC?.length}개)</H4>
        <Collapse>{notSPAC?.map(Stock)}</Collapse>
    </div>;
}

function InfoBlock3({ none }) {
    const finRegex = new RegExp('투자|금융|자산|인베스트|증권|생명|신탁|리츠|맥쿼리|보험|뱅크|화재|은행|카드|벤처|해상|IB|ANKOR|패러랠|케이|캐피탈|창투|맵스|코리안|종금|신한|스퀘어');
    const SPAC = none?.earn?.filter(e => e[1]?.includes('스팩'));
    const notSPAC = none?.earn?.filter(e => !e[1]?.includes('스팩'));
    const finance = notSPAC?.filter(e => finRegex.test(e[1]));
    const notFinance = notSPAC?.filter(e => !finRegex.test(e[1]));
    const share = none?.share;
    return <>
        <div className={styles.box}>
            <H3>실적 정보가 제공되지 않은 종목<Help
                title={'실적이 제공되지 않는 경우'}
                span={<>
                    asdf
                </>} />  ({none?.earn?.length}개)</H3>
            <H4>스팩주 ({SPAC?.length}개)</H4>
            <Collapse>{SPAC?.map(Stock)}</Collapse>
            <H4>신규 상장주 ({notFinance?.length}개)</H4>
            <Collapse>{notFinance?.map(Stock)}</Collapse>
            <H4>기타 금융주 ({finance?.length}개)</H4>
            <Collapse>{finance?.map(Stock)}</Collapse>
        </div>
        <div className={styles.box}>
            <H3>지분 정보가 제공되지 않은 종목 ({share?.length}개)</H3>
            <Collapse>{share?.map(Stock)}</Collapse>
        </div>
    </>;
}

function DataInfo({ cnt, earn, none }) {
    return <div>
        <InfoBlock1 cnt={cnt} earn={earn} none={none} />
        {/* <InfoBlock2 none={none} /> */}
        <InfoBlock3 none={none} />
    </div>;
}

export default DataInfo;