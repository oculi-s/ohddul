import json from '@/module/json';
import HEAD from '#/common/Head';
import Nav from '#/common/nav'
import Aside from '#/common/aside'
import Footer from '#/common/footer'
import dir from '@/module/dir';
import { getSession } from 'next-auth/react';
import { Loading } from '#/_base';
import { useState } from 'react';
import { editQuar, earnStack, earnonPrice } from '@/module/editData/earnStack';
import { priceDivide } from '@/module/editData/priceDivide';

import '@/module/array';

/**
 * user가 존재하는 경우이거나 user의 페이지인 경우 유저 데이터를 불러와야함.
 * 
 * 그런데 유저데이터는 동적으로 수정이 가능해야하니까 object에 담아 보내면서
 * useState를 통해 실시간 수정되는 내용이 반영되도록 해야함
 * pred도 마찬가지이고 수정필요. 2023.07.04
 * 
 * 로그인된 유저가 존재할 때 구현방식 : api/auth에 담아 보낸다.
 * useSession을 통해 사용 가능
 * {@link './pages/api/auth/[...nextauth].jsx'}
 */
export async function getServerSideProps(ctx) {
	let userMeta = {};
	let aside = {}, price = [], meta = {}, group = {}, predict = {};
	let index = {}, induty = {}, user = { pred: [], favs: [] };
	let props = {
		userMeta, price, meta, group, predict,
		index, induty, user
	};

	const session = await getSession(ctx);
	if (session?.user) {
		const uid = session?.user?.uid;
		user.favs = json.read(dir.user.favs(uid));
		user.pred = json.read(dir.user.pred(uid)).queue;
		console.log(user.favs.length);
		props = { ...props, user };
	}

	try {
		aside = json.read(dir.stock.light.aside);
		meta = json.read(dir.stock.meta);
		group = json.read(dir.stock.group);
		price = json.read(dir.stock.all);
		predict = json.read(dir.stock.predAll);
		userMeta = json.read(dir.user.meta);
		index = json.read(dir.stock.induty);
		induty = json.read(dir.stock.dart.induty);
		props = {
			userMeta, aside,
			price, meta, group, index, induty,
			predict, user,
		};

		let code = ctx.query?.code;
		if (!parseInt(code)) code = meta.index[code];
		const N = 252 * 5;
		// stockPage
		if (code) {
			const stockPrice = json.read(dir.stock.light.price(code));
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
	} catch (e) {
		console.log(e);
	}

	return { props };
}

export default function Container(Component) {
	return function Index(props) {
		const [mobAside, setAsideShow] = useState(false);
		const [User, setUser] = useState();
		if (!User) {
			setUser(props?.user);
		}

		if (props?.status == 'loading') return Loading();
		props = {
			...props,
			mobAside, setAsideShow,
			User, setUser,
		};
		return (
			<>
				<HEAD />
				<Nav {...props} />
				<Aside {...props} />
				<main>
					<Component {...props} />
				</main>
				<Footer />
			</>
		);
	};
}