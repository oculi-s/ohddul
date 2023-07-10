import styles from '$/User.module.scss'
import Link from 'next/link'

import bgIron from '@/public/rank/iron.png'
import bgBronze from '@/public/rank/10.png'
import bgSilver from '@/public/rank/100.png'
import bgGold from '@/public/rank/500.png'
import bgPlatinum from '@/public/rank/1000.png'
import bgDiamond from '@/public/rank/10000.png'
import bgMaster from '@/public/rank/50000.png'
import { useEffect, useRef, useState } from 'react'
import toggleOnPageChange from './toggle'
import { useRouter } from 'next/router'
import { user } from '@/pages/api/xhr'
import { useSession } from 'next-auth/react'

export const getBg = rank => {
    return rank.includes('bronze') ? (bgBronze
    ) : rank.includes('silver') ? (bgSilver
    ) : rank.includes('gold') ? (bgGold
    ) : rank.includes('platinum') ? (bgPlatinum
    ) : rank.includes('diamond') ? (bgDiamond
    ) : rank.includes('master') ? (bgMaster
    ) : bgIron;
}

export const getRank = rank => {
    let rlist = [
        'unranked0',
        'bronze4', 'bronze3', 'bronze2', 'bronze1',
        'silver4', 'silver3', 'silver2', 'silver1',
        'gold4', 'gold3', 'gold2', 'gold1',
        'platinum4', 'platinum3', 'platinum2', 'platinum1',
        'diamond4', 'diamond3', 'diamond2', 'diamond1',
        'master4', 'master3', 'master2', 'master1'
    ]
    for (let [i, e] of rlist.entries()) {
        if (rank <= 1000 + i * 100) {
            return [e.slice(0, -1), e.slice(-1), rlist[i + 1]];
        }
    }
    return ['master1', 'master1'];
}

/**
 * 유저정보 박스, 완전히 독립적으로 실행되도록 해야함.
 * 
 * 그러려면 session에 meta를 담아 보내야 한다.
 * 2023.07.04 수정 완료
 */
export function User({ user, setAsideShow }) {
    const id = user?.id;
    const rank = user?.rank;
    const [color, num, next] = getRank(rank);
    let rankName = color[0]?.toUpperCase() + num;
    if (color == 'unranked') rankName = "IRON";
    return (
        <div className={styles.user}>
            <Link href='/profile' onClick={e => setAsideShow(false)}>
                <div className={styles.id}>{id}</div>
                <div className={styles.rank}>
                    <span className={color}>{rank}</span>
                    &nbsp;{rankName}
                </div>
            </Link>
        </div>
    )
}

export function Alarms() {
    const { data: session, status, update } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [show, setShow] = useState(false);
    // useEffect(() => {
    //     console.log(1)
    //     setShow(true);
    // }, [user?.alarm])
    toggleOnPageChange(router, setShow);
    if (status != 'authenticated') return;
    return <>
        <div className={styles.alarm}>
            <button
                className={`fa fa-bell`}
                data-count={user?.alarm?.length}
                onClick={e => {
                    setShow(e => !e);
                }}
            />
            <div className={`${styles.alarmWrap} ${show ? styles.show : ''}`}>
                {user?.alarm?.length ? user?.alarm?.slice(0, 5).map((e, i) => {
                    return <div className={styles.alarmData} key={i}>
                        <div>
                            <h4>{e.title}</h4>
                            <div dangerouslySetInnerHTML={{ __html: e.data }}></div>
                        </div>
                        <button
                            className='fa fa-trash'
                            onClick={e => {
                                update({ alarm: i }).then(e => setShow(true));
                            }}
                        />
                    </div>
                }) : <div className={styles.alarmData}>
                    알림이 없습니다.
                </div>}
            </div>
        </div>
    </>
}

async function checkId({ idRef, oid, setIdCheck }) {
    const id = idRef?.current?.value;
    const res = await user.find({ id });
    if (id == oid) {
        setIdCheck(-2);
        return -2;
    } else if (res) {
        setIdCheck(-1);
        return -1;
    } else setIdCheck(1);
    return 1;
}

async function change(uid) {
    const id = document.querySelector('form #id').value;
    const email = document.querySelector('form #email').value;
    await user.change({ id, uid, email });
    alert('변경되었습니다.');
}

function ChangeId() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [idCheck, setIdCheck] = useState(0);
    const oid = session?.user?.id;
    const idRef = useRef();
    return <div className={styles.box}>
        <form onSubmit={async e => {
            e.preventDefault();
            await checkId({ idRef, oid, setIdCheck });
        }}>
            <input id='id' ref={idRef} defaultValue={oid} type='text' />
            <button className={
                idCheck == 0
                    ? '' : idCheck == 1
                        ? styles.pass : styles.fail
            }>{
                    idCheck == -2 ? '기존과 같은 ID입니다.' :
                        idCheck == 0 ? '중복 확인' :
                            idCheck == 1 ? '사용 가능' :
                                <>이미 존재하는 ID입니다.</>
                }</button>
        </form>
        <button
            className={styles.midBtn}
            type='button'
            onClick={async e => {
                const id = idRef?.current?.value;
                const res = await checkId({ idRef, oid, setIdCheck })
                if (res == 1) {
                    await change(session?.user?.uid)
                    await update({ id });
                    router.reload();
                } else alert('아이디 중복 확인을 진행해주세요.')
            }}>
            변경하기
        </button>
    </div>
}

function ChangeEmail() {
    const { data: session, update } = useSession();
    const [time, setTime] = useState(5 * 60);
    return <div className={styles.box}>
        <form onSubmit={async e => {
            e.preventDefault();
            alert('준비중입니다.')
        }}>
            <input id='email' defaultValue={session?.user?.email} type='email' />
            <button>인증번호 받기</button>

        </form>
        <form onSubmit={async e => {
            e.preventDefault();
            alert('준비중입니다.')
        }}>
            <input type="text" placeholder='인증번호 입력' />
            <button>변경하기</button>
        </form>
    </div>
}

function Setting({ user, show, setShow }) {
    return <>
        <div className={`${styles.settingWrap} ${show ? styles.show : ''}`}>
            <div className={styles.setting}>
                <h2>환경설정</h2>
                <hr />
                <h4>아이디 변경</h4>
                <ChangeId />
                <h4>이메일 변경</h4>
                <ChangeEmail />
            </div>

            <button
                className={`fa fa-close ${styles.close}`}
                onClick={e => setShow(false)}
            />
        </div>
        <div className={`${styles.shadow} ${show ? styles.show : ''}`} onClick={e => setShow(false)}></div>
    </>
}

export function AlarmSetting({ user, setAsideShow }) {
    const [settingShow, setSettingShow] = useState(false);
    const router = useRouter();
    toggleOnPageChange(router, setSettingShow);

    useEffect(() => {
        if (settingShow) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [settingShow]);
    return <div className={styles.alarmSetting}>
        <div className={styles.box}>
            <button
                className='fa fa-cog'
                onClick={e => {
                    setAsideShow(false)
                    setSettingShow(true);
                }}
            />
            <Setting user={user} show={settingShow} setShow={setSettingShow} />
        </div>
    </div>
}