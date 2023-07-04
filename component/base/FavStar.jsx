import { useEffect, useState } from "react";
import { json } from "@/pages/api/xhr";
import dir from "@/module/dir";
import { useSession } from "next-auth/react";

async function toggleFav({ User, setUser, code, uid }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    User.favs = await json.toggle({
        url: dir.user.favs(uid),
        data: code
    });
    setUser({ ...User });
}

export default function FavStar({ code, User, setUser }) {
    const { data: session } = useSession();
    const [favs, setFavs] = useState();
    const orig = User?.favs?.find((e) => e === code);
    useEffect(() => {
        setFavs(orig);
    }, [User?.favs, code, orig]);
    const uid = session?.user?.uid;
    return (
        <span
            className={`${favs ? 'yellow' : ''}`}
            style={{ paddingRight: '5px', fontSize: '1.2em', cursor: 'pointer' }}
        >
            <span
                className={`fa fa-star${favs ? '' : '-o'}`}
                onClick={(e) => {
                    toggleFav({ User, setUser, code, uid });
                }}
            />
        </span>
    );
}