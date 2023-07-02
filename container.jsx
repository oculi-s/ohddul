import json from '@/module/json';
import Head from 'next/head'
import Nav from '#/common/nav'
import Aside from '#/common/aside'
import Footer from '#/common/footer'
import dir from '@/module/dir';
import { getSession, useSession } from 'next-auth/react';
import { Loading } from '#/_base';
import { useState } from 'react';
import { editQuar, earnStack, earnonPrice } from '@/module/editData/earnStack';
import { priceDivide } from '@/module/editData/priceDivide';

import '@/module/array';

export async function getServerSideProps(ctx) {
	let userMeta = {}, price = [], meta = {}, group = {}, predict = {};
	let index = {}, induty = {};
	let props = {
		userMeta, price, meta, group, predict,
		index, induty
	};

	try {
		meta = json.read(dir.stock.meta, { data: {}, index: {} });
		group = json.read(dir.stock.group);
		price = json.read(dir.stock.all);
		predict = json.read(dir.stock.predAll);
		userMeta = json.read(dir.user.meta);
		index = json.read(dir.stock.induty);
		induty = json.read(dir.stock.dart.induty);
		props = {
			userMeta,
			price, meta, group, index, induty,
			predict,
		};

		let code = ctx.query?.code;
		if (!parseInt(code)) code = meta.index[code];
		const N = 252 * 5;
		// stockPage
		if (code) {
			const stockPrice = json.read(dir.stock.priceClose(code));
			stockPrice.data = stockPrice.data.slice(0, N);
			const stockShare = json.read(dir.stock.share(code));
			const stockPredict = json.read(dir.stock.pred(code));
			await priceDivide(stockPrice);
			const stockEarn = json.read(dir.stock.earn(code));
			stockEarn.data = stockEarn.data.filter(e => e.data);
			await editQuar(stockEarn);
			await earnStack(stockEarn);
			await earnonPrice({ stockPrice, stockEarn });
			props = { ...props, stockPrice, stockEarn, stockShare, stockPredict };
		}

		// userExist
		let userInfo = (await getSession(ctx))?.user;
		if (userInfo) {
			const { uid } = userInfo;
			const userPred = json.read(dir.user.pred(uid), { queue: [], data: [] });
			const userFavs = json.read(dir.user.fav(uid), []);
			props = { ...props, userPred, userFavs };
		}

		// userPage
		if (ctx.query?.id) {
			const id = ctx.query.id;
			const uid = Object.keys(userMeta).find(k => userMeta[k].id == id);
			const userPred = json.read(dir.user.pred(uid), { queue: [], data: [] });
			const userFavs = json.read(dir.user.fav(uid), []);
			props = { ...props, userPred, userFavs };
		}
	} catch (e) {
		console.log(e);
	}

	return { props };
}

const HEAD = () => {
	return (
		<Head>
			<title>오르고 떨어지고, 오떨</title>
			<meta name="description" content="예측으로 얘기하자! 오르고 떨어지고, 오떨" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"></meta>
			<link rel="icon" href="/favicon.ico" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css"></link>
		</Head>
	)
}

export default function Container(Component) {
	return function Index(props) {
		const [mobAside, setAsideShow] = useState(false);
		const { status } = useSession();
		// 두번 rendering되는 것을 방지하는데 필요하면 사용해볼 것.
		// https://stackoverflow.com/questions/72673362/error-text-content-does-not-match-server-rendered-html
		// const [hydrated, setHydrated] = useState(false);
		// useEffect(() => {
		// 	setHydrated(true);
		// }, []);
		// if (!hydrated) return null;
		if (status == 'loading') return Loading();
		props = {
			...props,
			mobAside, setAsideShow,
		};
		return (
			<>
				<HEAD></HEAD>
				<Nav {...props}></Nav>
				<Aside {...props}></Aside>
				<main>
					<Component {...props} />
				</main>
				<Footer></Footer>
			</>
		);
	};
}