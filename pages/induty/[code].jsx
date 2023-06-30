import { useRouter } from "next/router";
import IndutyFold from "#/stockFold/IndutyFold";

const Index = ({ meta, price, induty, index, predict }) => {
    const router = useRouter();
    const { code } = router.query;

    const props = {
        meta, code, price, induty, index, predict, router,
        folded: false,
    };
    return <>
        <div>
            <IndutyFold {...props} />
        </div>
    </>
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(Index);