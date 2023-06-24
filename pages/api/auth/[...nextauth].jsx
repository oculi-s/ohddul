import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import { find, create } from '@/module/auth/user';
import { hashSync, compareSync } from 'bcrypt'
import { randomUUID } from 'crypto';

const errorMsg = {
    exist: "이미 존재하는 ID입니다.",
    empty: "패스워드를 입력해주세요.",
    regex: "패스워드 형식이 맞지 않습니다.",
    pwdiff: "확인 패스워드가 같지 않습니다."
}
const pwRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*\W)(?!.* ).{8,16}$/);

const providers = [
    CredentialsProvider({
        id: "my-credential",
        name: 'Credentials',
        type: 'credentials',
        credentials: {
            id: {}, pw: {}
        },
        async authorize(credentials, req) {
            let { isCreate, id, pw, pwCheck } = credentials;
            const user = find(id);
            if (isCreate) {
                if (user) {
                    throw new Error(errorMsg.exist);
                } else if (!pw) {
                    throw new Error(errorMsg.empty);
                } else if (!pwRegex.test(pw)) {
                    throw new Error(errorMsg.regex);
                } else if (pw != pwCheck) {
                    throw new Error(errorMsg.pwdiff);
                } else {
                    let uid = randomUUID();
                    pw = hashSync(pw, 5);
                    create({ id, pw, uid });
                    return { id, uid };
                }
            }
            if (!user) {
                throw new Error(msg);
            };
            const result = compareSync(pw, user.pw);
            if (!result) {
                throw new Error(msg);
            }
            const uid = user.uid;
            const admin = user.admin;
            return { id, uid, admin };
        }
    })
]

const callbacks = {
    async jwt({ token, user }) {
        user && (token.user = user)
        return Promise.resolve(token);
    },
    async session({ session, token }) {
        // token에 포함된 user 정보를 session.user에도 추가
        // 이후 client side의 session.user에서 token.user 정보 확인 가능.
        session.user = token.user
        if (session.user != null && token.hasAcceptedTerms != null) {
            session.user.hasAcceptedTerms = token?.hasAcceptedTerms;
        }
        return Promise.resolve(session);
    }
}


export default async function auth(req, res) {

    return await NextAuth(req, res, {
        providers,
        callbacks,
        session: {
            strategy: "jwt"
        }
    })
}