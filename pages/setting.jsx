import styles from '$/Setting.module.scss';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { user } from './api/xhr';
import ToggleTab from '#/base/ToggleTab';

export function getServerSideProps() {
    const props = {};
    return { props };
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
    const id = document.querySelector('#id').value;
    const email = document.querySelector('#email').value;
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
        <div className={styles.form}>
            <input id='id' ref={idRef} defaultValue={oid} type='text' />
            <button
                onClick={async e => {
                    e.preventDefault();
                    await checkId({ idRef, oid, setIdCheck });
                }}
                className={
                    idCheck == 0
                        ? '' : idCheck == 1
                            ? styles.pass : styles.fail
                }>{
                    idCheck == -2 ? '기존과 같은 ID입니다.' :
                        idCheck == 0 ? '중복 확인' :
                            idCheck == 1 ? '사용 가능' :
                                <>이미 존재하는 ID입니다.</>
                }</button>
        </div>
        <button
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
        <div className={styles.form}>
            <input id='email' defaultValue={session?.user?.email} type='email' />
            <button onClick={async e => {
                e.preventDefault();
                alert('준비중입니다.')
            }}>인증번호 받기</button>
        </div>
        <div className={styles.form}>
            <input type="text" placeholder='인증번호 입력' />
            <button onClick={async e => {
                e.preventDefault();
                alert('준비중입니다.')
            }}>변경하기</button>
        </div>
    </div>
}

export default function Setting() {
    const names = ['개인정보 수정', '알림설정']
    const datas = [
        <div key={0}>
            <h4>아이디 변경</h4>
            <ChangeId />
            <h4>이메일 변경</h4>
            <ChangeEmail />
        </div>
    ]
    return <>
        <h2>환경설정</h2>
        <div className={styles.setting}>
            <ToggleTab names={names} datas={datas} />
        </div>
    </>
}