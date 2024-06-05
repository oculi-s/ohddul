import styles from "$/Base/Tab.module.scss";
import toggleOnPageChange from "@/components/toggle";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * tabIndex가 쿼리 파라미터로 주어지는 경우 default로 지정해줌
 */
export function ToggleTab({
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

export function ToggleQuery({
    names, query
}) {
    const router = useRouter();
    const tabName = router.query?.tab || query[0];
    names = names?.map((e, i) => <Link
        key={i}
        className={`${styles.tab} ${tabName == query[i] ? styles.active : ''}`}
        href={{ query: { ...router.query, tab: query[i] } }}
    >{e}</Link>)
    return (
        <div className={styles.toggleTab}>
            <div className={styles.tabGroup}>{names}</div>
        </div>
    );
}