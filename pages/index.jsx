import styles from '@/styles/Index.module.scss';
import Kospi from './subindex/Kospi';
import GroupBubble from './subindex/GroupBubble';

const Column = () => {
    return <>
        - 칼럼 500자 이상<br />
        - 최신칼럼 / 인기칼럼<br />
        - 랭커들의 칼럼만 보기<br />
        - 좋아요 / 댓글 / 공유<br />
    </>
}

const GroupInduty = ({ group, price, meta, induty, index }) => {
    meta = meta?.data;
    Object.keys(group)
        .filter(name => group[name].child?.length)
        .map(name => {
            const data = group[name].child;
            return data.map(code => {

            })
        })
    return <div className={styles.area}>
        <h3>그룹/업종</h3>
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

const index = function ({
    group, induty, index, market, price, meta
}) {
    group = group?.data;
    const props = { group, meta, induty, market, index, price };
    return (
        <div>
            <Kospi {...props} />
            {/* <Column /> */}
            <GroupBubble {...props} />
            <GroupInduty {...props} />
        </div>
    )
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(index);