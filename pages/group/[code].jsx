import { useRouter } from "next/router";
import GroupFold from "../stock/Group";

const Index = ({ meta, price, group, predict }) => {
    const router = useRouter();
    const { code } = router.query;

    const props = {
        meta, code, price, group, predict, router,
        folded: false,
    };
    return <>
        <div>
            <GroupFold {...props} />
        </div>
    </>
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(Index);