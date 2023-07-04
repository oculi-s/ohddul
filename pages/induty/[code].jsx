import { useRouter } from "next/router";
import IndutyFold from "#/stockFold/IndutyFold";
import { Big } from "@/module/ba";

const Index = ({ meta, price, induty, index, predict, userFavs }) => {
    const router = useRouter();
    const { code } = router.query;
    const name = index?.data[Big(code)]?.n;
    const props = {
        meta, code, price, induty, index, predict, router,
        userFavs, folded: true,
    };
    return <>
        <div>
            <h2>{name}</h2>
            <hr />
            <IndutyFold {...props} />
        </div >
    </>
}

import container, { getServerSideProps } from "@/container/heavy";
export { getServerSideProps };
export default container(Index);