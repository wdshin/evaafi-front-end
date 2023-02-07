import React from 'react';
import { AssetCardLogo, AssetCardText, AssetCardTextSimple, AssetCardWrapper, AssetWrapper, DoubleTextLower, DoubleTextUpper, DoubleTextWrapper } from './AssetCardStyles';
import TONLogo from '../../../assets/pictures/ton_asset.png';
import USDTLogo from '../../../assets/pictures/usdt_asset.png';
import { AssetCardButton } from '../../Buttons/Buttons';


export interface AssetCardProps { }

export const SupplyAssetCard = ({} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TONLogo}/>
                <AssetCardTextSimple>TON</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={52.5}>100</AssetCardText>
            <AssetCardText right={38.1}>3.12%</AssetCardText>
            <AssetCardButton right={0}>Supply</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MySuppliesAssetCard = ({} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TONLogo}/>
                <AssetCardTextSimple>TON</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={52.5}>
                <DoubleTextUpper>30 TON</DoubleTextUpper>
                <DoubleTextLower>66 $</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapper right={38.1}>
                <DoubleTextUpper>3.12%</DoubleTextUpper>
                <DoubleTextLower>2.1 TON</DoubleTextLower>
            </DoubleTextWrapper>
            <AssetCardButton right={0}>Withdraw</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const BorrowAssetCard = ({} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={USDTLogo}/>
                <AssetCardTextSimple>USDT</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={52.5}>2280</AssetCardText>
            <AssetCardText right={38.1}>5.4%</AssetCardText>
            <AssetCardButton right={0}>Borrow</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MyBorrowsAssetCard = ({} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={USDTLogo}/>
                <AssetCardTextSimple>USDT</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={52.5}>
                <DoubleTextUpper>15 $</DoubleTextUpper>
                <DoubleTextLower>15 USDT</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapper right={38.1}>
                <DoubleTextUpper>5.4%</DoubleTextUpper>
                <DoubleTextLower>1.4 USDT</DoubleTextLower>
            </DoubleTextWrapper>
            <AssetCardButton right={0}>Repay</AssetCardButton>
        </AssetCardWrapper>
    )
}

