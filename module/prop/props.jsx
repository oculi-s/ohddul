import { getSession } from "next-auth/react";
import json from "../json";
import dir from "../dir";

export async function CrawlUser(ctx, props) {
    const session = await getSession(ctx);
    if (session?.user) {
        const user = {};
        const uid = session?.user?.uid;
        user.favs = json.read(dir.user.favs(uid));
        user.pred = json.read(dir.user.pred(uid)).queue;
        props.user = user;
    }
}