import React from 'react';
import { BorderDivBottom, BorderDivTop, AssetsDescriptionBarWrapper, AssetsDescriptionText } from './AssetsDescriptionBarStyles';


export interface AssetsDescriptionBarProps { }

export const SupplyDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={42.5}>Wallet Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={30.6}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

export const MySuppliesDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={42.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={30.6}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

export const BorrowDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={42.5}>Liquidity</AssetsDescriptionText>
            <AssetsDescriptionText right={30.6}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}
export const MyBorrowsDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionText>Asset</AssetsDescriptionText>
            <AssetsDescriptionText right={42.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionText right={30.6}>APY</AssetsDescriptionText>
        </AssetsDescriptionBarWrapper>
    )
}

