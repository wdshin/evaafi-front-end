import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { SupplyModal } from '../../../components/Modals/SupplyModal';
import { AssetsSubWrapper, AssetsSubtitle, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { WithdrawModal } from '../../../components/Modals/WIthdrawModal';
import { useBalance } from '../../../store/balances';


export interface SuppliesProps { }


const Supplies = ({ }: SuppliesProps) => {
    const { mySupplies, supplies } = useBalance();
    const [supplyModalIsOpen, setSupplyModelIsOpen] = useState(false);
    const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);


    return (
        <>
            <Dialog className={`w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={supplyModalIsOpen} onClose={() => setSupplyModelIsOpen(false)}>
                <SupplyModal close={() => setSupplyModelIsOpen(false)} />
            </Dialog>
            <Dialog className={`w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={withdrawModalIsOpen} onClose={() => setWithdrawModalIsOpen(false)}>
                <WithdrawModal close={() => setWithdrawModalIsOpen(false)} />
            </Dialog>
            <AssetsWrapper>

                <AssetsSubWrapper>
                    <AssetsTitle>Your Supplies</AssetsTitle>
                    {mySupplies.length > 0 &&
                        <MySuppliesDescriptionBar />
                    }
                    {!mySupplies.length &&
                        <AssetsSubtitle>Nothing supplied  yet</AssetsSubtitle>
                    }
                    {mySupplies.map(mySupply => (
                        <MySuppliesAssetCard {...mySupply} key={mySupply.id} onClick={() => setWithdrawModalIsOpen(true)} />
                    ))}

                </AssetsSubWrapper>
                <AssetsSubWrapper>
                    <AssetsTitle>Supply</AssetsTitle>
                    {supplies.length > 0 &&
                        <SupplyDescriptionBar />
                    }
                    {!supplies.length && 
                        <AssetsSubtitle>Nothing to show</AssetsSubtitle>
                    }
                    {supplies.map(supply => (
                        <SupplyAssetCard {...supply} key={supply.id} onClick={() => setSupplyModelIsOpen(true)} />
                    ))}
                </AssetsSubWrapper>
            </AssetsWrapper>
        </>

    )
}

export default Supplies;