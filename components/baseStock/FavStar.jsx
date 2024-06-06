import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

async function toggleFav({ code, uid, update }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    update({ favs: code });
}

export default function FavStar({ code }) {
    const { data: session, update } = useSession();
    const orig = session?.user?.favs?.includes(code);
    const [favs, setFavs] = useState(orig);
    useEffect(() => {
        setFavs(orig);
    }, [code, session?.user?.favs]);
    const uid = session?.user?.uid;
    return (
        <span
            className={`cursor-pointer inline-block ${favs ? 'text-yellow-500' : 'text-gray-500'}`}
        >
            {favs ? <FaStar
                onClick={(e) => {
                    toggleFav({ code, uid, update });
                }}
            /> : <FaRegStar
                onClick={(e) => {
                    toggleFav({ code, uid, update });
                }}
            />}
        </span>
    );
}