import styles from "$/Base/Tab.module.scss";
import toggleOnPageChange from "@/components/toggle";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export function ToggleTab({
    names,
    datas,
    right,
    tabIndex = 0,
    setTabIndex
}: {
    names: string[],
    datas: React.ReactNode[],
    right?: React.ReactNode | React.ReactNode[],
    tabIndex?: number,
    setTabIndex?: (index: number) => void
}) {
    const router = useRouter();
    if (!tabIndex && !setTabIndex) {
        [tabIndex, setTabIndex] = useState(tabIndex);
    }
    toggleOnPageChange(router, setTabIndex, false);
    datas = datas?.map((e, i) => <div
        key={`TabData${i}`}
        className={cn('w-full h-full', {
            hidden: i != tabIndex
        })}
    >{e}</div>);
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between">
                <div className='mb-3 flex gap-1 flex-wrap'>
                    {names?.map((e, i) => (
                        <span
                            key={i}
                            className={cn('bg-trade-600 hover:bg-trade-500 py-1 px-2 rounded-full shadow-lg text-white cursor-pointer', {
                                '!bg-trade-500': i == tabIndex
                            })}
                            onClick={e => { setTabIndex(i); }}
                        >
                            {e}
                        </span>
                    ))}
                </div>
                {right && <div className='flex gap-1'>{right}</div>}
            </div>
            <div className="flex-1">{datas}</div>
        </div>
    );
}

export function ToggleQuery({
    names, query
}: {
    names: string[],
    query: string[]
}) {
    const router = useRouter();
    const tabName = router.query?.tab || query[0];
    return (
        <div className={styles.toggleTab}>
            <div className='mb-3 flex gap-1'>
                {names?.map((e, i) => (
                    <Link
                        key={i}
                        className={cn('bg-trade-700 hover:bg-trade-500 py-1 px-2 rounded-full shadow-lg text-white', {
                            '!bg-trade-500': tabName == query[i]
                        })}
                        href={{ query: { ...router.query, tab: query[i] } }}
                    >
                        {e}
                    </Link>
                ))}
            </div>
        </div>
    );
}