import styles from "$/Common/Create.module.scss"
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { SignError } from "#/base/base";
import { Int } from "@/module/ba";

const SignUp = async (e, setUser, setError, setOn) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const pwCheck = e.target.pwCheck.value;
    const res = await signIn("ohddul", {
        id, pw, pwCheck, isCreate: true,
        redirect: false
    })
    if (res.ok) {
        const user = (await getSession()).user;
        const pred = user?.pred || [];
        const favs = user?.favs || [];
        setUser({ pred, favs });
        setError(0);
    } else {
        setError(Int(res.error));
        setOn(1);
        setTimeout(() => {
            setOn(0);
        }, 1000);
    }
    return res;
}

const Index = ({ setUser }) => {
    const [on, setOn] = useState(0);
    const [error, setError] = useState(0);
    const router = useRouter();
    const { status } = useSession();
    if (status == 'loading') {
        return (
            <>로딩중입니다...</>
        )
    } else if (status == 'authenticated') {
        router.push('/profile');
    } else {
        return <>
            <form className={styles.create} onSubmit={async e => {
                await SignUp(e, setUser, setError, setOn);
            }}>
                <div>
                    <input
                        name='id'
                        label="ID"
                        variant="filled"
                    />
                    <input
                        label="비밀번호"
                        type="password"
                        autoComplete="current-password"
                        name='pw'
                        variant="filled"
                    />
                    <input
                        label="비밀번호확인"
                        type="password"
                        autoComplete="current-password"
                        name='pwCheck'
                        variant="filled"
                    />
                </div>
                <SignError code={error} on={on} />
                <button type='submit'>회원가입</button>
            </form>
        </>
    }
}

import container, { getServerSideProps } from "@/container/heavy";
export { getServerSideProps };
export default container(Index);