import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { SupplyModal } from '../../../components/Modals/SupplyModal';
import { AssetsSubWrapper, AssetsSubtitle, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { WithdrawModal } from '../../../components/Modals/WIthdrawModal';
import { useBalance, MySupply, Supply } from '../../../store/balances';
import { useWallet } from '../../../store/wallet';


export interface SuppliesProps { 
    tab: string;
}


const Supplies = ({ tab }: SuppliesProps) => {
    const { callIfLoged: callIfLogin } = useWallet();
    const { mySupplies, supplies } = useBalance();
    const [selectedMySupply, setSelectedMySupply] = useState<MySupply | undefined>();
    const [selectedSupply, setSelectedSupply] = useState<Supply | undefined>();
    const currentMySupplies = tab === '1' ? mySupplies : [];
    const currentSupplies = tab === '1' ? supplies : [];
    


    return (
        <>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedMySupply} onClose={() => setSelectedMySupply(undefined)}>
                <WithdrawModal supply={selectedMySupply} close={() => setSelectedMySupply(undefined)} />
            </Dialog>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedSupply} onClose={() => setSelectedSupply(undefined)}>
                <SupplyModal supply={selectedSupply} close={() => setSelectedSupply(undefined)} />
            </Dialog>
            <AssetsWrapper>

                <AssetsSubWrapper>
                    <AssetsTitle>Your Supplies</AssetsTitle>
                    {currentMySupplies.length > 0 &&
                        <MySuppliesDescriptionBar />
                    }
                    {!currentMySupplies.length &&
                        <AssetsSubtitle>Nothing supplied yet</AssetsSubtitle>
                    }
                    {currentMySupplies.map(mySupply => (
                        <MySuppliesAssetCard {...mySupply} key={mySupply.id} onClick={callIfLogin(() => setSelectedMySupply(mySupply))} />
                    ))}

                </AssetsSubWrapper>
                <AssetsSubWrapper>
                    <AssetsTitle>Supply</AssetsTitle>
                    {currentSupplies.length > 0 &&
                        <SupplyDescriptionBar />
                    }
                    {!currentSupplies.length && 
                        <AssetsSubtitle>No supplies yet</AssetsSubtitle>
                    }
                    {currentSupplies.map(supply => (
                        <SupplyAssetCard {...supply} key={supply.id} onClick={callIfLogin(() => setSelectedSupply(supply))} />
                    ))}
                </AssetsSubWrapper>
            </AssetsWrapper>
        </>

    )
}

export default Supplies;