import { create } from 'zustand';
import { Token } from './prices';
import { Dictionary, beginCell, Builder, Contract, Slice, contractAddress, Address, Cell, TonClient, TupleBuilder } from 'ton';
import { randomAddress } from '../utils'
// import { Integer } from 'io-ts';
import { BN } from 'bn.js'

const jettonWalletAddressMain = 'EQDLqyBI-LPJZy-s2zEZFQMyF9AU-0DxDDSXc2fA-YXCJIIq' // todo calculate jeton wallet 
const masterAdd = 'EQCMRwxs_9qPeivt7gdY2Wbm6plE2ccJHOfQk5x6qSE5z4q8'
const ton = Address.parse('0:1a4219fe5e60d63af2a3cc7dce6fec69b45c6b5718497a6148e7c232ac87bd8a');
const userSCData =
    { "hex": "b5ee9c72c10246010005c000000d00120017001d0022002700330038003d004b005100a500ac00b100b600bb00c000cd00de00e300fb01060129012e01330138013d01420161017401e901ee01f301f8021f0226022b02a603250329032e034a035b03600365036a037b038f039403a503b603bb03c003d903fd04020407042404340448044d0452046c04740479049e04a304c8054705c00114ff00f4a413f4bcf2c80b010201620d0202012004030007bcd833940201200c0502012007060013b5c59e04426be07e06b00201480b080201200a090018aafc547210f037fe2030f0370008a994f03800a3af46f81109af81904183fa4337d29936c881471ca981c183fa0737d09878132f8219117805ba6465816503e5ffe4e801781b907f101864652064e82a1001c183fa0b28894183fa3e37d2b609017409af81c00009b97e7f03480202c9170e0201ce160f020120131002012012110015320040728fc0a0c1fd10e0001d0060c1fd039be864f5c28ff80c1c200201201514002b34ffc04074cfc04074cfc04074cfc0407d013d010c20001134ffc040748fc04c600041d64401f00e58fa80300e59fa802678b2c00e5ff8080e59f8080e51f8080e51fe4c0201203c180201202b190201201f1a0201481e1b0201201d1c003932200cc072c7d4014072cfd400f3c5804072ffc040728fc040728ff260002134ffc04074cfc04074cfc04074cfc04c6000e547020f022135f03208307f4866fa5908e5c01d23f013153158307f40e6fa13053278307f40e6fa13001f0265f0403f023109a5f0a24c1008e103103a312f02c01a87a58f004a90413a08e193323c2009f5003f02c58a87a58f004a90414a003925f04e202e251218307f47c6fa5e85f036c22802012028200201202421020120232200493c0884d7c0c0fe910c5400e0c1fd039be84c348fc04c4830bfe51b04bc0b380c68fc0b28e000093c0d708020020120262500f11c14c060c1fd219be9642399c0748fc04c54c560c1fd039be84c14c9e0c1fd039be84c007c0997c100fc08d7c20c887f880c09704023845b0840e8c4bc0b006a1e963c012a4104a823880d0930802385413c0b006a162a1e963c012a412049c42a4104e800a497c17880789444e0c1fd1f1be97a16db0ca86001f71c083c0884d7c0c820c1fd219be964239980748fc04c54c560c1fd039be84c14c9e0c1fd039be84c007c0997c100fc08c41e17c20c89704023849b08540cea1e9400fc0104aa4128fc0b052823880d09308023855410aa006a1e963c012a412049c42a413c0b04e800a497c17880f8944c60c1fd1f1be97a17c0cce027000431b90201482a2900331c14c0b040270c4870406480a864cc0068f8a50c00a840788060001d0830bfe4cc7c0b781b04a8fc0ba8e0020120332c020158302d0201202f2e001d0830bfe4cc7c0b381b04a8fc0b28e00023208c03782dace9d900002a086829406a41200201203231001d208c03782dace9d900002a006a4120001d006a208c03782dace9d900002a412002012037340201203635002d4d33fd33f0101d33f0101d33fd33fd31f0101d33f0131800435c8500701cb3f500501cb3f500301cb3f0101ca3f0101ca3f0101cb1f0101cb3fc980201203b380201203a3900353e9034c1f50c3434c3f4c3f4c3f4cff4cff4cff4cff4cff4cfcc20001b3b51343e903e903d013480004c6000235c85004cf1658cf16f4000101ca00c9ed548020148403d0201203f3e002ff38c008646582a802e78b2801fd0109e5b509666480fd804000bf7c147d2218402012042410045d106000492db8f0106000c8987010558029107802105400d49c006000c900d44898f14020148444300450830002496dc78083000644c38082ac014883c00482a006a4e00300064806a244c78a001f71b088831c02456f8007434c0cc1c6c252103fcbc37bc088134c7c04074cfc048b00fe5d7c0db04dc3c087808b01023850c0c4d00fc1114d07c11806804093c11c49c3c087809bcb4aa08b00ca38b0cbc0e94d4fc11951c843c0bd401283c0c150d093c11c13c0c49440d14109c017c0ec91660103c03d540bc0878204500ee22c03d8e5a3631f0455365f046547430f02f810265fe203020fe203026fe203026a120fe20304540f030810266fe203022fe203020fe2030543656f0475133f0368e1914f031103770260410395092f0405443558040f00f587ff021e05f08e0303220c0029730d4305502f021e06c41c00730840ff2f0aebf8f5a" }
const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

class Minter implements Contract {
    constructor(readonly address: Address) { }
    async getWalletAddress(provider: any, address: Address) {
        const param = {
            type: 'slice',
            cell: beginCell().storeAddress(address).endCell()
        } as any;
        const { stack } = await provider.get("get_wallet_address", [param]);
        return stack.readAddress();
    }
    async getBalance(provider: any) {
        const { stack } = await provider.get("get_wallet_data", []);
        return stack;
        // const stack = await provider.getState();
        // return stack;
    }
}

const contract = new Minter(Address.parse(jettonWalletAddressMain));
const usdt = await client.open(contract).getWalletAddress(Address.parse(masterAdd))

export const toncenter = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});

export const masterContractAddress = Address.parse(masterAdd);
// @ts-ignore
window.mastersc = masterContractAddress
export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(userSCData.hex, 'hex'))[0];
const masterContractCode = oracleMasterSourceV1CodeCell;
const RATE_DECIMAL = Math.pow(10, 18);
const VALUE_DECIMAL = Math.pow(10, 9);
const BALANCE_DECIMAL = Math.pow(10, 6);
const SEC_DECIMAL = Math.pow(10, 12);
const COUNT_DECIMAL = Math.pow(10, 8);

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

export interface MySupply {
    id: string;
    token: Token;
    balance: string;
    apy: number;
    earned: string;
}

export interface MyBorrow {
    id?: string;
    token?: Token;
    balance?: string;
    apy?: number;
    accrued?: string;
}

export interface Supply {
    id: string;
    token: Token;
    balance: string;
    apy: number;
}

export interface Borrow {
    id: string;
    token: Token;
    liquidity: string;
    apy: number;
}

interface BalanceStore {
    borrowBalance: string;
    supplyBalance: string;
    availableToBorrow: string;
    liquidityValue: {
        [key in Token]?: number
    };
    borrowLimitPercent: number;
    borrowLimitValue: number;
    maxWithdraw: {
        [key in Token]?: number
    };
    maxSupply: number;
    maxBorrow: number;
    maxRepay: {
        [key in Token]?: number
    };
    mySupplies: MySupply[];
    myBorrows?: MyBorrow[];
    supplies: Supply[];
    borrows: Borrow[];
    tonBalance: string;
    usdtBalance: string;
    userAddress?: Address;
    apy_usdt_borrow: number;
    apy_ton_borrow: number;
    apy_ton_supply: number;
    forceUpdateData: () => void;
}

export const useBalance = create<BalanceStore>((set, get) => {
    const updateData = async () => {
        if (!get()?.userAddress) {
            // not initialized yet, just skip this update cycle
            return;
        }

        const userContractAddress_test = contractAddress(0, {
            code: masterContractCode,
            data: beginCell()
                .storeAddress(masterContractAddress)
                //@ts-ignore
                .storeAddress(get().userAddress) // u need to put user wallet address here to calculate userContractAddress
                .storeDict()
                .storeInt(BigInt(0), 1)
                .endCell(),
        });
        // @ts-ignore
        window.usersc = userContractAddress_test;




        let args = new TupleBuilder();
        args.writeAddress(usdt);

        // console.log(
        //     //@ts-ignore
        //     window.userAddress // u need to put user wallet address here to calculate userContractAddress
        // )
        // const userContractAddress_test = contractAddress(
        //     0,
        //     {
        //         code: masterContractCode,
        //         data: beginCell()
        //             .storeAddress(masterContractAddress)
        //             //@ts-ignore
        //             .storeAddress(window.userAddress) // u need to put user wallet address here to calculate userContractAddress
        //             .storeDict()
        //             .storeInt(BigInt(0), 1)
        //             .endCell(),
        //     });
        //
        // // @ts-ignore
        // window.usersc = userContractAddress_test
        // // @ts-ignore
        // window.mastersc = masterContractAddress
        // console.log(888888888)
        // console.log(userContractAddress_test)
        // console.log(888888888)
        // console.log(userContractAddress_test.toString());
        // console.log(888888888)

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

        let data = dict.get(bufferToBigInt(usdt.hash))
        console.log(data.price)
        data = dict.get(bufferToBigInt(ton.hash))
        console.log(data.price)
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
        console.log(dictConf.get(bufferToBigInt(usdt.hash)))
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

        console.log(dictRates.get(bufferToBigInt(usdt.hash)))
        const ratesPerSecondDataUsdt = dictRates.get(bufferToBigInt(usdt.hash));
        console.log(dictRates.get(bufferToBigInt(ton.hash)))
        const ratesPerSecondDataTon = dictRates.get(bufferToBigInt(ton.hash));


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

        const assetReserveUsdt = dictReserves.get(bufferToBigInt(usdt.hash)).reserve;
        const assetReserveTon = dictReserves.get(bufferToBigInt(ton.hash)).reserve;
        console.log(assetReserveUsdt, "usdt");
        console.log(assetReserveTon, "ton");


        console.log('7----ACCOUNT ASSET BALANCE-----------')
        let argsUser = new TupleBuilder();
        argsUser.writeAddress(usdt);
        argsUser.writeNumber(data.s_rate) //s_rate todo change on actual srate
        argsUser.writeNumber(data.b_rate)//b_rate todo

        let assetBalanceUsdt = BigInt(0);

        try {
            const accountAssetBalanceUsdt = await toncenter.runMethod(
                userContractAddress_test,
                'getAccountAssetBalance',
                argsUser.build(),
            );

            assetBalanceUsdt = BigInt(accountAssetBalanceUsdt.stack.readNumber());
        } catch (e) {
            console.log('error with get getAccountAssetBalance', e)
        }


        let argsUser2 = new TupleBuilder();
        argsUser2.writeAddress(ton);
        argsUser2.writeNumber(data.s_rate) //s_rate todo change on actual srate
        argsUser2.writeNumber(data.b_rate)//b_rate todo

        let assetBalanceTon = BigInt(0);

        try {
            const accountAssetBalanceTon = await toncenter.runMethod(
                userContractAddress_test,
                'getAccountAssetBalance',
                argsUser2.build(),
            );

            assetBalanceTon = BigInt(accountAssetBalanceTon.stack.readNumber());
        } catch (e) {
            console.log('error with getAccountAssetBalance', e)
        }


        console.log(assetBalanceUsdt + " usdt") //asset balance
        console.log(assetBalanceTon + " ton") //asset balance

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

        // let stackUserBalances = await toncenter.runMethod(
        //     userContractAddress_test,
        //     'getAccountBalances',
        //     argsUserBalances.build(),
        // );

        // stackUserBalances.stack.readCell().beginParse(); // important 
        // console.log(BigInt(stackUserBalances.stack.readNumber())) //asset balance

        // const dictUserBalances = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
        //     serialize: (src: any, buidler: any) => {
        //         buidler.storeSlice(src);
        //     },
        //     parse: (src: Slice) => {
        //         const balance = BigInt(src.loadInt(65)); //s_rate_per_second 64bit
        //         return { balance };
        //     }
        //     //@ts-ignore
        // }, stackUserBalances.stack.readCell().beginParse());

        // console.log(dictUserBalances.get(bufferToBigInt(randomAddress('usdt').hash))) //get balance in usd
        // const supplyBalanceData = dictUserBalances.get(bufferToBigInt(randomAddress('usdt').hash)).balance;


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

        let availableToBorrowData = BigInt(0);
        try {
            let stackUserAvlToBorr = await toncenter.runMethod(
                userContractAddress_test,
                'getAvailableToBorrow',
                argsUserAvl.build(),
            );

            availableToBorrowData = BigInt(stackUserAvlToBorr.stack.readNumber());
        } catch (e) {
            console.log('error with getAvailableToBorrow', e)
        }

        // let argsUpdateRates = new TupleBuilder();

        console.log('10---------agregated balances------')
        let argsUserBalanceas = new TupleBuilder();

        argsUserBalanceas.writeCell(asdf_config);
        argsUserBalanceas.writeCell(asdf);
        // let argsUpdateRates = new TupleBuilder();

        let aggregatedBalance1 = 0;
        let aggregatedBalance2 = 0;
        try {
            const getAggregatedBalances = await toncenter.runMethod(
                userContractAddress_test,
                'getAggregatedBalances',
                argsUserBalanceas.build(),
            );
            aggregatedBalance1 = getAggregatedBalances.stack.readNumber();// agregatedbalances 
            aggregatedBalance2 = getAggregatedBalances.stack.readNumber();// agregatedbalances   
            console.log(aggregatedBalance1, aggregatedBalance2);
        } catch (e) {
            console.log('error with getAggregatedBalances', e)
        }

        // console.log(aggregatedBalance1,aggregatedBalance2)
        // console.log(getAggregatedBalances.stack.readNumber())

        argsUserAvl.writeCell(asdf);
        argsUserAvl.writeCell(asdf_config);
        argsUserAvl.writeAddress(usdt);
        // argsUserAvl.writeNumber(BigInt((new Date()).getTime() * 1000) - data.lastAccural);
        argsUserAvl.writeNumber(10);

        // let getUpdateRates = await toncenter.runMethod(
        //     masterContractAddress,
        //     'getUpdatedRates',
        //     argsUpdateRates.build(),
        // );
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance
        // console.log(BigInt(getUpdateRates.stack.readNumber())) //asset balance

        const supplyBalance = (aggregatedBalance1 / VALUE_DECIMAL).toString();
        set({ supplyBalance });

        const borrowBalance = (aggregatedBalance2 / VALUE_DECIMAL).toString();
        set({ borrowBalance });

        const limitUsed = (Number(availableToBorrowData) / VALUE_DECIMAL);
        const totalLimit = limitUsed + Number(borrowBalance);

        const borrowLimitValue = totalLimit;
        set({ borrowLimitValue });
        const borrowLimitPercent = Math.abs(limitUsed) / totalLimit;
        set({ borrowLimitPercent });

        const apy_usdt_supply = Number((((Number(ratesPerSecondDataUsdt.s_rate_per_second) * 360 * 24 + 1) ^ 365 - 1) / SEC_DECIMAL).toFixed(3));
        const apy_ton_supply = Number((((Number(ratesPerSecondDataTon.s_rate_per_second) * 360 * 24 + 1) ^ 365 - 1) / VALUE_DECIMAL).toFixed(2));
        set({ apy_ton_supply });

        const apy_usdt_borrow_math = Number(ratesPerSecondDataUsdt.b_rate_per_second) / SEC_DECIMAL;
        const apy_usdt_borrow = ((apy_usdt_borrow_math * 360 * 24 + 1) ^ 365 - 1) / 10000;
        set({ apy_usdt_borrow });
        const apy_ton_borrow_math = Number(ratesPerSecondDataTon.b_rate_per_second) / VALUE_DECIMAL;
        const apy_ton_borrow = Number((((apy_ton_borrow_math * 360 * 24 + 1) ^ 365 - 1) / 10000000).toFixed(4));
        set({apy_ton_borrow})

        const liquidity_usdt = (Math.abs(Number(assetBalanceUsdt) - Number(assetReserveUsdt)) / BALANCE_DECIMAL).toFixed(2);
        const liquidity_ton = (Math.abs(Number(assetBalanceTon) - Number(assetReserveTon)) / BALANCE_DECIMAL / 10).toFixed(2);



        const newMySupply = {
            id: 'fir12312321st',
            token: Token.TON,
            balance: parseFloat((Number(assetBalanceTon) / VALUE_DECIMAL).toString()).toFixed(2),
            apy: apy_ton_supply,
            earned: '13',
        };

        const mySupplies = [newMySupply];
        set({ mySupplies });


        const myBorrows =
            [{
                id: 'firs12t',
                token: Token.USDT,
                balance: Math.abs(Number(parseFloat((Number(assetBalanceUsdt) / BALANCE_DECIMAL).toString()).toFixed(2))).toString(),
                apy: apy_usdt_borrow,
                accrued: '22',
            }];

        set({ myBorrows });


        const supplies = [{
            id: 'dkdskasdk',
            token: Token.TON,
            balance: get().tonBalance,
            apy: Number(apy_ton_supply / 100),
        }, {
            id: 'dkdskas123123dk',
            token: Token.USDT,
            balance: get().usdtBalance,
            apy: Number(apy_usdt_supply),
        }];

        set({ supplies });


        const borrows = [{
            id: '1211ccc1',
            token: Token.USDT,
            liquidity: liquidity_usdt,
            apy: apy_usdt_borrow,
        },
        {
            id: '1211ccc1121',
            token: Token.TON,
            liquidity: liquidity_ton,
            apy: apy_ton_borrow,
        }];

        set({ borrows })

        const maxWithdrawUsdt = Math.abs(Number(assetBalanceUsdt) / BALANCE_DECIMAL);
        const maxWithdrawTon = Math.abs(Number(assetBalanceTon) / COUNT_DECIMAL);

        set({ maxWithdraw: { [Token.TON]: maxWithdrawTon, [Token.USDT]: maxWithdrawUsdt } });

        const maxBorrow = Math.abs(Number(availableToBorrowData) / Number(data.price));
        
        set({ maxBorrow });

        const maxRepayUsdt = Math.abs(Number(assetBalanceUsdt) / BALANCE_DECIMAL); //+t need to add
        const maxRepayTon = Math.abs(Number(assetBalanceTon) / COUNT_DECIMAL); //+t need to add
        set({ maxRepay: { [Token.TON]: maxRepayTon, [Token.USDT]: maxRepayUsdt } });

        const maxSupply = Number(get().tonBalance);
        set({ maxSupply })
    }

    setInterval(updateData, 30000);
    setTimeout(updateData, 1000)

    return {
        borrowBalance: '0',
        supplyBalance: '0',
        borrowLimitPercent: 0,
        borrowLimitValue: 0,
        availableToBorrow: '0',
        liquidityValue: {},
        maxSupply: 200,
        maxWithdraw: {},
        maxBorrow: 0,
        maxRepay: {},
        mySupplies: [],
        myBorrows: [],
        supplies: [],
        borrows: [],
        apy_usdt_borrow: 0,
        apy_ton_borrow: 0,
        apy_ton_supply: 0,
        tonBalance: '0',
        usdtBalance: '0',
        forceUpdateData: updateData
    }
});
