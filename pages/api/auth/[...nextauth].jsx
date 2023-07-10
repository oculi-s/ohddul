import NextAuth from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'
// import CredentialsProvider from 'next-auth/providers/credentials';
import { findUid, create } from '@/module/auth/user';
import json from '@/module/json';
import dir from '@/module/dir';
// import { hashSync, compareSync } from 'bcryptjs'
// import { nanoid } from 'nanoid';
// import dir from '@/module/dir';
// import json from '@/module/json';

// const status = {
//     exist: 300,
//     emptyID: 400,
//     emptyPW: 401,
//     regex: 402,
//     pwdiff: 403,
//     failed: 404
// }
// const pwRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*\W)(?!.* ).{8,16}$/);

const providers = [
    KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET
    }),
    // CredentialsProvider({
    //     id: "ohddul",
    //     name: 'Credentials',
    //     type: 'credentials',
    //     credentials: {
    //         id: {}, pw: {}
    //     },
    //     async authorize(credentials, req) {
    //         let { isCreate, id, pw, pwCheck } = credentials;
    //         const user = find(id);
    //         if (!id) throw new Error(status.emptyID);
    //         if (!pw) throw new Error(status.emptyPW);

    //         if (isCreate) {
    //             if (user) {
    //                 throw new Error(status.exist);
    //             } else if (!pwRegex.test(pw)) {
    //                 throw new Error(status.regex);
    //             } else if (pw != pwCheck) {
    //                 throw new Error(status.pwdiff);
    //             } else {
    //                 let uid = nanoid(11);
    //                 pw = hashSync(pw, 5);
    //                 create({ id, pw, uid });
    //             }
    //         } else {
    //             if (!user) {
    //                 throw new Error(status.failed);
    //             } else if (!compareSync(pw, user.pw)) {
    //                 throw new Error(status.failed);
    //             }
    //         }
    //         const admin = user?.admin;
    //         const uid = user?.uid;
    //         const meta = json.read(dir.user.meta)[uid];
    //         const queue = json.read(dir.user.pred(uid), { queue: [] })?.queue;
    //         const favs = json.read(dir.user.favs(uid));
    //         return { id, uid, admin, meta, queue, favs };
    //     }
    // }),
]

/**
 * next auth를 통해 생성하는 것은 token과 session이 있음
 * 
 * 1. token은 jwt함수를 통해 생성됨, user는 위에 있는 authorize함수에서 넘겨주는 변수들이 됨
 * jwt call back은 useSession, getSession, getServerSession을 통해 실행된다.
 * 그러니 웬만한 데이터는 authorize에서 생성해서 내려보내는 게 좋음
 * 
 * token은 기존에 있던 토큰, user는 어떤 trigger를 통해 새로 들어오는 것
 * 만약 signIn, 로그인을 진행한다면 그대로 user를 준다.
 * 만약 update, 변경이 일어나면 session 정보를 update(session)과 같은 방식으로 넣어주면 되는데,
 * 이때 들어온 session으로 token을 업데이트 해서 보낸다.
 * 나머지 경우는 그냥 token을 내보낸다.
 * 
 * update가 실행되면 jwt는 무조건 호출됨. useSession이 있는 모든 element가 reload되니까
 * 방지책이 필요함
 * 전부 폐기 후 useState이용으로 결정 2023.07.04
 * 대신 userMeta등의 사용을 줄이기 위해 session에 rank, pred, favs를 초기에 담아 보냄
 */


/**
 * 2023.07.06 카카오 로그인을 구현하면서 모든 내용이 다 무용지물이 됨.
 * 처음 jwt 토큰 생성에서 정보를 받아올 수 없고 생성된 토큰을 session으로 넘겨줄때 유저정보를 읽어야함.
 * 1. signIn 함수는 boolean return, 유저 정지에 사용할 수 있음
 */
const callbacks = {
    // signIn({ user, account, profile, email, credentials }) {
    // return false;
    // },
    async jwt({ token, user, trigger, session }) {
        if (trigger == 'signIn') {
            const exist = findUid(user?.id);
            if (!exist) {
                token.user = create(user);
                return token;
            } else {
                token.user = exist;
                return token;
            }
        } else if (trigger == 'update') {
            const uid = token?.user?.uid;
            console.log(trigger, session, uid);
            if (session?.id) {
                token.user.id = session?.id;
                return token;
            } else if (session.email) {
                token.user.email = session?.email;
                return token;
            } else if (session.favs) {
                const code = session?.favs;
                const favs = token?.user?.favs || {};
                if (favs[code]) delete favs[code];
                else favs[code] = 1;
                token.user.favs = favs;
                json.write(dir.user.favs(uid), favs, 0);
                return token;
            } else if (session.alarm != undefined) {
                const i = session?.alarm;
                const alarm = token?.user?.alarm || [];
                alarm.splice(i, 1);
                token.user.alarm = alarm;
                json.write(dir.user.alarm(uid), alarm);
                return token;
            } else {
                token?.user?.queue?.push(session);
                return token;
            }
        }
        if (!user) return token;
        token.user = user;
        return token;
    },
    session({ session, token }) {
        session.user = token?.user;
        return session;
    }
}

/**
 * session strategy는 default가 jwt이므로 생략가능
 */
export default async function auth(req, res) {
    return await NextAuth(req, res, {
        providers,
        callbacks,
        session: {
            strategy: "jwt",
        },

    })
}