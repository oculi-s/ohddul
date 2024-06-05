import styles from '$/Base/Input.module.scss';
import '@/module/array';

export function RadioSelect({
    title, defaultValue, onChange, names = [], values = []
}) {
    return <>
        <div className={styles.radioGroup}>
            <h4>{title}</h4>
            {names.map((name, i) => <span key={i}>
                <input
                    type="radio"
                    name={`radio${title}`}
                    id={`radio${name}`}
                    value={values[i]}
                    onChange={e => onChange && onChange(values[i])}
                    defaultChecked={defaultValue == values[i]}
                    className={styles.input}
                />
                <label
                    htmlFor={`radio${name}`}
                    className={styles.label}
                >
                    {name}
                </label>
            </span>)}
        </div>
    </>
}

export function CheckBox({
    defaultChecked, onChange, name,
}) {
    const key = Math.randInt();
    return <>
        <input
            key={`inp${key}`}
            className={styles.input}
            id={`chk${name}`}
            type="checkbox"
            onChange={e => onChange && onChange(e => !e)}
            defaultChecked={defaultChecked}
        />
        <label
            key={`lab${key}`}
            htmlFor={`chk${name}`}
            className={styles.label}>
            {name}
        </label>
    </>
}