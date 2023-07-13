import styles from "$/Base/Tab.module.scss";
import { useState } from "react";
import toggleOnPageChange from "#/toggle";
import { useRouter } from "next/router";

/**
 * tabIndex가 쿼리 파라미터로 주어지는 경우 default로 지정해줌
 */
function ToggleTab({
    names, datas, tabIndex = 0, setTabIndex
}) {
    const router = useRouter();
    if (!tabIndex && !setTabIndex) {
        [tabIndex, setTabIndex] = useState(tabIndex);
    }
    toggleOnPageChange(router, setTabIndex, 0);
    names = names?.map((e, i) => <span
        key={`Tab${i}`}
        className={`${styles.tab} ${tabIndex == i ? styles.active : ""}`}
        onClick={e => { setTabIndex(i); }}
    >{e}</span>);
    datas = datas?.map((e, i) => <div
        key={`TabData${i}`}
        className={i == tabIndex ? '' : 'd'}
    >{e}</div>);
    return (
        <div className={styles.toggleTab}>
            <div className={styles.tabGroup}>{names}</div>
            <div>{datas}</div>
        </div>
    );
}

export default ToggleTab;