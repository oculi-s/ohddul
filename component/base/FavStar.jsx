import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { json } from "@/pages/api/xhr";
import dir from "@/module/dir";

async function toggleFav({ favs, setFavs, userFavs, code, uid }) {
    if (!uid) {
        alert("로그인 후 이용해주세요");
        return;
    }
    setFavs(!favs);
    await json.toggle({
        url: dir.user.fav(uid),
        data: code
    });
    if (userFavs.find(e => e == code)) userFavs.remove(code);
    else userFavs.push(code);
}

/**
 * 문제점 : onlogin에서 데이터가 전달되지 않으니 next_auth를 통해 큰 데이터를 보내줘야 할지
 * 
 * 아니면 router.reload를 통해 데이터 fetching이 다시 되도록 할지 고민해봐야함
 * 그리고 userFavs와 같이 데이터를 개별로 보낼게 아니라 user라는 object로 보내서 userFavs를 실시간으로 수정할 수 있도록 해야 함
 */
export default function FavStar({ code, userFavs }) {
    const { data: session } = useSession();
    const [favs, setFavs] = useState();
    useEffect(() => {
        const orig = userFavs?.find(e => e == code);
        // console.log(userFavs);
        setFavs(orig);
    }, [userFavs, code, session])
    const uid = session?.user?.uid;
    return <span className={`${favs ? 'yellow' : ''}`}
        style={{ paddingRight: '5px', fontSize: "1.2em", cursor: "pointer" }}
    >
        <span
            className={`fa fa-star${favs ? '' : '-o'}`}
            onClick={e => { toggleFav({ favs, setFavs, userFavs, code, uid }); }} />
    </span>;
}