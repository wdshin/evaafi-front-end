import { create } from 'zustand';
import TonWeb from 'tonweb';
import { Token } from './prices';

const httpProvider = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: '49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54' });

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
    setInterval(() => {
        httpProvider.call2('EQDiZ2DfDp5Jgk0iInQOz18fa8Oe9GYcMm0IBXu0qgBObKie', 'getAvailableToBorrow', [['num', 1]]).then(arg => {
            const borrowBalance = TonWeb.utils.fromNano(arg);
            set({ borrowBalance })
        });

    }, 5000);


    return {
        borrowBalance: '',
        supplyBalance: '123',
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
        },{
            id: 'firs123t',
            token: Token.TON,
            balance: '111',
            apy: 0.05,
            accrued: '22',
        }],
        supplies:[{
            id: 'dkdskasdk',
            token: Token.USDT,
            balance: '302',
            apy: 0.32,
        },{
            id: 'dkdsk1234asdk',
            token: Token.TON,
            balance: '2',
            apy: 0.32,
        }],
        borrows:[{
            id: '12asdfas',
            token: Token.TON,
            liquidity: '3322',
            apy: 0.3,
        },{
            id: '1211ccc1',
            token: Token.USDT,
            liquidity: '312',
            apy: 0.4,
        }],
    }
});
