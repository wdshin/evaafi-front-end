import React, { useContext, useEffect, useState } from 'react';
import { MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { AssetsSubtitle, AssetsSubWrapper, AssetsTitle, AssetsWrapper } from './AssetsStyles';


export interface SuppliesProps { }


const Supplies = ({} : SuppliesProps) => { 
    
    return (
        <AssetsWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Your Supplies</AssetsTitle>
                {/* <AssetsSubtitle>Nothing supplied  yet</AssetsSubtitle> */}
                <MySuppliesDescriptionBar/>
                <MySuppliesAssetCard/>
            </AssetsSubWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Supply</AssetsTitle>
                <SupplyDescriptionBar/>
                <SupplyAssetCard/>
            </AssetsSubWrapper>
        </AssetsWrapper>
    )
}

export default Supplies;