import { useEffect, useState } from "react";
import { json } from "@/pages/api/xhr";
import dir from "@/module/dir";
import { useSession } from "next-auth/react";

async function toggleFav({ User, setUser, code, uid, update }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    const favs = await json.toggle({
        url: dir.user.favs(uid),
        data: code
    });
    update({ favs: favs });
    // setUser({ ...User });
}

export default function FavStar({ code, User, setUser }) {
    const { data: session, update } = useSession();
    const [favs, setFavs] = useState();
    const orig = session?.user?.favs?.find((e) => e === code);
    useEffect(() => {
        setFavs(orig);
    }, [session?.user?.favs, code, orig]);
    const uid = session?.user?.uid;
    return (
        <span
            className={`${favs ? 'yellow' : ''}`}
            style={{ paddingRight: '5px', fontSize: '1.2em', cursor: 'pointer' }}
        >
            <span
                className={`fa fa-star${favs ? '' : '-o'}`}
                onClick={(e) => {
                    toggleFav({ User, setUser, code, uid, update });
                }}
            />
        </span>
    );
}