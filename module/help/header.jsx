import styles from '$/Help/Header.module.scss';

const Copy = ({ tabIndex }) => {
    const copy = (e) => {
        const path = `${location.origin}${location.pathname}`;
        const id = e?.target?.parentElement?.id;
        const url = `${path}?p=${tabIndex}#${id}`;
        navigator.clipboard.writeText(url);
    }
    return <span className={`fa fa-link ${styles.copy}`} onClick={copy} />
}

export const H2 = ({ i, children }) => {
    return <h2>{children} <Copy tabIndex={i} /></h2>
}
export const H3 = ({ i, children }) => {
    return <h3>{children} <Copy tabIndex={i} /></h3>
}
export const H4 = ({ i, children }) => {
    return <h4>{children} <Copy tabIndex={i} /></h4>
}
