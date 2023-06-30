import styles from '@/styles/Index.module.scss';
const Induty = ({ price, meta, induty, index }) => {
    meta = meta?.data;
    induty = induty?.data;

    return <div className={styles.area}>
        <h3>오늘의 업종</h3>
        <div className={styles.inline}>
            <div>
                <table><tbody>

                </tbody></table>
            </div>
            <div>
                <table><tbody>
                </tbody></table>
            </div>
        </div>
    </div>;
}

export default Induty;