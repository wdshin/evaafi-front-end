import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, beginCell, Builder, Slice, contractAddress, Address, Cell, TonClient, fromNano, TupleBuilder } from 'ton';
import { randomAddress } from '../utils'

export const toncenter = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

const userSCData =
    { "hex": "b5ee9c72c102330100038600000d00120017001d00220029002e00350088008d00920097009c00a900ba00d500da00df00e400f5011f01720177017c0181019201a301a801bc01cd01f301f801fd0202021d023c024102460263027002800285028a02a402ac02b102d602db0300037f03860114ff00f4a413f4bcf2c80b01020162090202012004030007bcd8339402015806050009b5c59e057002014808070009af7e7816c000a1af46f80d3610904183fa4337d29936c881471aa981c183fa0737d098780f2f81991178053a6465816503e5ffe4e8017816e4659fe4e82a1001c183fa0b28894183fa3e37d2b609017409af81e47a0064c00202ca1f0a020120100b0201620f0c0201200e0d0015320040728fc0a0c1fd10e0001d0060c1fd039be864f5c2cff80c1c2000314c8803301cb1f500401cb3f5801cbff0101ca3f0101ca3fc98020120161102012015120201201413001d5d3ff0101fa00d33f0101d33f01318004f571fe2030f01a6c2103fa443150038307f40e6fa130d23f013120c2ff946c12f023e031a3f023a3800a1f38780d3610904183fa4337d2c8471e00e91f8098a98a4183fa0737d09829934183fa0737d09800f80f2f8201780d88452f8511e1004d2819d42c54781189d001492f827110c183fa3e37d2f4081aaf82c0201201e170201201b180201201a19001d0830bfe4cc7c09381b04a8fc0968e0001d0830bfe4cc7c08f81b04a8fc08e8e00201201d1c0023208c03782dace9d900002a086829406a4120001d208c03782dace9d900002a006a41200047f10ff1018107f1018411806f05b59d3b200007f101800d4411806f05b59d3b200005482402012029200201582421020120232200314d33f0101d33f0101d33f0101d23f0101d23f0101d33f0131800395c8500601cb3f500401cb3f5801cb3f0101ca3f0101ca3f0101cb3fc980201202825020120272600353e9034c1f50c3434c3f4c3f4c3f4cff4cff4cff4cff4cff4cfcc2000153b51343e903e903d010c20001b5c85003cf1601cf16f400c9ed5480201202d2a0201202c2b002f65c60043232c1540173c59400fe8084f2dac4b332407ec02000b6be0a3e910c20201202f2e004564830002496dc78083000644c38082ac014883c01482a006a4e00300064806a244c78a020148313000450830002496dc78083000644c38082ac014883c00482a006a4e00300064806a244c78a001f71b088831c02456f8007434c0cc1c6c252103fcbc37bc0680f4c7c04074cfc048b00ca3900cbc0bd4dcfc0c951c843c099401283c09d50d89bc0cdc14c0b040278c49f04064d41ca8650c0068c5b8a54c141ca8407890cc1c013c0c08d660103c03563c06780c0d083000a5cc00b50c04bc06781b0c48300f0c3001e032000a30840ff2f094f5afb9" }
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

        console.log('1------ASSET DATA---------')
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

        console.log('2-----------POOL METADATA----')

        //@ts-ignore
        const conf = stack.pop().cell.beginParse()
        const metadata = hex2a(conf.loadRef().beginParse().toString().slice(2).slice(0, -1))
        console.log(metadata)

        console.log('3-------ASSET CONFIG-------')

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
        console.log('4-----------IS POOL ACTIVE?----')
        console.log(confItems.loadUint(8)) //if pool active = -1 (true) / 0 (false)
        console.log('5--------SRATE BRATE PER SEC BY ASSET-------')

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

        console.log('6---------RESERVE BY ASSET------')
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

        console.log('7----ACCOUNT ASSET BALANCE-----------')
        let argsUser = new TupleBuilder();
        argsUser.writeAddress(randomAddress('ton'));
        argsUser.writeNumber(1) //s_rate
        argsUser.writeNumber(2)//b_rate

        let stackUser = await toncenter.runMethod(
            userContractAddress_test,
            'getAccountAssetBalance',
            argsUser.build(),
        );

        console.log(BigInt(stackUser.stack.readNumber())) //asset balance
        console.log('8--------ACCOUNT BALANCES-------')
        let argsUserBalances = new TupleBuilder();
        const asdf = beginCell().storeDictDirect(dict, Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: Builder) => {
                buidler.storeUint(src.price, 64);
                buidler.storeUint(src.s_rate, 64);
                buidler.storeUint(src.b_rate, 64);
                buidler.storeUint(src.totalSupply, 64);
                buidler.storeUint(src.totalBorrow, 64);
                buidler.storeUint(src.lastAccural, 64);
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
        }).endCell();
        argsUserBalances.writeCell(asdf);
        let stackUserBalances = await toncenter.runMethod(
            userContractAddress_test,
            'getAccountBalances',
            argsUserBalances.build(),
        );
        // stackUserBalances.stack.readCell().beginParse(); // important 
        // console.log(BigInt(stackUserBalances.stack.readNumber())) //asset balance
        const dictUserBalances = Dictionary.load(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const balance = BigInt(src.loadInt(64)); //s_rate_per_second 64bit
                return { balance };
            }
            //@ts-ignore
        }, stackUserBalances.stack.readCell().beginParse())

        console.log(dictUserBalances.get(bufferToBigInt(randomAddress('usdt').hash))) //get balance in usd
        console.log('9---------AVL TO BORROW ------')
        let argsUserAvl = new TupleBuilder();
        const asdf_config = beginCell().storeDictDirect(dictConf, Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: Builder) => {
                console.log(src)
                buidler.storeAddress(src.oracle);
                buidler.storeUint(src.decimals, 8);
                const refBuild = beginCell();
                refBuild.storeUint(src.collateralFactor, 16);
                refBuild.storeUint(src.liquidationThreshold, 16);
                refBuild.storeUint(src.liquidationPenalty, 16);
                refBuild.storeUint(src.baseBorrowRate, 64);
                refBuild.storeUint(src.borrowRateSlopeLow, 64);
                refBuild.storeUint(src.borrowRateSlopeHigh, 64);
                refBuild.storeUint(src.supplyRateSlopeLow, 64);
                refBuild.storeUint(src.supplyRateSlopeHigh, 64);
                refBuild.storeUint(src.targeUtilization, 64);
                buidler.storeRef(refBuild.endCell())
            },
            parse: (src: Slice) => {
                return 0;
            }
        }).endCell();
        argsUserAvl.writeCell(asdf_config);
        argsUserAvl.writeCell(asdf);
        let stackUserAvlToBorr = await toncenter.runMethod(
            userContractAddress_test,
            'getAvailableToBorrow',
            argsUserAvl.build(),
        );
        console.log(BigInt(stackUserAvlToBorr.stack.readNumber())) // avaliable to borrow
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
