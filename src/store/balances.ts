import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, Slice, Address, TonClient, fromNano, TupleBuilder } from 'ton';
import Prando from 'prando'
export const toncenter = new TonClient({
	endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
	apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

export const masterContractAddress = Address.parse('EQBppIY6_jeZOmkYjdAmhHsO3YRPWC5vA6LOdRy4OkhhpeIS');

// const httpProvider = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: '49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54' });
const addressTon = Address.parse('EQDvaNEqFsgjbVFz6YjWAChLA6nhph4hww7GiDuyd0H45rtb');
// const addressUsdt = new TonWeb.Address('EQCW6UgiSzMp6FwCJQ_cFsyn3oJXfnDdNdH10q_9_6vHIh6y');


interface MySupply {
	id: string;
	token: Token;
	balance: string;
	apy: number;
	earned: string;
}

interface MyBorrow {
	id: string;
	token: Token;
	balance: string;
	apy: number;
	accrued: string;
}

interface Supply {
	id: string;
	token: Token;
	balance: string;
	apy: number;
}

interface Borrow {
	id: string;
	token: Token;
	liquidity: string;
	apy: number;
}

interface BalanceStore {
	borrowBalance: string;
	supplyBalance: string;
	availableToBorrow: string;
	borrowLimitPercent: number;
	borrowLimitValue: number;
	mySupplies: MySupply[];
	myBorrows: MyBorrow[];
	supplies: Supply[];
	borrows: Borrow[];
}

export const useBalance = create<BalanceStore>((set) => {
	setInterval(async () => {
		let args = new TupleBuilder();
		args.writeAddress(addressTon);

		let { stack } = await toncenter.runMethod(
			masterContractAddress,
			'getUIVariables',
			args.build(),
		);
		console.log('---------------')
		const item = stack.readCell().beginParse(); // important

		// const dict = Dictionary.loadDirect(, () => {
		// 	}
		// 		item)
		const dict = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
			serialize: (src: any, buidler: any) => {
				buidler.storeSlice(src);
			},
			parse: (src: Slice) => {
				// ;;						.store_int(price, 64)
				// ;;		.store_int(s_rate, 64)
				// ;;		.store_int(b_rate, 64)
				// ;;		.store_int(total_supply_principal, 64)
				// ;;		.store_int(total_borrow_principal, 64)
				// ;;		.store_int(last_accural, 64)

				const a = src.loadUint(64); // price
				const b = src.loadUint(64);
				const c = src.loadUint(64);
				const d = src.loadUint(64);
				const e = src.loadUint(64);
				const f = src.loadUint(64);

				return { a, b, c, d, e, f };
			}
			//@ts-ignore
		}, stack.readCellOpt())

		function randomAddress(seed: string, workchain?: number) {
			const random = new Prando(seed);
			const hash = Buffer.alloc(32);
			for (let i = 0; i < hash.length; i++) {
				hash[i] = random.nextInt(0, 256);
			}
			return new Address(workchain ?? 0, hash);
		}

		function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
			const bufferAsHexString = buffer.slice(start, end).toString("hex");
			return BigInt(`0x${bufferAsHexString}`);
		}

		console.log(bufferToBigInt(randomAddress('usdt').hash))
		console.log(dict.keys())
		console.log(dict.values())
		console.log(dict.get(bufferToBigInt(randomAddress('usdt').hash)))
		console.log('---------------')
		function hex2a(hexx: any) {
			var hex = hexx.toString();//force conversion
			var str = '';
			for (var i = 0; i < hex.length; i += 2)
				str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
			return str;
		}
		//@ts-ignore
		const conf = stack.pop().cell.beginParse()
		console.log(hex2a(conf.loadRef().beginParse().toString().slice(2).slice(0, -1)))
		console.log('---------------')
		conf.loadRef()
		const confItems = conf.loadRef().beginParse()

		const dictConf = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
			serialize: (src: any, buidler: any) => {
				buidler.storeSlice(src);
			},
			parse: (src: Slice) => {
				// ;;						.store_int(price, 64)
				// ;;		.store_int(s_rate, 64)
				// ;;		.store_int(b_rate, 64)
				// ;;		.store_int(total_supply_principal, 64)
				// ;;		.store_int(total_borrow_principal, 64)
				// ;;		.store_int(last_accural, 64)
				//
				//   .storeAddress(randomAddress('oracle'))
				// .storeUint(8, 8)
				// .storeRef(beginCell()
				// 	.storeUint(8300, 16)
				// 	.storeUint(9000, 16)
				// 	.storeUint(500, 16)
				// 	.storeUint(15854895991, 64)
				// 	.storeUint(25000000000, 64)
				// 	.storeUint(187500000000, 64)
				// 	.storeUint(10000000000, 64)
				// 	.storeUint(100000000000, 64)
				// 	.storeUint(new BN("B1A2BC2EC500000", 'hex'), 64) // todo move to BN
				// 	.endCell())
				// .endCell()
				//
				//
				// -------
				// ;; asset config data parser
				const a = src.loadAddress(); // price
				const b = src.loadUint(8);
				const ref = src.loadRef().beginParse();
				const c = ref.loadUint(16);
				const d = ref.loadUint(16);
				const e = ref.loadUint(16);
				const f = ref.loadUint(64);
				const g = ref.loadUint(64);
				const h = ref.loadUint(64);
				const hh = ref.loadUint(64);
				const hhh = ref.loadUint(64);
				const hhhh = ref.loadUint(64);

				// -------
				return { a, b, c, d, e, f, g, h, hh, hhh, hhhh };
			}
			//@ts-ignore
		}, confItems.loadRef().beginParse())
		// get asset config by add -------
		console.log(dictConf.get(bufferToBigInt(randomAddress('usdt').hash)))
		console.log('---------------')
		console.log(confItems.loadUint(8))//if active = -1 (true) / 0 (false)
		console.log('---------------')

		const supplyBalance = fromNano(stack.readNumber());
		set({ supplyBalance });

		args.writeNumber(1);

		// httpProvider.call2('EQDiZ2DfDp5Jgk0iInQOz18fa8Oe9GYcMm0IBXu0qgBObKie', 'getAvailableToBorrow', [['num', 1]]).then(arg => {
		//     const borrowBalance = TonWeb.utils.fromNano(arg);
		//     set({ borrowBalance })
		// });
		// const bytes = await cell.hash();
		// const hash = TonWeb.utils.bytesToHex(bytes)
		// httpProvider.call2('EQBppIY6_jeZOmkYjdAmhHsO3YRPWC5vA6LOdRy4OkhhpeIS', 'getAssetRates', [['cell', a]]).then(arg => {
		//     console.log(arg);
		//     const supplyBalance = TonWeb.utils.fromNano(arg);
		//     set({supplyBalance})
		// })

	}, 5000);


	return {
		borrowBalance: '0',
		supplyBalance: '0',
		borrowLimitPercent: 0.25,
		borrowLimitValue: 14,
		availableToBorrow: '60',
		mySupplies: [{
			id: 'fir12321st',
			token: Token.TON,
			balance: '23',
			apy: 0.25,
			earned: '13',
		}, {
			id: 'fir112st',
			token: Token.USDT,
			balance: '1',
			apy: 0.03,
			earned: '0.1',
		}],
		myBorrows: [{
			id: 'firs12t',
			token: Token.USDT,
			balance: '111',
			apy: 0.05,
			accrued: '22',
		}, {
			id: 'firs123t',
			token: Token.TON,
			balance: '111',
			apy: 0.05,
			accrued: '22',
		}],
		supplies: [{
			id: 'dkdskasdk',
			token: Token.USDT,
			balance: '302',
			apy: 0.32,
		}, {
			id: 'dkdsk1234asdk',
			token: Token.TON,
			balance: '2',
			apy: 0.32,
		}],
		borrows: [{
			id: '12asdfas',
			token: Token.TON,
			liquidity: '3322',
			apy: 0.3,
		}, {
			id: '1211ccc1',
			token: Token.USDT,

			liquidity: '312',
			apy: 0.4,
		}],
	}
});
