import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { SupplyModal } from '../../../components/Modals/SupplyModal';
import { AssetsSubtitle, AssetsSubWrapper, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { WithdrawModal } from '../../../components/Modals/WIthdrawModal';


export interface SuppliesProps { }


const Supplies = ({} : SuppliesProps) => { 
    const [supplyModalIsOpen, setSupplyModelIsOpen] = useState(false);
    const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);


    return (
        <>
           <Dialog className={`w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={supplyModalIsOpen} onClose={() => setSupplyModelIsOpen(false)}>
                <SupplyModal close={() => setSupplyModelIsOpen(false)}/>
            </Dialog>
           <Dialog className={`w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={withdrawModalIsOpen} onClose={() => setWithdrawModalIsOpen(false)}>
                <WithdrawModal close={() => setWithdrawModalIsOpen(false)}/>
            </Dialog>
            <AssetsWrapper>
                
                <AssetsSubWrapper>
                    <AssetsTitle>Your Supplies</AssetsTitle>
                    {/* <AssetsSubtitle>Nothing supplied  yet</AssetsSubtitle> */}
                    <MySuppliesDescriptionBar/>
                    <MySuppliesAssetCard onClick={() => setWithdrawModalIsOpen(true)}/>
                </AssetsSubWrapper>
                <AssetsSubWrapper>
                    <AssetsTitle>Supply</AssetsTitle>
                    <SupplyDescriptionBar/>
                    <SupplyAssetCard onClick={() => setSupplyModelIsOpen(true)}/>
                </AssetsSubWrapper>
            </AssetsWrapper>
        </>
        
    )
}

export default Supplies;