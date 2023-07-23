import { getServerSideSitemapLegacy } from 'next-sitemap';
import json from '@/module/json';
import dir from '@/module/dir';

/**
 * sitemap.xml을 생성하는 페이지
 * 
 * changefreq: optional, 'daily'
 * 
 */
export async function getServerSideProps(ctx) {
    const meta = json.read(dir.stock.meta).data;
    const group = json.read(dir.stock.group).data;
    const induty = json.read(dir.stock.light.index).data;
    const lastmod = new Date().toISOString();
    const priority = 1;

    const defList = [
        '', 'help', 'induty', 'group',
        'stock/sum', 'stock/up', 'stock/down'
    ]
    const defaultFields = defList.map(e => ({
        loc: `${process.env.URL}/${e}`,
        priority, lastmod,
    }));

    const stocks = Object.keys(meta).map(code => ({
        loc: `${process.env.URL}/stock/${code}`,
        priority, lastmod,
    }));

    const stockName = Object.values(meta).map(meta => ({
        loc: `${process.env.URL}/stock/${encodeURIComponent(meta.n)}`,
        priority, lastmod,
    }))

    const induties = Object.keys(induty).map(icode => ({
        loc: `${process.env.URL}/induty/${icode}`,
        priority, lastmod,
    }));

    const indutyName = Object.values(induty).map(meta => ({
        loc: `${process.env.URL}/induty/${encodeURIComponent(meta.n)}`,
        priority, lastmod,
    }));

    const groups = Object.keys(group).map(gname => ({
        loc: `${process.env.URL}/group/${encodeURIComponent(gname)}`,
        priority, lastmod,
    }));

    const fields = [
        ...defaultFields, ...stocks, ...stockName,
        ...induties, ...indutyName, ...groups
    ];
    return getServerSideSitemapLegacy(ctx, fields);
}

export default function Index() { };