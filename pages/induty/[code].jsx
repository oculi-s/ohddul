import { useRouter } from "next/router";
import IndutyFold from "#/stockFold/IndutyFold";
import { Big } from "@/module/ba";
import Container from "@/container/light";

import json from '@/module/json';
import dir from '@/module/dir';
import { getSession } from "next-auth/react";
import { CrawlUser } from "@/module/prop/props";
import { filterIndex } from "@/module/filter/filter";

export async function getServerSideProps(ctx) {
    const code = ctx.query?.code;
    const aside = json.read(dir.stock.light.aside);
    const Index = json.read(dir.stock.induty).data;
    const Induty = json.read(dir.stock.dart.induty).data;

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => Induty[k] == code))
    }

    const index = await filterIndex(Index, code);
    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);
    const meta = Filter(Meta);
    const price = Filter(Price);
    const induty = Filter(Induty);

    let props = { aside, meta, index, price, induty };
    await CrawlUser(ctx, props);
    return { props };
}

const Index = ({ meta, price, induty, index, predict, User, setUser }) => {
    console.log(index);
    const router = useRouter();
    const { code } = router.query;
    const name = index?.data[Big(code)]?.n;
    const props = {
        meta, code, price, induty, index, predict, router,
        User, setUser, folded: true,
    };
    return <>
        <div>
            <h2>{name}</h2>
            <hr />
            <IndutyFold {...props} />
        </div >
    </>
}

export default Container(Index);