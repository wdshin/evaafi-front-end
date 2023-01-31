
import { Dialog } from '@headlessui/react';
import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValueLoadable } from 'recoil';
import { addReturnStrategy, connector } from '../../connector';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { useSlicedAddress } from '../../hooks/useSlicedAddress';
import { useTonWallet } from '../../hooks/useTonWallet';
import { useTonWalletConnectionError } from '../../hooks/useTonWalletConnectionError';
import { walletsListQuery } from '../../state/wallets-list';
import { isDesktop, isMobile, openLink } from '../../utils';
import LoadingComponent from '../LodingComponent/LoadingComponent';
import { QRModal } from '../Modal/Modal';
import { BlueButton, WalletNumWithMenu } from './AuthButtonStyles';

export function AuthButton() {
	const { t, i18n } = useTranslation(); 
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const isMobileCustom = window.innerWidth < 768;
	const [modalUniversalLink, setModalUniversalLink] = useState('');
	const forceUpdate = useForceUpdate();
	const wallet = useTonWallet();
	const onConnectErrorCallback = useCallback(() => {
		setModalUniversalLink('');
		notification.error({
			message: 'Connection was rejected',
			description: 'Please approve connection to the TONFT in your wallet.',
		});
	}, []);
	useTonWalletConnectionError(onConnectErrorCallback);

	const walletsList = useRecoilValueLoadable(walletsListQuery);

	const address = useSlicedAddress(wallet?.account.address, wallet?.account.chain);
	
	useEffect(() => {
		if (modalUniversalLink && wallet) {
			navigate(0);
			setModalUniversalLink('');
		}

	}, [modalUniversalLink, wallet]);

	useEffect(() => {
		if (wallet && loading === true) {
			navigate(0);
			setLoading(false);
		}

	}, [wallet]);


	const handleButtonClick = useCallback(async () => {
		// Use loading screen/UI instead (while wallets list is loading)
		// if (!(walletsList.state === 'hasValue')) {
		// 	setTimeout(handleButtonClick, 200);
		// }
		setLoading(true);

		if (!isDesktop() && walletsList.contents.embeddedWallet) {
			connector.connect({ jsBridgeKey: walletsList.contents.embeddedWallet.jsBridgeKey });
			return;
		}
		
		const tonkeeperConnectionSource = {
			universalLink: walletsList.contents.walletsList[0].universalLink,
			bridgeUrl: walletsList.contents.walletsList[0].bridgeUrl,
		};
		
		const universalLink = connector.connect(tonkeeperConnectionSource);
		
		if (isMobile()) {
			openLink(addReturnStrategy(universalLink, 'none'), '_blank');
		} else {
			setModalUniversalLink(universalLink);
		}
	}, [walletsList]);

	if (!(walletsList.state === 'hasValue')) {
		// console.log(wallet)
		return <LoadingComponent/>;
	}

	

	return (
		<>
			{wallet ? (
				<WalletNumWithMenu address={address} onDisconnect={() => {
					connector.disconnect();
					navigate(0);
				}}/>
			) : (
				<BlueButton onClick={() => handleButtonClick()}>{t("basePage.addWallet")}</BlueButton>
			)}
			<Dialog className={`w-full h-full  absolute bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!modalUniversalLink} onClose={() => setModalUniversalLink('')}>
				<QRModal close={() => setModalUniversalLink('')} link={modalUniversalLink}/>
			</Dialog>
		</>
	);
}


