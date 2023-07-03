import styles from '$/Help.module.scss';
import { PredBar } from '#/stockData/stockHead';
import Image from 'next/image';
import helpImage from '@/public/help';
import Link from 'next/link';

function PredBlock1() {
    return <div className={styles.box}>
        <h3>예측바 열기</h3>
        <p>예측은 각 종목 페이지의 오른쪽 위에 있는 오떨맞추기 버튼을 눌러서 진행하실 수 있습니다.</p>
        <Image src={helpImage.pred1} alt='종목 예측 기본화면' />
        <p>버튼을 누르면 아래와 같은 예측바가 내려옵니다.</p>
        <Image src={helpImage.pred2} alt='예측바가 내려온 화면' />
        <p>모든 예측은 <span className='red'>로그인된 사용자</span>만 이용할 수 있습니다.</p>
        <p>각 종목별 예측은 1일 1회 진행할 수 있습니다. 예측을 진행한 뒤에는 해당 종목의 예측바를 열 수 없습니다.</p>
    </div>;
}

function PredBlock2({ price, setTabIndex }) {
    const code = '005930';
    const name = '삼성전자';
    console.log(price[code])
    return <div className={styles.box}>
        <h3>예측바 테스트하기</h3>
        아래는 <Link href='/stock/005930'>삼성전자</Link>의 테스트용 예측바입니다.
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true, help: false
            }} />
        </div>
        <p>오/떨 맞추기를 선택하시면 각각 오름과 떨어짐을, 가격 맞추기를 선택하시면 목표 가격을 맞추실 수 있습니다.</p>
        <h4>오/떨 맞추기</h4>
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true,
                defaultType: 1, help: false
            }} />
        </div>
        <p>오/떨을 예측할 때는 <span className='red'>내일 주가를 예측</span>해주시면 됩니다. 내일 해당 종목이 오르거나 떨어질지 여부를 예측해주시면 됩니다.</p>
        <p>해당 종목의 뉴스를 미리 알고 예측하면 되지 않냐고요? 당일 많은 사람이 맞춘 종목은 더 적은 점수를 받게 됩니다. <a onClick={e => setTabIndex(2)}>오떨의 점수산정 방식 보러가기</a></p>
        <h4>가격 맞추기</h4>
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true,
                defaultType: 2, help: false
            }} />
        </div>
        <p>목표가의 예측은 내일부터 최대 90일 후까지 가능하며, <span className='red'>최대 5배</span>까지 예측할 수 있습니다.</p>

    </div>
}

function PredHowto(props) {
    if (!props.meta) return <></>;
    return <div>
        <PredBlock1 {...props} />
        <PredBlock2 {...props} />
    </div>;
}

export default PredHowto;