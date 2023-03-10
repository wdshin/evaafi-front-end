import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, Slice, Address, TonClient, fromNano, TupleBuilder } from 'ton';
import { randomAddress } from '../utils'

export const toncenter = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

export const masterContractAddress = Address.parse('EQBppIY6_jeZOmkYjdAmhHsO3YRPWC5vA6LOdRy4OkhhpeIS');


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
    const updateData = async () => {
        let args = new TupleBuilder();
        args.writeAddress(randomAddress('usdt'));

        let { stack } = await toncenter.runMethod(
            masterContractAddress,
            'getUIVariables',
            args.build(),
        );
        console.log('1---------------')

        stack.readCell().beginParse(); // important 

        const dict = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                // ;;		.store_int(price, 64)
                // ;;		.store_int(s_rate, 64)
                // ;;		.store_int(b_rate, 64)
                // ;;		.store_int(total_supply_principal, 64)
                // ;;		.store_int(total_borrow_principal, 64)
                // ;;		.store_int(last_accural, 64)

                const price = src.loadUint(64);                       // price
                const s_rate = src.loadUint(64);                      // s_rate
                const b_rate = src.loadUint(64);                      // b_rate
                const totalSupply = fromNano(src.loadUint(64));  // total_supply
                const totalBorrow = fromNano(src.loadUint(64));  // total_borrow
                const lastAccural = src.loadUint(64);
                const balance = 100;               // last_accural

                return { price, s_rate, b_rate, totalSupply, totalBorrow, lastAccural, balance };
            }
            //@ts-ignore
        }, stack.readCellOpt())

        function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
            const bufferAsHexString = buffer.slice(start, end).toString("hex");
            return BigInt(`0x${bufferAsHexString}`);
        }
        let data = dict.get(bufferToBigInt(randomAddress('usdt').hash))

        console.log(data, " usdt");

        // const supplyBalance = data.totalSupply;
        // set({ supplyBalance });

        // const borrowBalance = data.totalBorrow;
        // set({ borrowBalance });

        console.log(bufferToBigInt(randomAddress('usdt').hash))
        console.log(dict.keys())
        console.log(dict.values())


        console.log('2---------------')
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
        console.log('3--------------')
        conf.loadRef()
        const confItems = conf.loadRef().beginParse()

        const dictConf = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), { //asset config
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const oracle = src.loadAddress();             //store_slice(oracle)
                const decimals = src.loadUint(8);             //.store_uint(decimals, 8)
                const ref = src.loadRef().beginParse();       //.store_ref(begin_cell()
                const collateralFactor = ref.loadUint(16);    //.store_uint(collateral_factor, 16) 
                const liquidationThreshold = ref.loadUint(16);//.store_uint(liquidation_threshold, 16) 
                const liquidationPenalty = ref.loadUint(16);  // .store_uint(liquidation_penalty, 16)
                const baseBorrowRate = ref.loadUint(64);      //.store_uint(base_borrow_rate, 64) 
                const borrowRateSlopeLow = ref.loadUint(64);  //.store_uint(borrow_rate_slope_low, 64) 
                const borrowRateSlopeHigh = ref.loadUint(64); //.store_uint(supply_rate_slope_low, 64) 
                const supplyRateSlopeLow = ref.loadUint(64);  //.store_uint(supply_rate_slope_low, 64) 
                const supplyRateSlopeHigh = ref.loadUint(64); //.store_uint(supply_rate_slope_high, 64) 
                const targeUtilization = ref.loadUint(64);    //.store_uint(target_utilization, 64) 

                return {
                    oracle, decimals, collateralFactor, liquidationThreshold,
                    liquidationPenalty, baseBorrowRate, borrowRateSlopeLow,
                    borrowRateSlopeHigh, supplyRateSlopeLow, supplyRateSlopeHigh, targeUtilization
                };
            }
            //@ts-ignore
        }, confItems.loadRef().beginParse())
        // get asset config by add -------
        console.log(dictConf.get(bufferToBigInt(randomAddress('usdt').hash)))
        console.log('4---------------')
        console.log(confItems.loadUint(8)) //if active = -1 (true) / 0 (false)
        console.log('5---------------')


       //@ts-ignore
        const rates = stack.pop().cell.beginParse()
        // console.log(hex2a(rates.loadRef().beginParse().toString().slice(2).slice(0, -1)))
        // rates.loadRef()
        const ratesItems = rates.loadRef().beginParse()

        const dictRates = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {

                const s_ratePerSecond = src.loadUint(64); //s_rate_per_second 64bit
                const b_ratePerSecond = src.loadUint(64); //b_rate_per_second 64bit

                return { s_ratePerSecond, b_ratePerSecond };
            }
            //@ts-ignore
        }, ratesItems.loadRef().beginParse())
        
        console.log(dictRates.get(bufferToBigInt(randomAddress('usdt').hash)))

        // console.log('7---------------')
        // console.log(ratesItems.loadUint(8)) //if active = -1 (true) / 0 (false)
        // console.log('8---------------')


        //reserves
        /** - reserve 64bit */
    }

    setInterval(updateData, 50000);
    updateData();

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
            id: '1211ccc1',
            token: Token.USDT,

            liquidity: '312',
            apy: 0.4,
        }],
    }
});
