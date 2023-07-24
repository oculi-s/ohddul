import styles from '$/Alarm.module.scss'
import dt from '@/module/dt';
import dir from "@/module/dir";
import json from "@/module/json";
import { getSession } from "next-auth/react";
import { MustLogin } from '#/base/Kakao';
import api from './api';
import { useEffect } from 'react';

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    const aside = json.read(dir.stock.light.aside);
    const uid = session?.user?.uid;
    const alarm = json.read(dir.user.alarm(uid), []);
    const props = { aside, alarm, session, uid }
    return { props };
}

export default function Alarm({ alarm, uid, session }) {
    useEffect(() => {
        if (alarm.find(e => !e.ch))
            api.json.write({
                url: dir.user.alarm(uid),
                data: alarm.map(e => { e.ch = true; return e })
            });
    }, [])
    if (!session) return <MustLogin />;
    return <>
        <h2>알림</h2>
        <div className={styles.wrap}>
            {alarm?.length ? alarm?.map((e, i) => {
                return <div
                    className={`${styles.data} ${e.ch ? '' : styles.unchecked}`}
                    key={i}
                >
                    <p className={styles.time}>{dt.toString(e.d, { time: 1, day: 1 })}</p>
                    <hr />
                    <div>
                        <h4>{e.title}</h4>
                        <div dangerouslySetInnerHTML={{
                            __html: e.data
                        }}></div>
                    </div>
                </div>
            }) : <div className={styles.data}>
                알림이 없습니다.
            </div>}
        </div>
    </>
}