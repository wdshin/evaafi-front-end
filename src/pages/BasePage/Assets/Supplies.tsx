import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { SupplyModal } from '../../../components/Modals/SupplyModal';
import { AssetsSubWrapper, AssetsSubtitle, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { WithdrawModal } from '../../../components/Modals/WIthdrawModal';
import { useBalance } from '../../../store/balances';
import { useWallet } from '../../../store/wallet';


export interface SuppliesProps { 
    tab: string;
}


const Supplies = ({ tab }: SuppliesProps) => {
    const { callIfLoged: callIfLogin } = useWallet();
    const { mySupplies, supplies } = useBalance();
    const [supplyModalIsOpen, setSupplyModelIsOpen] = useState(false);
    const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
    const currentSupplies = tab === '1' ? mySupplies : [];
    


    return (
        <>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={supplyModalIsOpen} onClose={() => setSupplyModelIsOpen(false)}>
                <SupplyModal close={() => setSupplyModelIsOpen(false)} />
            </Dialog>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={withdrawModalIsOpen} onClose={() => setWithdrawModalIsOpen(false)}>
                <WithdrawModal close={() => setWithdrawModalIsOpen(false)} />
            </Dialog>
            <AssetsWrapper>

                <AssetsSubWrapper>
                    <AssetsTitle>Your Supplies</AssetsTitle>
                    {currentSupplies.length > 0 &&
                        <MySuppliesDescriptionBar />
                    }
                    {!currentSupplies.length &&
                        <AssetsSubtitle>Nothing supplied  yet</AssetsSubtitle>
                    }
                    {currentSupplies.map(mySupply => (
                        <MySuppliesAssetCard {...mySupply} key={mySupply.id} onClick={callIfLogin(() => setWithdrawModalIsOpen(true))} />
                    ))}

                </AssetsSubWrapper>
                <AssetsSubWrapper>
                    <AssetsTitle>Supply</AssetsTitle>
                    {supplies.length > 0 &&
                        <SupplyDescriptionBar />
                    }
                    {!supplies.length && 
                        <AssetsSubtitle>Loading market data</AssetsSubtitle>
                    }
                    {supplies.map(supply => (
                        <SupplyAssetCard {...supply} key={supply.id} onClick={callIfLogin(() => setSupplyModelIsOpen(true))} />
                    ))}
                </AssetsSubWrapper>
            </AssetsWrapper>
        </>

    )
}

export default Supplies;