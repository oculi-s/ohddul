import { useEffect, useState } from "react";
import styles from '$/Base/Toc.module.scss';

const refineData = (headings) => {
    const nest = [];

    headings.forEach((h, i) => {
        const t = h.innerText
            ?.replace(/\(([^)]+)\)/g, '').trim()
            .replace(/[\!\@\#\$\%\^\&\*\(\):]/gi, "");

        const id = h.innerText
            .trim().toLowerCase()
            .replace(/\(([^)]+)\)/g, '').trim()
            .replace(/[\!\@\#\$\%\^\&\*\(\):]/gi, "")
            .split(" ").join("-");
        h.id = id;
        if (h.nodeName == "H3") {
            nest.push({ id, t, items: [] });
        } else if (h.nodeName != "H3" && nest.length > 0) {
            nest[nest.length - 1].items.push({ id, t });
        }
    });
    return nest;
};

const Headings = ({ headings, selected, click }) => {
    var i = 0;
    return <ol className={styles.list} >
        {headings.map(h => (
            <li
                key={h.id}
                attr-id={h.id} onClick={click}
                className={selected == i++ ? styles.active : ''}
            >
                <span>{h.t}</span>
                {h.items.length > 0 && (
                    <ol className={styles.list}>
                        {h.items.map((c) => (
                            <li
                                key={c.id}
                                attr-id={c.id} onClick={click}
                                className={selected == i++ ? styles.active : ''}
                            >
                                <span>{c.t}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </li>
        ))}
    </ol>
};

const ToC = ({ tabIndex }) => {
    const [nestedHeadings, setHeading] = useState([]);
    const [selected, setSelected] = useState(0);

    const onclick = e => {
        e.preventDefault();
        const id = e?.target?.closest('li')?.getAttribute('attr-id');
        document?.getElementById(id)?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const $ = document.querySelector.bind(document);
        HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
        FileList.prototype.forEach = Array.prototype.forEach;
        NodeList.prototype.forEach = Array.prototype.forEach;
        NodeList.prototype.filter = Array.prototype.filter;
        const headings = $('main')
            ?.$$('h2, h3, h4, h5')
            ?.filter(e => !e.closest('.d') && !e.closest('dialog'));

        setHeading(refineData(headings));
        window.addEventListener('scroll', () => {
            const top = -document?.body?.getBoundingClientRect()?.top;
            const at = headings?.find(e => e?.offsetTop > top)
            const i = headings?.findIndex(e => e == at) - 1;
            if (i == -1) setSelected(0);
            else if (i >= 0) setSelected(i);
            else setSelected(headings.length - 1);
        });
    }, [tabIndex, selected])

    return <div className={styles.wrap}>
        <div className={styles.toc}>
            <Headings
                headings={nestedHeadings}
                selected={selected}
                click={onclick}
                setSelected={setSelected}
            />
        </div>
    </div>
}

export default ToC;