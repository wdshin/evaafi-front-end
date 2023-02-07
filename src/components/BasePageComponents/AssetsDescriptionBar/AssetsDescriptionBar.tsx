import React from 'react';
import { BorderDivBottom, BorderDivTop, AssetsDescriptionBarWrapper, AssetsDescriptionText } from './AssetsDescriptionBarStyles';


export interface AssetsDescriptionBarProps { }

export const SupplyDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={52.5}>Wallet Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={38.1}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

export const MySuppliesDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={52.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={38.1}>APY/Earned</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

export const BorrowDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={52.5}>Liquidity</AssetsDescriptionText>
            <AssetsDescriptionText right={38.1}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}
export const MyBorrowsDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={52.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={38.1}>APY/Acrrued</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

