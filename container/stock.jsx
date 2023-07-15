import json from '@/module/json';
import dir from '@/module/dir';

import '@/module/array';
import { filterIndex } from '@/module/filter/filter';
import NameDict from '#/stockData/NameDict';

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
/**
 * Filter를 통해 사이즈 줄이기
 * * 줄이기 전 405kb
 * * group : 405 --> 389 (-16kb)
 * * meta : 389 --> 262 (-127kb)
 * * induty : 262 --> 222 (-40kb)
 * * price : 222 --> 150 (-72kb)
 * * meta.index : 149 --> 87 (-62kb)
 */
export async function getServerSideProps(ctx) {
	const Meta = json.read(dir.stock.meta);
	let code = ctx.query?.code;
	if (!parseInt(code)) code = Meta.index[code] || false;
	let props = { code }

	// stockPage
	const stockMeta = Meta?.data[code] || false;
	const earn = json.read(dir.stock.light.earn(code));
	const share = json.read(dir.stock.share(code))
	share.data = share.data?.filter(e => e.amount);
	const stockPred = json.read(dir.stock.pred(code));
	props = { ...props, stockMeta, earn, share, stockPred };

	const Group = json.read(dir.stock.light.group);
	const Index = json.read(dir.stock.induty).data;
	const Induty = json.read(dir.stock.dart.induty).data;

	const gname = Group?.index[code];
	const iname = Induty[code];
	const index = await filterIndex(Index, iname);
	const group = Group.data[gname] || false;

	const Filter = (data) => {
		return Object.fromEntries(Object.entries(data)
			?.filter(([k, v]) => {
				if (k == code) return 1;
				if (iname && Induty[k] == iname) return 1;
				if (gname && Group?.index[k] == gname) return 1;
				if (share.data?.find(e => Meta.data[k]?.n == (NameDict[e.name] || e.name)))
					return 1;
				return 0;
			}))
	}
	const FilterIndex = data => {
		return Object.fromEntries(Object.entries(data)
			?.filter(([k, v]) => {
				if (v == code) return 1;
				if (iname && Induty[v] == iname) return 1;
				if (gname && Group?.index[v] == gname) return 1;
				if (share.data?.find(e => Meta.data[v]?.n == (NameDict[e.name] || e.name)))
					return 1;
				return 0;
			}))
	}

	const meta = json.read(dir.stock.meta);
	const induty = Filter(Induty);
	meta.data = Filter(meta.data);
	meta.index = FilterIndex(meta.index);

	const Price = json.read(dir.stock.all);
	const price = Filter(Price);
	const predict = json.read(dir.stock.predAll);
	const ids = json.read(dir.user.ids);

	const title = Meta.data[code] ? `${Meta.data[code]?.n} : 오떨` : null;
	props = {
		...props,
		title, ids,
		price, meta, group, index, induty,
		predict,
	};

	return { props };
}