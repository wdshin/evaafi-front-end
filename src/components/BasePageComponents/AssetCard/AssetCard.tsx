import React from 'react';
import { AssetCardLogo, AssetCardText, AssetCardTextSimple, AssetCardWrapper, AssetWrapper, DoubleTextLower, DoubleTextUpper, DoubleTextWrapper } from './AssetCardStyles';
import TONLogo from '../../../assets/pictures/ton_asset.png';
import USDTLogo from '../../../assets/pictures/usdt_asset.png';
import { AssetCardButton } from '../../Buttons/Buttons';
import { Token } from '../../../store/prices';
import { usePrices, TokenMap } from '../../../store/prices';
import { useBalance } from '../../../store/balances';
import { formatPercent } from '../../../utils';


export interface AssetCardProps {
    token: Token;
    balance?: string;
    apy: number;
    earned?: string;
    accrued?: string,
    liquidity?: string;
    onClick?: () => void;
}

export const SupplyAssetCard = ({ onClick, token, balance, apy } : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={45.5}>{balance} {TokenMap[token].ticker}</AssetCardText>
            <AssetCardText right={30.1}>{formatPercent(apy)}</AssetCardText>
            <AssetCardButton onClick={onClick} right={0}>Supply</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MySuppliesAssetCard = ({ onClick, token, balance, apy, earned } : AssetCardProps) => {    
    const {formatToUsd} = usePrices();
    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={45.5}>
                <DoubleTextUpper>{balance} {TokenMap[token].ticker}</DoubleTextUpper>
                <DoubleTextLower>{formatToUsd(balance, token)}</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapper right={30.1}>
                <DoubleTextUpper>{formatPercent(apy)}</DoubleTextUpper>
                <DoubleTextLower>{earned} {TokenMap[token].ticker}</DoubleTextLower>
            </DoubleTextWrapper>
            <AssetCardButton onClick={onClick} right={0}>Withdraw</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const BorrowAssetCard = ({ onClick, token, liquidity, apy} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={45.5}>{liquidity}</AssetCardText>
            <AssetCardText right={30.1}>{formatPercent(apy)}</AssetCardText>
            <AssetCardButton onClick={onClick} right={0}>Borrow</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MyBorrowsAssetCard = ({ onClick, token, balance, apy, accrued} : AssetCardProps) => {    
    const {formatToUsd} = usePrices();
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={45.5}>
                <DoubleTextUpper>{balance} {TokenMap[token].ticker}</DoubleTextUpper>
                <DoubleTextLower>{formatToUsd(balance, token)}</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapper right={30.1}>
                <DoubleTextUpper>{accrued} {TokenMap[token].ticker}</DoubleTextUpper>
                <DoubleTextLower>{formatPercent(apy)}</DoubleTextLower>
            </DoubleTextWrapper>
            <AssetCardButton onClick={onClick} right={0}>Repay</AssetCardButton>
        </AssetCardWrapper>
    )
}

