import axios from 'axios';
import { create } from 'zustand';

export enum Token {
    TON,
    USDT,
}

interface PriceStore {
    tonPrice: number;
    tetherPrice: number;

    formatToUsd: (value: string, token: Token) => string;
}

export const usePrices = create<PriceStore>((set, get) => {
    axios.get(`https://api.coingecko.com/api/v3/coins/the-open-network`).then(({ data }) => {
        set({ tonPrice: data.market_data.current_price.usd })
    });

    axios.get(`https://api.coingecko.com/api/v3/coins/tether`).then(({ data }) => {
        set({ tetherPrice: data.market_data.current_price.usd })
    });

    return {
        tonPrice: 0,
        tetherPrice: 0,
        formatToUsd: (value, token) => {
            if (token === Token.TON) {
                const usd = parseFloat(value) * get().tonPrice;
                return `$ ${usd.toFixed(2)}`
            }
            if (token === Token.USDT) {
                const usd = parseFloat(value) * get().tetherPrice;
                return `$ ${usd.toFixed(2)}`
            }
            return ""
        },
    }

});
