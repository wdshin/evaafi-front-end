import { useState } from 'react';
import { BorrowAssetCard, MyBorrowsAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { AssetsSubtitle, AssetsSubWrapper, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { BorrowDescriptionBar, MyBorrowsDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { BorrowModal } from '../../../components/Modals/BorrowModal';
import { Dialog } from '@headlessui/react';
import { RepayModal } from '../../../components/Modals/RepayModal';
import { useBalance, Borrow, MyBorrow } from '../../../store/balances';
import { useWallet } from '../../../store/wallet';


export interface BorrowsProps { 
    tab: string;
}


const Borrows = ({ tab }: BorrowsProps) => {
    const { callIfLoged: callIfLogin } = useWallet();
    const { myBorrows, borrows } = useBalance();
    const [selectedMyBorrow, setSelectedMyBorrow] = useState<MyBorrow | undefined>();
    const [selectedBorrow, setSelectedBorrow] = useState<Borrow | undefined>();
    const currentMyBorrows = tab === '1' ? myBorrows : [];
    const currentBorrows = tab === '1' ? borrows : [];

    return (
        <AssetsWrapper>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedMyBorrow} onClose={() => setSelectedMyBorrow(undefined)}>
                <BorrowModal borrow={selectedMyBorrow} close={() => setSelectedMyBorrow(undefined)} />
            </Dialog>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedBorrow} onClose={() => setSelectedBorrow(undefined)}>
                <RepayModal borrow={selectedBorrow} close={() => setSelectedBorrow(undefined)} />
            </Dialog>
            <AssetsSubWrapper>
                <AssetsTitle>Your Borrows</AssetsTitle>
                {currentMyBorrows.length > 0 &&
                    <MyBorrowsDescriptionBar />
                }
                {!currentMyBorrows.length &&
                    <AssetsSubtitle>Nothing borrowed yet</AssetsSubtitle>
                }
                {currentMyBorrows.map(myBorrow => (
                    <MyBorrowsAssetCard {...myBorrow} key={myBorrow.id} onClick={callIfLogin(() => setSelectedMyBorrow(myBorrow))} />
                ))}
            </AssetsSubWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Borrow</AssetsTitle>
                {currentBorrows.length > 0 &&
                    <BorrowDescriptionBar />
                }
                {!currentBorrows.length &&
                    <AssetsSubtitle>No borrows yet</AssetsSubtitle>
                }
                {currentBorrows.map(borrow => (
                    <BorrowAssetCard {...borrow} key={borrow.id} onClick={callIfLogin(() => setSelectedBorrow(borrow))} />
                ))}
            </AssetsSubWrapper>
        </AssetsWrapper>
    )
}

export default Borrows;