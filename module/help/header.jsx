import styles from '$/Help/Header.module.scss';

const Copy = () => {
    const copy = (e) => {
        const path = `${location.origin}${location.pathname}`;
        const id = e?.target?.parentElement?.id;
        const url = `${location.href?.split('#')[0]}#${id}`;
        navigator.clipboard.writeText(url);
    }
    return <span className={`fa fa-link ${styles.copy}`} onClick={copy} />
}

export const H2 = ({ children }) => {
    return <h2>{children} <Copy /></h2>
}
export const H3 = ({ children }) => {
    return <h3>{children} <Copy /></h3>
}
export const H4 = ({ children }) => {
    return <h4>{children} <Copy /></h4>
}
