import { getSession } from "next-auth/react";
import json from "../json";
import dir from "../dir";

export async function CrawlUser(ctx, props) {
    const session = await getSession(ctx);
    props.session = session;
    if (session?.user) {
        const user = {};
        const uid = session?.user?.uid;
        user.favs = json.read(dir.user.favs(uid), []);
        user.queue = json.read(dir.user.pred(uid), { queue: [] })?.queue;
        props.user = user;
    }
}