import { useRouter } from 'next/router'
import json from '@/module/json';
import dir from '@/module/dir';

import { getSession } from 'next-auth/react';

export async function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const session = await getSession(ctx);
    const props = { aside, session };
    return { props };
}

function Header({ router }) {
    return (
        <h1>검색어 : {router.query?.q}</h1>
    );
}

function Search() {
    const router = useRouter();
    const props = { router };
    return (
        <>
            <Header {...props} />
        </>
    );
}

export default Search;