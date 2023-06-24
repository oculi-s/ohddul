import json from '@/module/json';
import Head from 'next/head'
import Nav from '@/pages/common/nav'
import Aside from '@/pages/common/aside'
import Footer from '@/pages/common/footer'
import dir from '@/module/dir';
import { getSession, useSession } from 'next-auth/react';
import { Loading, Updating } from '@/component/_base';
import { useState } from 'react';
import { edit4Q, earnStack, earnonPrice } from '@/component/chart/earnStack';

Array.prototype.remove = function (v) {
	let i = this.indexOf(v);
	if (i > -1) this.splice(i, 1);
}
export const getServerSideProps = async (ctx) => {
	const updating = json.read('$/.update', { updating: 0 }).updating;
	let userMeta = {}, price = [], meta = {}, group = {}, predict = {};
	let index = {}, induty = {};
	let props = {
		userMeta, price, meta, group, predict,
		index, induty, updating
	};
	if (updating) return { props };

	try {
		const code = ctx.query?.code;

		meta = json.read(dir.stock.meta);
		group = json.read(dir.stock.group);
		price = json.read(dir.stock.all);
		predict = json.read(dir.stock.predAll);
		userMeta = json.read(dir.user.meta);
		index = json.read(dir.stock.induty);
		induty = json.read(dir.stock.dart.induty);
		props = {
			updating, userMeta,
			price, meta, group, index, induty,
			predict,
		};

		const N = 252 * 5;
		// stockPage
		if (code) {
			const stockPrice = json.read(dir.stock.price(code));
			stockPrice.data = stockPrice.data.slice(0, N);
			const stockEarn = json.read(dir.stock.earn(code));
			stockEarn.data = stockEarn.data.filter(e => e.data);
			await edit4Q(stockEarn);
			await earnStack(stockEarn);
			await earnonPrice({ stockPrice, stockEarn });
			const stockShare = json.read(dir.stock.share(code));
			const stockPredict = json.read(dir.stock.pred(code));
			props = { ...props, stockPrice, stockEarn, stockShare, stockPredict };
		} else {
			const market = json.read(dir.stock.market, { kospi: [], kosdaq: [] });
			market.kospi = market.kospi?.slice(0, N);
			market.kosdaq = market.kosdaq?.slice(0, N);
			props = { ...props, market };
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
			props = { ...props, userPred };
		}
	} catch (e) {
		console.log(e);
	}

	return { props }
};

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
		if (props.updating) return Updating();
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