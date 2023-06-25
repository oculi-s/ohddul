import styles from "@/styles/Base/Tab.module.scss";
import { useState } from "react";
import toggleOnPageChange from "./toggle";
import { useRouter } from "next/router";

const ToggleTab = ({ names, datas }) => {
    const router = useRouter();
    const [view, setView] = useState(0);
    toggleOnPageChange(router, setView, 0);
    names = names?.map((e, i) =>
        <span
            key={`Tab${i}`}
            className={`${styles.tab} ${view == i ? styles.active : ""}`}
            onClick={e => { setView(i) }}
        >
            {e}
        </span>
    )
    datas = datas?.map((e, i) =>
        <div
            key={`TabData${i}`}
            className={i == view ? '' : 'd'}
        >
            {e}
        </div>
    )
    return (
        <>
            <div className={styles.tabGroup}>{names}</div>
            <div>{datas}</div>
        </>
    )
}

export default ToggleTab;