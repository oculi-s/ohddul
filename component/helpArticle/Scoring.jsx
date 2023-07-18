import styles from '$/Help/Help.module.scss';
import { InlineMath as IM, BlockMath as BM } from 'react-katex';
import Link from 'next/link';
import { Collapse } from '#/base/base';
import { H3, H4 } from '@/module/help/header';

function ScoringBlock1() {
    return <div className={styles.box}>
        <p>오떨에서는 유저별로 고유점수를 부여하며, 유저의 고유점수는 각 채점의 단위점수로 구성됩니다.</p>
        <H3>채점과 단위점수</H3>
        <p>모든 예측의 채점은 <span className='red'>데이터 업데이트 이후</span> 10분 내외로 이루어집니다. 오후 4시 30분 이내에 모든 채점이 끝납니다.</p>
        <p><b>가입 후 최초 500개의 예측까지 <span className='red'>점수의 감점</span>은 없습니다.</b></p>
        <H4>오/떨 예측</H4>
        <p>오/떨 예측의 채점은 단순히 맞았는지 여부를 통해 진행합니다.</p>
        <table>
            <colgroup>
                <col width={'20%'} />
                <col width={'80%'} />
            </colgroup>
            <tbody>
                <tr><th className='red'>O</th><td>오/떨이 맞은 경우</td></tr>
                <tr><th className='blue'>X</th><td>오/떨이 틀린 경우</td></tr>
            </tbody>
        </table>
        <p>오/떨 예측의 단위 점수는 다음과 같이 계산됩니다.</p>
        <table>
            <colgroup>
                <col width={'20%'} />
                <col width={'80%'} />
            </colgroup>
            <tbody>
                <tr><th>계산식</th><td><IM math='v=p\times\dfrac{1}{1+\sqrt{N/T}}' /></td></tr>
                <tr><th>변수</th><td>
                    <p><IM>p</IM> = 정답 여부 <span className='des'>(1은 정답, -1은 오답, 0은 보합, 최초 500개는 모두 0또는 1)</span></p>
                    <p><IM>N</IM> = (해당일자의 본인의 예측을 제외한 종목 예측 수)</p>
                    <p><IM>T</IM> = (해당일자의 본인의 예측을 제외한 전체 예측 수)</p>
                </td></tr>
            </tbody>
        </table>
        <p>기본점수는 1점입니다. 만약 해당 종목을 예측한 사람이 많아지면 예측을 맞았을 때 얻는 점수가 줄어들게 됩니다.</p>
        <H4>오/떨 예측 예시</H4>
        <Collapse title={'예시1'}>
            <p>예를들어 오늘 <Link href={`/stock/005930`}>삼성전자</Link>를 <b>3명</b>이 예측하고, <Link href={`/stock/066570`}>LG전자</Link>를 <b>5명</b>이 예측하였습니다. 이때 내가 LG전자와 삼성전자를 모두 예측하고 삼성전자를 맞고, LG전자를 틀렸다면 점수 계산은 아래와 같이 진행됩니다.</p>
            <table className='fixed'>
                <colgroup>
                    <col width={50} />
                </colgroup>
                <tbody>
                    <tr><th></th>
                        <th>삼성전자 <span className='red'>O</span></th>
                        <th>LG전자 <span className='blue'>X</span></th>
                    </tr>
                    <tr><th><IM>T</IM></th><td colSpan={2}>3 (삼성전자) + 5 (LG전자) - 2 (본인의 예측) = 6</td></tr>
                    <tr><th><IM>p</IM></th><td>1</td><td>-1</td></tr>
                    <tr><th><IM>N</IM></th><td>3 (삼성전자) - 1 (본인) = 2</td><td>5 (LG전자) - 1 (본인) = 4</td></tr>
                    <tr>
                        <th><IM>v</IM></th>
                        <td>
                            <IM math='1\times\dfrac{1}{1+\sqrt{2/6}}' />
                            <br className='ph' />
                            =0.63
                        </td>
                        <td>
                            <IM math='-1\times\dfrac{1}{1+\sqrt{4/6}}' />
                            <br className='ph' />
                            =-0.55
                        </td>
                    </tr>
                    <tr><th><IM math='\triangle{v}' /></th><td colSpan={2}><b>0.63 - 0.55 = 0.08</b> (최종 점수 변화)</td></tr>
                </tbody>
            </table>
        </Collapse>
        <Collapse title={'예시2'}>
            <p>만약 더 극단적인 예시로 오늘 <Link href={`/stock/005930`}>삼성전자</Link>를 <b>50</b>명이 예측하고, <Link href={`/stock/263810`}>상신전자</Link>를 <b>3</b>명이 예측하였습니다. 이때 내가 삼성전자를 틀리고, 상신전자를 맞았다면 점수 계산은 아래와 같이 진행됩니다.</p>
            <table className='fixed'>
                <colgroup>
                    <col width={50} />
                </colgroup>
                <tbody>
                    <tr>
                        <th></th><th>삼성전자 <span className='red'>O</span></th>
                        <th>상신전자 <span className='blue'>X</span></th>
                    </tr>
                    <tr><th><IM>T</IM></th><td colSpan={2}>50 (삼성전자) + 3 (상신전자) - 2 (본인의 예측) = 51</td></tr>
                    <tr><th><IM>p</IM></th><td>-1</td><td>1</td></tr>
                    <tr><th><IM>N</IM></th><td>50 (삼성전자) - 1 (본인) = 49</td><td>3 (상신전자) - 1 (본인) = 2</td></tr>
                    <tr>
                        <th><IM>v</IM></th>
                        <td>
                            <IM math='-1\times\dfrac{1}{1+\sqrt{49/51}}' />
                            <br className='ph' />
                            =-0.51
                        </td>
                        <td>
                            <IM math='1\times\dfrac{1}{1+\sqrt{2/51}}' />
                            <br className='ph' />
                            =0.83
                        </td>
                    </tr>
                    <tr><th><IM math='\triangle{v}' /></th><td colSpan={2}><b>0.83 - 0.51 = 0.33</b> (최종 점수 변화)</td></tr>
                </tbody>
            </table>
        </Collapse>
        <p>따라서 당일 최대한 <span className='red'>적은 사람이 예측한 종목을 예측하는 것</span>이 점수를 올리는 데에 도움이 됩니다.</p>
        <H4>가격 예측</H4>
        <p>가격 예측의 채점은 <span className='red'>채점가격과 예측 가격의 차이</span>가 적을수록, <span className='red'>기간내 가격 변동성</span>이 클수록 더 높은 점수를 받습니다.</p>
        <p>가격 예측의 단위 점수는 다음과 같이 계산됩니다.</p>
        <table>
            <colgroup>
                <col width={'20%'} />
                <col width={'80%'} />
            </colgroup>
            <tbody>
                <tr><th>계산식</th><td>
                    <p style={{ lineHeight: '1.5em' }}>
                        <IM math='v=5\times (2e^{-3.5d}-1)' />,&nbsp;
                        <span className='des'>
                            <IM math='(d=\dfrac{|a-s|}{s+|h-l|}' />,&nbsp;
                            <IM math='3.5\simeq\ln{2}/0.2)' />
                        </span>
                    </p>
                </td></tr>
                <tr><th>변수</th><td>
                    <p><IM math='a' /> = 예측가격</p>
                    <p><IM math='s' /> = 채점기준일 가격</p>
                    <p><IM math='h' /> = 예측일부터 기준일까지의 고가</p>
                    <p><IM math='l' /> = 예측일부터 기준일까지의 저가</p>
                </td></tr>
            </tbody>
        </table>
        <p>(예측가격과 기준가격의 차이)가 (기준가격과 변화량의 합)의 <b>20%</b>를 벗어날 때부터 점수가 깎이게 되며, 최소 -5점부터 최대 5점의 점수를 얻을 수 있습니다.</p>
        <H4>가격 예측 예시</H4>
        <Collapse title={'예시1'}>
            <p>예를들어 2023년 1월4일 삼성전자의 종가는 <b>57,800</b>원입니다. 90영업일 뒤인 2023년 5월17일의 종가를 <b>70,000</b>원으로 예측하겠습니다.</p>
            <p>2023년 5월17일의 실제 종가는 <b>65,000</b>원입니다. 고가는 4월 12일의 <b>66,000</b>원, 저가는 1월 4일의 시작가 그대로입니다.</p>
            <table className='fixed'>
                <tbody>
                    <tr>
                        <th><IM math='a' /></th><td>70,000</td>
                        <th><IM math='s' /></th><td>65,000</td>
                    </tr>
                    <tr>
                        <th><IM math='h' /></th><td>66,000</td>
                        <th><IM math='l' /></th><td>57,800</td>
                    </tr>
                    <tr><th><IM math='d' /></th><td colSpan={3}><IM math='\dfrac{|70,000-65,000|}{65,000+|66,000-57,800|}=0.068' /></td></tr>
                    <tr><th><IM math='v' /></th><td colSpan={3}><IM math='5\times(2e^{-3.5\times0.068}-1)=' /><b>2.87</b> (최종 점수 변화)</td></tr>
                </tbody>
            </table>
        </Collapse>
        <Collapse title={'예시2'}>
            <p>반대로 같은 날 종가를 48,000원으로 예측하였다면 점수는 아래와 같이 계산됩니다.</p>
            <table className='fixed'>
                <tbody>
                    <tr>
                        <th><IM math='a' /></th><td>48,000</td>
                        <th><IM math='s' /></th><td>65,000</td>
                    </tr>
                    <tr>
                        <th><IM math='h' /></th><td>66,000</td>
                        <th><IM math='l' /></th><td>57,800</td>
                    </tr>
                    <tr><th><IM math='d' /></th><td colSpan={3}><IM math='\dfrac{|48,000-65,000|}{65,000+|66,000-57,800|}=0.232' /></td></tr>
                    <tr><th><IM math='v' /></th><td colSpan={3}><IM math='5\times(2e^{-3.5\times0.232}-1)=' /><b>-0.56</b> (최종 점수 변화)</td></tr>
                </tbody>
            </table>
        </Collapse>
        <p>만약 오/떨이 아닌 가격을 정확히 예측할 수 있다면 가격을 예측하는 것이 점수를 올리는 매우 빠른 방법이 됩니다.</p>
        <p>마찬가지로 가입 후 최초 500개의 예측까지 점수의 감점이 없으므로 500개의 예측 중 80%를 적중하고 각 3점을 얻었다면 랭크는 단숨에 <span className='platinum'>플래티넘4</span>가 됩니다.</p>
    </div>
}

function ScoringBlock2() {
    return <div className={styles.box}>
        <H3>유저의 고유 점수</H3>
        <p>유저의 고유 점수는 <b>기본점수 1000점과 오/떨점수, 가격점수를 합산</b>하여 정해집니다.</p>
        <p>이외에도 커뮤니티 점수 등을 도입하려 준비중에 있습니다.</p>
    </div>
}

function ScoringBlock3() {
    return <div className={styles.box}>
        <H3>랭크 시스템</H3>
    </div>
}

function Scoring() {
    return <div className={styles.scoring}>
        <ScoringBlock1 />
        <ScoringBlock2 />
        <ScoringBlock3 />
    </div>;
}

export default Scoring;