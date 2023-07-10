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
    const induty = json.read(dir.stock.induty).data;
    const lastmod = new Date().toISOString();
    const priority = 1;

    const defaultFields = [{
        loc: process.env.URL,
        priority, lastmod,
    }, {
        loc: `${process.env.URL}/help`,
        priority, lastmod,
    },];

    const stocks = Object.keys(meta).map(code => ({
        loc: `${process.env.URL}/stock/${code}`,
        priority, lastmod,
    }));

    const stockName = Object.values(meta).map(meta => ({
        loc: `${process.env.URL}/stock/${encodeURIComponent(meta.n)}`,
        priority, lastmod,
    }))

    const induties = Object.keys(induty).map(iname => ({
        loc: `${process.env.URL}/induty/${iname.slice(1)}`,
        priority, lastmod,
    }));
    const groups = Object.keys(group).map(gname => ({
        loc: `${process.env.URL}/group/${encodeURIComponent(gname)}`,
        priority, lastmod,
    }));

    const fields = [...defaultFields, ...stocks, ...stockName, ...induties, ...groups];
    return getServerSideSitemapLegacy(ctx, fields);
}

export default function Index() { };