import ToggleTab from '#/base/ToggleTab';
import styles from '$/Index.module.scss';

/**
 * 미리 데이터 저장해서 만들어놔야함
 */
export default function MajorShare() {
    const names = ['국민연금'];
    const datas = [
        <>
            <table>
                <thead><tr><th>종목</th><th>비중</th><th>시총대비</th></tr></thead>
            </table>
        </>
    ]
    return <div className={styles.area}>
        <h3>주요기관의 선택</h3>
        <ToggleTab names={names} datas={datas} />
    </div>
}