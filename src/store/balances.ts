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
    { "hex": "b5ee9c72c1023d010004c200000d00120017001d00220027002e003300380046004c009f00a600ab00b000b500ba00c700d800dd00e200e7010201150189018e01b401b90237023c02bb02be02c302c802cd02de02ef02f402f9030d031e032f0334034f03540378037d039a03a703ac03bc03c103c603e003e803ed04120417043c04bb04c20114ff00f4a413f4bcf2c80b010201620d0202012004030007bcd833940201200c0502012007060009b5c59e06300201480b080201200a090018aafc547210f033fe2030f0330008a994f03400a1af46f8103610904183fa4337d29936c881471ca981c183fa0737d09878122f82191178053a6465816503e5ffe4e8017819907f101864652064e82a1001c183fa0b28894183fa3e37d2b609017409af81c00009b97e7f03080202ca310e020120200f0201201310020148121100154c80101ca3f028307f4438001d5018307f40e6fa193d70a3fe030708020120191402012018150201201716003132200cc072c7d4010072cfd60072ffc040728fc040728ff260002134ffc04074cfc04074cfc04074cfc04c6000e347020f0206c21208307f4866fa5908e5c01d23f013153158307f40e6fa13053278307f40e6fa13001f0245f0403f021109a5f0a24c1008e103103a312f02901a87a58f005a90413a08e193323c2009f5003f02958a87a58f005a90414a003925f04e202e251218307f47c6fa5e85f036c2280201201b1a00475f0206c2103fa443150038307f40e6fa130d23f013120c2ff946c12f029e031a3f029a380201201e1c01f51c083c081b084820c1fd219be9642399c0748fc04c54c560c1fd039be84c14c9e0c1fd039be84c007c0917c100fc0857c20c887f880c09704023845b0840e8c4bc0a406a1e963c016a4104e823880d0930802385413c0a406a162a1e963c016a412049c42a41052800e497c17880b8944860c1fd1f1be97a17c0e01d00066c22a101f71c083c081b084820c1fd219be964239980748fc04c54c560c1fd039be84c14c9e0c1fd039be84c007c0917c100fc08441e17c20c89704023849b08540cea1e9400fc0144aa4128fc0a452823880d09308023855410aa006a1e963c016a412049c42a413c0a44e800a497c17880f8944c60c1fd1f1be97a17c0cccc601f0002b90201202a2102012025220201482423001d0830bfe4cc7c0ab81b04a8fc0ae8e0001d0830bfe4cc7c0a781b04a8fc0a68e0020120292602012028270023208c03782dace9d900002a086829406a4120001d208c03782dace9d900002a006a4120001d501a882300de0b6b3a7640000a90480201202c2b0031d699f8080e99f8080e99f8080e99fe99fe98f8080e99f8098c0201202e2d00435c8500701cb3f500501cb3f500301cb3f0101ca3f0101ca3f0101cb1f0101cb3fc98020120302f00353e9034c1f50c3434c3f4c3f4c3f4cff4cff4cff4cff4cff4cfcc2000153b51343e903e903d010c200201203332001bf321400f3c58073c5bd00327b55202012037340201203635002f65c60043232c1540173c59400fe8084f2dac4b332407ec02000b6be0a3e910c20201203938004564830002496dc78083000644c38082ac014883c01482a006a4e00300064806a244c78a0201483b3a00450830002496dc78083000644c38082ac014883c00482a006a4e00300064806a244c78a001f71b088831c02456f8007434c0cc1c6c252103fcbc37bc0800f4c7c04074cfc048b00ca3900cbc0d94dcfc0e551c843c0b1401283c0b550d89bc0e9c14c0b040278c49f04064d41ca8650c0068c5b8a54c141ca8407890cc1c013c0dc8d660103c03563c07f80c0d083000a5cc00b50c04bc07f81b0c48300f4c3001e03c000a30840ff2f015b3698b" }
export const masterContractAddress = Address.parse('EQAue0Nf7bZpKZxqsfM1B62g7WC_3l2kHsjKtsWdOfQ5XWQh');
export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(userSCData.hex, 'hex'))[0];
const masterContractCode = oracleMasterSourceV1CodeCell;
const RATE_DECIMAL = Math.pow(10, 18);
const VALUE_DECIMAL = Math.pow(10, 9);
const BALANCE_DECIMAL =  Math.pow(10, 6)
console.log(RATE_DECIMAL, VALUE_DECIMAL);

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
                console.log(price)
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
        const ratesPerSecondDataUsdt = dictRates.get(bufferToBigInt(randomAddress('usdt').hash));
        console.log(dictRates.get(bufferToBigInt(randomAddress('ton').hash)))
        const ratesPerSecondDataTon = dictRates.get(bufferToBigInt(randomAddress('ton').hash));
        

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

        let accountAssetBalanceUsdt = await toncenter.runMethod(
            userContractAddress_test,
            'getAccountAssetBalance',
            argsUser.build(),
        );

        const assetBalanceUsdt = BigInt(accountAssetBalanceUsdt.stack.readNumber());

        let argsUser2 = new TupleBuilder();
        argsUser2.writeAddress(randomAddress('ton'));
        argsUser2.writeNumber(data.s_rate) //s_rate todo change on actual srate
        argsUser2.writeNumber(data.b_rate)//b_rate todo

        let accountAssetBalanceTon = await toncenter.runMethod(
            userContractAddress_test,
            'getAccountAssetBalance',
            argsUser2.build(),
        );
        const assetBalanceTon = BigInt(accountAssetBalanceTon.stack.readNumber());

        console.log(assetBalanceUsdt) //asset balance
        console.log(assetBalanceTon) //asset balance

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
        const supplyBalanceData = dictUserBalances.get(bufferToBigInt(randomAddress('usdt').hash)).balance;


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
        const availableToBorrowData = BigInt(stackUserAvlToBorr.stack.readNumber());
        console.log(availableToBorrowData); // avaliable to borrow

        // let argsUpdateRates = new TupleBuilder();

        console.log('10---------agregated balances------')
        let argsUserBalanceas = new TupleBuilder();

        argsUserBalanceas.writeCell(asdf_config);
        argsUserBalanceas.writeCell(asdf);
        // let argsUpdateRates = new TupleBuilder();
        let getAggregatedBalances = await toncenter.runMethod(
            userContractAddress_test,
            'getAggregatedBalances',
            argsUserBalanceas.build(),
        );
        // // console.log(getAggregatedBalances.stack.readNumber()) // agregatedbalances 
        // console.log(getAggregatedBalances.stack.readNumber())

        argsUserAvl.writeCell(asdf);
        argsUserAvl.writeCell(asdf_config);
        argsUserAvl.writeAddress(randomAddress('usdt'));
        // argsUserAvl.writeNumber(BigInt((new Date()).getTime() * 1000) - data.lastAccural);
        argsUserAvl.writeNumber(10);

        // let getUpdateRates = await toncenter.runMethod(
        //     masterContractAddress,
        //     'getUpdatedRates',
        //     argsUpdateRates.build(),
        // );
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance

        const borrowBalance = (Number(availableToBorrowData) / VALUE_DECIMAL).toString();
        set({ borrowBalance });

        const supplyBalance = (Number(supplyBalanceData) / VALUE_DECIMAL).toString();
        set({ supplyBalance });

        const limitUsed = getAggregatedBalances.stack.readNumber() / VALUE_DECIMAL;
        console.log(limitUsed);
        

        const totalLimit = limitUsed + Number(borrowBalance);
        const borrowLimitValue = totalLimit;
        set({borrowLimitValue});
        const borrowLimitPercent = totalLimit / limitUsed;
        set({ borrowLimitPercent });

        const apy_usdt_supply = ((Number(ratesPerSecondDataUsdt.s_rate_per_second) * 360 * 24 + 1) ^ 365 - 1) / VALUE_DECIMAL;
        const apy_ton_supply = ((Number(ratesPerSecondDataTon.s_rate_per_second) * 360 * 24 + 1) ^ 365 - 1) / VALUE_DECIMAL;
        const apy_usdt_borrow = ((Number(ratesPerSecondDataUsdt.b_rate_per_second) * 360 * 24 + 1) ^ 365 - 1) / VALUE_DECIMAL;


        const newSupply = {
            id: 'fir12321st',
            token: Token.USDT,
            balance: parseFloat((Number(assetBalanceUsdt) / BALANCE_DECIMAL).toString()).toFixed(2),
            apy: apy_usdt_supply,
            earned: '13',
        };
        const newSupply2 = {
            id: 'fir12312321st',
            token: Token.TON,
            balance: parseFloat((Number(assetBalanceTon) / VALUE_DECIMAL).toString()).toFixed(2),
            apy: apy_ton_supply,
            earned: '13',
        };

        const mySupplies = [newSupply, newSupply2];

        set({ mySupplies });

        const newBorrow = {
            id: 'firs12t',
            token: Token.USDT,
            balance: '111',
            apy: apy_usdt_borrow,
            accrued: '22',
        };
        const myBorrows = [newBorrow];
        set({ myBorrows });

        const maxWithdraw = Number(assetBalanceUsdt);
        set({ maxWithdraw })
    }

    setInterval(updateData, 60000);
    updateData();

    return {
        borrowBalance: '0',
        supplyBalance: '0',
        borrowLimitPercent: 0.25,
        borrowLimitValue: 14,
        availableToBorrow: '60',
        maxWithdraw: 0,
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
