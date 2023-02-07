import React, { useContext, useEffect, useState } from 'react';
import { BorrowAssetCard, MyBorrowsAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { AssetsSubtitle, AssetsSubWrapper, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { BorrowDescriptionBar, MyBorrowsDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';


export interface BorrowsProps { }


const Borrows = ({} : BorrowsProps) => { 
    
    return (
        <AssetsWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Your Borrows</AssetsTitle>
                {/* <AssetsSubtitle>Nothing borrowed yet</AssetsSubtitle> */}
                <MyBorrowsDescriptionBar/>
                <MyBorrowsAssetCard/>
            </AssetsSubWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Borrow</AssetsTitle>
                <BorrowDescriptionBar/>
                <BorrowAssetCard/>
            </AssetsSubWrapper>
        </AssetsWrapper>
    )
}

export default Borrows;