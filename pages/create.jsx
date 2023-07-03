import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import styles from "$/Common/Create.module.scss"

const SignUp = async e => {
    e.preventDefault();
    const id = e.target.id.value;
    const pw = e.target.pw.value;
    const pwCheck = e.target.pwCheck.value;
    const res = await signIn("my-credential", {
        id, pw, pwCheck, isCreate: true,
        redirect: false
    })
    return res;
}

const submit = async e => {
    let res = await SignUp(e);
    console.log(res);
}

const Index = ({ userMeta, userData }) => {
    const router = useRouter();
    let { status } = useSession();
    if (status == 'loading') {
        return (
            <>로딩중입니다...</>
        )
    } else if (status == 'authenticated') {
        router.push('/profile');
    } else {
        return <>
            <form className={styles.create} onSubmit={submit}>
                <div>

                    {/* <TextField
                        name='id'
                        label="ID"
                        variant="filled"
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        autoComplete="current-password"
                        name='pw'
                        variant="filled"
                    />
                    <TextField
                        label="비밀번호확인"
                        type="password"
                        autoComplete="current-password"
                        name='pwCheck'
                        variant="filled"
                    /> */}
                </div>
                <button type='submit'>회원가입</button>
            </form>
        </>
    }
}

import container, { getServerSideProps } from "@/container";
export { getServerSideProps };
export default container(Index);