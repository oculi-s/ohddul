import styles from '$/Profile.module.scss'

export const Curtain = ({ rank }) => (
    <div
        className={styles.curtain}
        style={{ background: `linear-gradient(180deg, var(--rank-${rank.slice(0, -1)}), transparent)` }}
    />
)