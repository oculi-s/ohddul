import styles from "@/styles/Base/Tab.module.scss";
import { useState } from "react";
import toggleOnPageChange from "./toggle";
import { useRouter } from "next/router";

const ToggleTab = ({ names, datas, tabIndex = 0, setTabIndex }) => {
    const router = useRouter();
    if (!tabIndex && !setTabIndex) {
        [tabIndex, setTabIndex] = useState(tabIndex);
    }
    toggleOnPageChange(router, setTabIndex, 0);
    names = names?.map((e, i) =>
        <span

            key={`Tab${i}`}
            className={`${styles.tab} ${tabIndex == i ? styles.active : ""}`}
            onClick={e => { setTabIndex(i) }}
        >
            {e}
        </span>
    )
    datas = datas?.map((e, i) =>
        <div
            key={`TabData${i}`}
            className={i == tabIndex ? '' : 'd'}
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