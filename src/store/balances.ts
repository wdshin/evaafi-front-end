import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, beginCell, Builder, Slice, contractAddress, Address, Cell, TonClient, fromNano, TupleBuilder } from 'ton';
import { randomAddress } from '../utils'
import { Integer } from 'io-ts';

export const toncenter = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

const userSCData =
    { "hex": "b5ee9c72c102330100036e00000d00120017001d00220029002e003500840089008e0093009800a500b600bb00d600e700ec00f100f6011c016f017401850196019b01a001a501b901ca01db01f601fb020002050229022e024b02580268026d0272028c0294029902be02c302e80367036e0114ff00f4a413f4bcf2c80b01020162090202012004030007bcd8339402015806050009b5c59e05b002014808070009af7e7817c00099af46f80e3610904183fa4337d29936c881471aa981c183fa0737d09878102f82191178053a6465816503e5ffe4e8017817e4652064e82a1001c183fa0b28894183fa3e37d2b609017409af81c00202ca210a020120120b0201480f0c0201480e0d0015320040728fc0a0c1fd10e0001d0060c1fd039be864f5c28ff80c1c20020120111000314c8803301cb1f500401cb3f5801cbff0101ca3f0101ca3fc98001d5d3ff0101fa00d33f0101d33f013180201201a130201201714020120161500475f01c6c2103fa443150038307f40e6fa130d23f013120c2ff946c12f025e031a3f025a3800a1570f01c6c21208307f4866fa5908e3c01d23f013153148307f40e6fa13053268307f40e6fa13001f0205f0502f01d108a5f0a23c2009a5033a858a8f02513a002925f04e2218307f47c6fa5e810355f0580201481918001d0830bfe4cc7c09b81b04a8fc09e8e0001d0830bfe4cc7c09781b04a8fc0968e0020120201b0201201f1c0201201e1d0023208c03782dace9d900002a086829406a4120001d208c03782dace9d900002a006a4120001d501a882300de0b6b3a7640000a90480031d699f8080e99f8080e99f8080e99fe99fe98f8080e99f8098c02012029220201582823020120252400435c8500701cb3f500501cb3f500301cb3f0101ca3f0101ca3f0101cb1f0101cb3fc98020120272600353e9034c1f50c3434c3f4c3f4c3f4cff4cff4cff4cff4cff4cfcc2000153b51343e903e903d010c20001bf642801e78b00e78b7a0064f6aa40201202d2a0201202c2b002f65c60043232c1540173c59400fe8084f2dac4b332407ec02000b6be0a3e910c20201202f2e004564830002496dc78083000644c38082ac014883c01482a006a4e00300064806a244c78a020148313000450830002496dc78083000644c38082ac014883c00482a006a4e00300064806a244c78a001f71b088831c02456f8007434c0cc1c6c252103fcbc37bc0700f4c7c04074cfc048b00ca3900cbc0c54dcfc0d151c843c0a1401283c0a550d89bc0d5c14c0b040278c49f04064d41ca8650c0068c5b8a54c141ca8407890cc1c013c0c88d660103c03563c06f80c0d083000a5cc00b50c04bc06f81b0c48300f0c3001e032000a30840ff2f073a2673f" }
export const masterContractAddress = Address.parse('EQCfWNoyevETUwvGmrBoaj3AlcELcU4D2DUrIitga1yZ0LH6');
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
    maxWithdraw: number;
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
                const totalSupply = BigInt(src.loadUint(64));                 // total_supply
                const totalBorrow = BigInt(src.loadUint(64));                 // total_borrow
                const lastAccural = BigInt(src.loadUint(32));
                const balance = BigInt(src.loadUint(64));
                console.log(balance, totalBorrow)
                return { price, s_rate, b_rate, totalSupply, totalBorrow, lastAccural, balance };
            }
            //@ts-ignore
        }, stack.readCellOpt())

        let data = dict.get(bufferToBigInt(randomAddress('usdt').hash))

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
        console.log(confItems.loadInt(8) === -1) //if pool active = -1 (true) / 0 (false)
        console.log('5----SRATE BRATE PER SEC BY ASSET----')

        const dictRates = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const s_rate_per_second = BigInt(src.loadUint(64)); //s_rate_per_second 64bit
                const b_rate_per_second = BigInt(src.loadUint(64)); //b_rate_per_second 64bit
                return { s_rate_per_second, b_rate_per_second };
            }
        }, stack.readCellOpt())

        console.log(dictRates.get(bufferToBigInt(randomAddress('usdt').hash)))

        console.log('6---------RESERVE BY ASSET------')
        const dictReserves = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const reserve = BigInt(src.loadInt(65)); //s_rate_per_second 64bit
                return { reserve };
            }
        }, stack.readCellOpt())

        console.log(dictReserves.get(bufferToBigInt(randomAddress('usdt').hash)))

        console.log('7----ACCOUNT ASSET BALANCE-----------')
        let argsUser = new TupleBuilder();
        argsUser.writeAddress(randomAddress('usdt'));
        argsUser.writeNumber(data.s_rate) //s_rate todo change on actual srate
        argsUser.writeNumber(data.b_rate)//b_rate todo

        let accountAssetBalance = await toncenter.runMethod(
            userContractAddress_test,
            'getAccountAssetBalance',
            argsUser.build(),
        );
        
        const assetBalance = BigInt(accountAssetBalance.stack.readNumber());
        console.log(assetBalance) //asset balance

        console.log('8--------ACCOUNT BALANCES-------')

        let argsUserBalances = new TupleBuilder();
        const asdf = beginCell().storeDictDirect(dict, Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: Builder) => {
                buidler.storeUint(src.price, 64);
                buidler.storeUint(src.s_rate, 64);
                buidler.storeUint(src.b_rate, 64);
                buidler.storeUint(src.totalSupply, 64);
                buidler.storeUint(src.totalBorrow, 64);
                buidler.storeUint(src.lastAccural, 32);
                buidler.storeUint(src.balance, 64);
            },
            parse: (src: Slice) => {
                return 0;
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
        const dictUserBalances = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
            serialize: (src: any, buidler: any) => {
                buidler.storeSlice(src);
            },
            parse: (src: Slice) => {
                const balance = BigInt(src.loadInt(65)); //s_rate_per_second 64bit
                return { balance };
            }
            //@ts-ignore
        }, stackUserBalances.stack.readCell().beginParse());

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
        // console.log(BigInt(stackUserAvlToBorr.stack.readNumber())) // avaliable to borrow

        // let argsUpdateRates = new TupleBuilder();

        argsUserAvl.writeCell(asdf);
        argsUserAvl.writeCell(asdf_config);
        argsUserAvl.writeAddress(randomAddress('usdt'));
        // argsUserAvl.writeNumber(BigInt((new Date()).getTime() * 1000) - data.lastAccural);
        argsUserAvl.writeNumber(10);

        // console.log('asdkfj')

        // let getUpdateRates = await toncenter.runMethod(
        //     masterContractAddress,
        //     'getUpdatedRates',
        //     argsUpdateRates.build(),
        // );
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance

        const borrowBalance = fromNano(Number(BigInt(stackUserAvlToBorr.stack.readNumber())));
        set({ borrowBalance });

        const supplyBalance = fromNano((dictUserBalances.get(bufferToBigInt(randomAddress('usdt').hash)).balance));
        set({ supplyBalance });

        const limitUsed = Number(fromNano(data.price)) + Number(supplyBalance);
        const totalLimit = limitUsed + Number(borrowBalance);
        const borrowLimitPercent = limitUsed / totalLimit;
        set({ borrowLimitPercent });

        const apy_supply = ((Number(fromNano(dictRates.get(bufferToBigInt(randomAddress('usdt').hash)).s_rate_per_second)) * 360 * 24 + 1) ^ 365 - 1) / 10000;
        const apy_borrow = ((Number(fromNano(dictRates.get(bufferToBigInt(randomAddress('usdt').hash)).b_rate_per_second)) * 360 * 24 + 1) ^ 365 - 1) / 10000000;

        const newSupply = {
            id: 'fir12321st',
            token: Token.USDT,
            balance: assetBalance.toString(),
            apy: apy_supply,
            earned: '13',
        };
        const mySupplies = [newSupply];

        set({ mySupplies });

        const newBorrow = {
            id: 'firs12t',
            token: Token.USDT,
            balance: '111',
            apy: apy_borrow,
            accrued: '22',
        };
        const myBorrows = [newBorrow];
        set({ myBorrows });
    }

    setInterval(updateData, 50000);
    updateData();

    return {
        borrowBalance: '0',
        supplyBalance: '0',
        borrowLimitPercent: 0.25,
        borrowLimitValue: 14,
        availableToBorrow: '60',
        maxWithdraw: 30,
        mySupplies: [],
        myBorrows: [],
        supplies: [{
            id: 'dkdskasdk',
            token: Token.USDT,
            balance: '30',
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
