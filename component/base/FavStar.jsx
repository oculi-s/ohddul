import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

async function toggleFav({ code, uid, update }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    update({ favs: code });
}

export default function FavStar({ code }) {
    const { data: session, update } = useSession();
    const [favs, setFavs] = useState();
    const orig = session?.user?.favs[code];
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
                    toggleFav({ code, uid, update });
                }}
            />
        </span>
    );
}