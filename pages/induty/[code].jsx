import styles from '$/Group/Induty.module.scss';
import { useRouter } from "next/router";
import IndutyFold from "#/stockFold/IndutyFold";
import { Big } from "@/module/ba";

import json from '@/module/json';
import dir from '@/module/dir';
import { CrawlUser } from "@/module/prop/props";
import { filterIndex } from "@/module/filter/filter";

export async function getServerSideProps(ctx) {
    const code = ctx.query?.code;
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

    const title = index[Big(code)] ? `${index[Big(code)]?.n} : 오떨` : null;
    let props = { meta, index, price, induty, title };
    return { props };
}

function Induty({ meta, price, induty, index, predict, User, setUser }) {
    const router = useRouter();
    const { code } = router.query;
    const name = index[Big(code)]?.n;
    const props = {
        meta, code, price, induty, index, predict, router,
        User, setUser
    };
    return <>
        <div>
            <h2 className={styles.title}>{name}</h2>
            <hr />
            <IndutyFold {...props} />
        </div>
    </>;
}

export default Induty;