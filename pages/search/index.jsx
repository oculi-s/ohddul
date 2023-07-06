import { useRouter } from 'next/router'
import Link from 'next/link'
import json from '@/module/json';
import dir from '@/module/dir';

import { getSession } from 'next-auth/react';
import container from "@/container/light";

export async function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const session = await getSession(ctx);
    const props = { aside, session };
    return { props };
}

const Header = ({ router }) => (
    <h1>검색어 : {router.query?.q}</h1>
)

const Index = () => {
    const router = useRouter();
    const props = { router }
    return (
        <>
            <Header {...props} />
        </>
    )
}

export default container(Index);