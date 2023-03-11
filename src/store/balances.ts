import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, beginCell, Slice, contractAddress, Address, Cell, TonClient, fromNano, TupleBuilder } from 'ton';
import { randomAddress } from '../utils'

export const toncenter = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

const userSCData = { "hex": "b5ee9c72c102330100039200000d00120017001d00220029002e003500900095009a009f00a400b100c200dd00e200e700ec00fd012b017e01830188018d019e01af01b401c801d901ff02040209020e02290248024d0252026f027c028c0291029602b002b802bd02e202e7030c038b03920114ff00f4a413f4bcf2c80b01020162090202012004030007bcd8339402015806050009b5c59e057002014808070009af7e7816c000b1af46f80d3610904183fa4337d29936c881471ea981c183fa0737d098780f2f8199378000b7c600b7c610f8053a6465816503e5ffe4e800f816e4659fe4e82a1001c183fa0b28894183fa3e37d2b609017409af81e47a0064c00202ca1f0a020120100b0201620f0c0201200e0d0015320040728fc0a0c1fd10e0001d0060c1fd039be864f5c2cff80c1c2000314c8803301cb1f500401cb3f5801cbff0101ca3f0101ca3fc98020120161102012015120201201413001d5d3ff0101fa00d33f0101d33f013180057571fe2030f01a6c2102fa4431588307f40e6fa130d23f013120c2ff96016f1001f023e0016f1101a3f023a3800a1f38780d3610904183fa4337d2c8471e00e91f8098a98a4183fa0737d09829934183fa0737d09800f80f2f8201780d88452f8511e1004d2819d42c54781189d001492f827110c183fa3e37d2f4081aaf82c0201201e170201201b180201201a19001d0830bfe4cc7c09381b04a8fc0968e0001d0830bfe4cc7c08f81b04a8fc08e8e00201201d1c0023208c03782dace9d900002a086829406a4120001d208c03782dace9d900002a006a41200047f10ff1018107f1018411806f05b59d3b200007f101800d4411806f05b59d3b200005482402012029200201582421020120232200314d33f0101d33f0101d33f0101d23f0101d23f0101d33f0131800395c8500601cb3f500401cb3f5801cb3f0101ca3f0101ca3f0101cb3fc980201202825020120272600353e9034c1f50c3434c3f4c3f4c3f4cff4cff4cff4cff4cff4cfcc2000153b51343e903e903d010c20001b5c85003cf1601cf16f400c9ed5480201202d2a0201202c2b002f65c60043232c1540173c59400fe8084f2dac4b332407ec02000b6be0a3e910c20201202f2e004564830002496dc78083000644c38082ac014883c01482a006a4e00300064806a244c78a020148313000450830002496dc78083000644c38082ac014883c00482a006a4e00300064806a244c78a001f71b088831c02456f8007434c0cc1c6c252103fcbc37bc0680f4c7c04074cfc048b00ca3900cbc0bd4dcfc0c951c843c099401283c09d50d89bc0cdc14c0b040278c49f04064d41ca8650c0068c5b8a54c141ca8407890cc1c013c0c08d660103c03563c06780c0d083000a5cc00b50c04bc06781b0c48300f0c3001e032000a30840ff2f09d7a03ee" }
export const masterContractAddress = Address.parse('EQBHau2sc4xoOP8lCPk7H6zkc3E-M3nzIAqBEpPcbMWFOiVG');
export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(userSCData.hex, 'hex'))[0];
const masterContractCode = oracleMasterSourceV1CodeCell
const userContractAddress_test = contractAddress(
    0,
    {
        code: masterContractCode,
        data: beginCell()
            .storeAddress(randomAddress('master'))
            .storeAddress(randomAddress('user')) // u need to put user wallet address here to calculate userContractAddress
            .storeDict()
            .endCell(),
    });

console.log(userContractAddress_test.toString());

function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
    const bufferAsHexString = buffer.slice(start, end).toString("hex");
    return BigInt(`0x${bufferAsHexString}`);
}

function hex2a(hexx: any) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

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
                const price = BigInt(src.loadUint(64));                       // price
                const s_rate = BigInt(src.loadUint(64));                      // s_rate
                const b_rate = BigInt(src.loadUint(64));                      // b_rate
                const totalSupply = BigInt(src.loadUint(64));  // total_supply
                const totalBorrow = BigInt(src.loadUint(64));  // total_borrow
                const lastAccural = BigInt(src.loadUint(64));
                const balance = 100;               // last_accural

                return { price, s_rate, b_rate, totalSupply, totalBorrow, lastAccural, balance };
            }
            //@ts-ignore
        }, stack.readCellOpt())

        let data = dict.get(bufferToBigInt(randomAddress('usdt').hash))

        console.log(data, " usdt");

        // const supplyBalance = data.totalSupply;
        // set({ supplyBalance });

        // const borrowBalance = data.totalBorrow;
        // set({ borrowBalance });

        console.log('2---------------')

        //@ts-ignore
        const conf = stack.pop().cell.beginParse()
        const metadata = hex2a(conf.loadRef().beginParse().toString().slice(2).slice(0, -1))
        console.log(metadata)

        console.log('3--------------')

        conf.loadRef()
        const confItems = conf.loadRef().beginParse()

        const dictConf = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), { //asset config
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const oracle = src.loadAddress();             //store_slice(oracle)
                const decimals = BigInt(src.loadUint(8));             //.store_uint(decimals, 8)
                const ref = src.loadRef().beginParse();       //.store_ref(begin_cell()
                const collateralFactor = BigInt(ref.loadUint(16));    //.store_uint(collateral_factor, 16) 
                const liquidationThreshold = BigInt(ref.loadUint(16));//.store_uint(liquidation_threshold, 16) 
                const liquidationPenalty = BigInt(ref.loadUint(16));  // .store_uint(liquidation_penalty, 16)
                const baseBorrowRate = BigInt(ref.loadUint(64));      //.store_uint(base_borrow_rate, 64) 
                const borrowRateSlopeLow = BigInt(ref.loadUint(64));  //.store_uint(borrow_rate_slope_low, 64) 
                const borrowRateSlopeHigh = BigInt(ref.loadUint(64)); //.store_uint(supply_rate_slope_low, 64) 
                const supplyRateSlopeLow = BigInt(ref.loadUint(64));  //.store_uint(supply_rate_slope_low, 64) 
                const supplyRateSlopeHigh = BigInt(ref.loadUint(64)); //.store_uint(supply_rate_slope_high, 64) 
                const targeUtilization = BigInt(ref.loadUint(64));    //.store_uint(target_utilization, 64) 

                return {
                    oracle, decimals, collateralFactor, liquidationThreshold,
                    liquidationPenalty, baseBorrowRate, borrowRateSlopeLow,
                    borrowRateSlopeHigh, supplyRateSlopeLow, supplyRateSlopeHigh, targeUtilization
                };
            }
            //@ts-ignore
        }, confItems.loadRef().beginParse())

        // get asset config by address -------
        console.log(dictConf.get(bufferToBigInt(randomAddress('usdt').hash)))
        console.log('4---------------')
        console.log(confItems.loadUint(8)) //if pool active = -1 (true) / 0 (false)
        console.log('5---------------')

        const dictRates = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const s_ratePerSecond = BigInt(src.loadUint(64)); //s_rate_per_second 64bit
                const b_ratePerSecond = BigInt(src.loadUint(64)); //b_rate_per_second 64bit
                return { s_ratePerSecond, b_ratePerSecond };
            }
        }, stack.readCellOpt())

        console.log(dictRates.get(bufferToBigInt(randomAddress('usdt').hash)))

        console.log('6---------------')
        const dictReserves = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const reserve = BigInt(src.loadInt(64)); //s_rate_per_second 64bit
                return { reserve };
            }
        }, stack.readCellOpt())

        console.log(dictReserves.get(bufferToBigInt(randomAddress('usdt').hash)))

        // let argsUser = new TupleBuilder();
        // argsUser.writeAddress(randomAddress('usdt'));
        //
        // let { stackUser } = await toncenter.runMethod(
        //     masterContractAddress,
        //     'getUIVariables',
        //     args.build(),
        // );
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
