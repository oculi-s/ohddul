import Link from "next/link"

export const bpsHelp = {
    title: `Book per share, 주당 순자산`,
    span: <>
        <p>회사가 가진 돈을 발행 주식수로 나누어 계산하는 안전성 지표입니다. 오떨에서는 가장 최근 분기의 자본금을 발행주식수로 나누어 계산합니다.</p>
        <p>BPS가 주가에 가깝다는 것은 회사가 가지고 있는 투자 여력이 주가에 잘 반영되는 것을 의미합니다.</p>
    </>,
    data: <>
        <tr><th>계산식</th><td>(최근 분기 자본) / (발행주식)</td></tr>
        <tr><th className="red">상승</th><td>BPS가 주가보다 클 때</td></tr>
        <tr><th className="blue">하락</th><td>주가가 BPS보다 클 때</td></tr>
    </>
}

export const epsHelp = {
    title: `Earning Per Share, 주당 순이익`,
    span: <>
        <p>1년 단위의 순이익을 발행 주식수로 나누어 계산하는 수익성 지표입니다. 원래 계산식과 달리 오떨에서는 초기자본금에 누적된 순이익(손실)을 발행주식수로 나누어 계산합니다.</p>
    </>,
    data: <>
        <tr><th>계산식</th><td>(초기자본 + 누적이익) / (발행주식)</td></tr>
        <tr><th className="red">상승</th><td>EPS가 주가보다 클 때</td></tr>
        <tr><th className="blue">하락</th><td>주가가 EPS보다 클 때</td></tr>
    </>
}

export const roeHelp = {
    title: `Return on Equity, 자기자본이익률`,
    span: <>
        <p>회사가 가진 돈을 투자해 얼마나 많은 이익을 냈는지 나타내는 지표입니다. 오떨에서는 최근 4분기 이익의 합을 최근 분기의 자본으로 나누어 계산합니다.</p>
        <table>
            <tbody>
                <tr><th>계산식</th><td>(최근 4분기 이익의 합) / (발행주식) (%)</td></tr>
            </tbody>
        </table>
        <p>은행에 예금을 예치하고 받는 돈을 이자라고 합니다. 기업의 이자는 자본에 대한 이익입니다. 따라서 ROE가 은행의 금리보다 높은 회사에 투자의 가치가 있으며, 그 중에서 회사가 자금 조달을 위해 발행한 채권인 회사채의 이자보다 높은 ROE를 가진 기업은 자신이 빌린 돈의 이자보다 더 많은 돈을 벌어들일 수 있는 것이므로 적극적인 투자의 대상이 됩니다.</p>
        <p>투자의 대가 워렌버핏은 3년 평균 ROE가 15% 이상인 기업에 투자하라고 권유하였으며, 12%의 ROE를 꾸준히 기록하는 기업의 수익률이 가장 좋은 것으로 나타났습니다.</p>
    </>
}

export const prHelp = {
    title: `Profit Margin, 이익률`,
    span: <>
        <p>회사가 활동을 통해 벌어들인 돈의 마진율을 계산한 값입니다. 높을수록 회사가 안정적임을 의미하지만 업종별로 차이가 있어 동일 업종의 평균값 대비 이익률을 보는 것이 좋습니다.</p>
        <p>계산식 = (이익총합) / (매출총합)</p>
    </>
}

export const maHelp = {
    title: 'Moving Average 이동평균 (이평)',
    span: <>
        <p>여러 일 간의 종가의 평균값을 낸 것입니다. 주로 60, 120일을 사용하며, 장단기 추세를 보는 데에 유리합니다.</p>
    </>,
    data: <>
        <tr><th>계산식</th><td>(현재가 - 이평) / 이평 (%)</td></tr>
        <tr>
            <th className="red">상승</th>
            <td>현재가가 이평보다 작을 때<br />(이평%가 음수일 때)</td>
        </tr>
        <tr>
            <th className="blue">하락</th>
            <td>현재가가 이평보다 클 때<br />(이평%가 양수일 때)</td>
        </tr>
    </>
}

export const bbHelp = {
    title: 'Bollinger Band, 볼린저밴드',
    span: `이동평균을 이용한 밴드 지표`
}

export const revenueHelp = {
    title: `매출액`,
    span: <>
        <p>매출액은 일정 기간동안 회사의 장부에 적힌 판매금액을 말합니다. 보통 분기별로 계산하며, 편의상 오떨에서는 분기별 매출액을 주식수로 나누어 계산합니다.</p>
        <table>
            <tbody>
                <tr><th>계산식</th><td>(분기별 매출) / (발행주식)</td></tr>
            </tbody>
        </table>
    </>
}

export const profitHelp = {
    title: `당기순이익`,
    span: <>
        <p>순이익은 일정 기간 동안 매출액에서 원가, 인건비 등의 비용을 제외하고, 세금 (법인세)를 내고 난 뒤 장부에 적힌 남은 돈을 말합니다.</p>
        <p>오떨에서는 분기별 이익을 주식수로 나누어 계산합니다.</p>
        <table>
            <tbody>
                <tr><th>계산식</th><td>(분기별 이익) / (발행주식)</td></tr>
            </tbody>
        </table>
    </>
}

export const earnnullHelp = {
    title: '매출, 이익 등이 비어있는 경우',
    span: <>
        <p><Link href={'/stock/카카오?tab=earn'}>카카오</Link>의 실적정보를 보면 매출이 0원으로 기록되어 있습니다.</p>
        <p>일반적인 다른 회사는 매출의 계정과목명을 <b>매출액</b>으로 표시하지만, 카카오는 <b>영업수익</b>으로 기록하여 매출이 표시되지 않습니다.</p>
        <p>이처럼 </p>
    </>
}

export const overflowHelp = {
    title: '전체주식이 100%에 맞지 않는 경우',
    span: <>
        <p><Link href={`/stock/HMM?tab=share`}>HMM</Link>의 지분정보를 보면 총합이 100%를 초과하는 것을 볼 수 있습니다.</p>
        <div class="Stock_shareTable__300V_">
            <table>
                <thead>
                    <tr><th>이름</th><th>지분</th><th>기준일</th>
                    </tr></thead>
                <tbody>
                    <tr><th>산업은행</th><td>75.4%</td><td><Link target="_blank" href="https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20220104000076">2022-01-04</Link></td></tr>
                    <tr><th>한국해양진흥공사</th><td>74.7%</td><td><Link target="_blank" href="https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20220106000467">2022-01-06</Link></td></tr>
                    <tr><th>소액주주</th><td>46.9%</td><td><Link target="_blank" href="https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20230714000061">2023-07-14</Link></td></tr>
                    <tr><th colSpan={3}>...</th></tr>
                </tbody>
            </table>
        </div>
        <p>주식의 대량 보유상황을 보고할 때 주권 (주식)이 아닌 전환사채, 신주인수권 등을 <b>보유주식 등</b>으로 묶어 공시하기 때문입니다.</p>
        <p>기준일자에 걸려있는 공시 보고서 링크에 접속하여 <b>3. 보유주식등의 수 및 보유비율</b>의 주권 항목을 확인하면 정확한 보유비율을 알 수 있습니다.</p>
        {/* <p>소액주주의 </p> */}
    </>
}