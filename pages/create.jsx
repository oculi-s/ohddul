import styles from "$/Common/Create.module.scss"
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Loading, SignError } from "#/base/base";
import { Int } from "@/module/ba";

import json from "@/module/json";
import dir from "@/module/dir";

export function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const props = { aside };
    return { props };
}

async function SignUp(e, router, setError, setOn) {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const pwCheck = e.target.pwCheck.value;
    const res = await signIn("ohddul", {
        id, pw, pwCheck, isCreate: true,
        redirect: false
    });
    if (res.ok) {
        router.reload();
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

function Index({ setUser }) {
    const [on, setOn] = useState(0);
    const [error, setError] = useState(0);
    const router = useRouter();
    const { status } = useSession();
    if (status == 'loading') {
        return <Loading />;
    } else if (status == 'authenticated') {
        router.push('/profile');
    } else {
        return <>
            <form className={styles.create}
                onSubmit={async (e) => {
                    await SignUp(e, router, setError, setOn);
                }}
            >
                <div>
                    <input
                        name='id'
                        label="ID"
                        variant="filled" />
                    <input
                        label="비밀번호"
                        type="password"
                        autoComplete="current-password"
                        name='pw'
                        variant="filled" />
                    <input
                        label="비밀번호확인"
                        type="password"
                        autoComplete="current-password"
                        name='pwCheck'
                        variant="filled" />
                </div>
                <SignError code={error} on={on} />
                <button type='submit'>회원가입</button>
            </form>
        </>;
    }
}

import container from "@/container/light";
export default container(Index);