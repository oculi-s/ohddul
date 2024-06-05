import styles from '$/Group/Induty.module.scss';
import IndutyFold from "@/components/stockFold/IndutyFold";
import { useRouter } from "next/router";

import dir from '@/module/dir';
import { filterIndex } from "@/module/filter/filter";
import json from '@/module/json';

export async function getServerSideProps(ctx) {
    const Index = json.read(dir.stock.light.index).data;
    const Induty = json.read(dir.stock.light.induty).data;
    let code = ctx.query?.code?.find(e => true) || '전체';
    if (!Index[code]) code = Object.keys(Index)?.find(e => Index[e]?.n == code) || '';

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => Induty[k] == code))
    }

    let meta = {}, price = {}, induty = {}, index = {}, title = null;
    let props = { code };
    if (code == '_') {
        index = await filterIndex(Index, '');
        title = '전체 업종 : 오떨';
    } else if (Index[code]) {
        index = await filterIndex(Index, code);
        const Meta = json.read(dir.stock.meta).data;
        const Price = json.read(dir.stock.all);
        meta = Filter(Meta);
        price = Filter(Price);
        induty = Filter(Induty);
        title = index[code] ? `${index[code]?.n} : 오떨` : null;
    }
    props = { ...props, meta, index, price, induty, title };
    return { props };
}

function Induty({ code, meta, price, induty, index, predict, User, setUser }) {
    const router = useRouter();
    if (!Object.keys(index)?.length) return <>업종 정보가 없습니다.</>;
    const name = index[code]?.n;
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