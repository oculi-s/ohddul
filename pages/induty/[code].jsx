import { useRouter } from "next/router";
import IndutyFold from "#/stockFold/IndutyFold";
import { Big } from "@/module/ba";

const Index = ({ meta, price, induty, index, predict }) => {
    const router = useRouter();
    const { code } = router.query;
    const name = index?.index[Big(code)];
    const props = {
        meta, code, price, induty, index, predict, router,
        folded: true,
    };
    return <>
        <div>
            <h2>{name}</h2>
            <hr />
            <IndutyFold {...props} />
        </div>
    </>
}

import container, { getServerSideProps } from "@/container";
export { getServerSideProps };
export default container(Index);