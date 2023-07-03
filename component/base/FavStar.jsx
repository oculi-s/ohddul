import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/router';
import toggleOnPageChange from "#/toggle";
import { json } from "@/pages/api/xhr";
import dir from "@/module/dir";

async function toggleFav({ favs, setFavs, code, uid }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    setFavs(!favs);
    await json.toggle({
        url: dir.user.fav(uid),
        data: code
    });
}

export default function FavStar({ code, userFavs }) {
    const { data: session } = useSession();
    const orig = userFavs?.find(e => e == code);
    const [favs, setFavs] = useState(orig);
    const router = useRouter();
    const uid = session?.user?.uid;
    toggleOnPageChange(router, setFavs, orig);
    return <span className={`${favs ? 'yellow' : ''}`}
        style={{ paddingRight: '5px', fontSize: "1.2em", cursor: "pointer" }}
    >
        <span
            className={`fa fa-star${favs ? '' : '-o'}`}
            onClick={e => { toggleFav({ favs, setFavs, code, uid }); }} />
    </span>;
}