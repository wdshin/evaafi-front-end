import { useState } from 'react';
import { BorrowAssetCard, MyBorrowsAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import { AssetsSubtitle, AssetsSubWrapper, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { BorrowDescriptionBar, MyBorrowsDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { BorrowModal } from '../../../components/Modals/BorrowModal';
import { Dialog } from '@headlessui/react';
import { RepayModal } from '../../../components/Modals/RepayModal';
import { useBalance } from '../../../store/balances';


export interface BorrowsProps { }


const Borrows = ({ }: BorrowsProps) => {
    const { myBorrows, borrows } = useBalance();
    const [BorrowModalIsOpen, setBorrowModelIsOpen] = useState(false);
    const [RepayModalIsOpen, setRepayModalIsOpen] = useState(false);

    return (
        <AssetsWrapper>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={BorrowModalIsOpen} onClose={() => setBorrowModelIsOpen(false)}>
                <BorrowModal close={() => setBorrowModelIsOpen(false)} />
            </Dialog>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={RepayModalIsOpen} onClose={() => setRepayModalIsOpen(false)}>
                <RepayModal close={() => setRepayModalIsOpen(false)} />
            </Dialog>
            <AssetsSubWrapper>
                <AssetsTitle>Your Borrows</AssetsTitle>
                {myBorrows.length > 0 &&
                    <MyBorrowsDescriptionBar />
                }
                {!myBorrows.length &&
                    <AssetsSubtitle>Nothing borrowed yet</AssetsSubtitle>
                }
                {myBorrows.map(myBorrow => (
                    <MyBorrowsAssetCard {...myBorrow} key={myBorrow.id} onClick={() => setRepayModalIsOpen(true)} />
                ))}
            </AssetsSubWrapper>
            <AssetsSubWrapper>
                <AssetsTitle>Borrow</AssetsTitle>
                {borrows.length > 0 &&
                    <BorrowDescriptionBar />
                }
                {!borrows.length &&
                    <AssetsSubtitle>Loading market data</AssetsSubtitle>
                }
                {borrows.map(borrow => (
                    <BorrowAssetCard {...borrow} key={borrow.id} onClick={() => setBorrowModelIsOpen(true)} />
                ))}
            </AssetsSubWrapper>
        </AssetsWrapper>
    )
}

export default Borrows;