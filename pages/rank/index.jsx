import styles from '@/styles/Rank.module.scss'

const index = () => {
    return (
        <>
            <span className={styles.h2}>명예의 전당</span>
            <table>

            </table>
            <span className={styles.h2}>랭크 변화</span>
            <table>

            </table>
        </>
    )
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(index);