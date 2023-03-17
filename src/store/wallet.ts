import { create } from 'zustand';
import { TonConnect, Wallet, isWalletInfoInjected, WalletInfoRemote } from '@tonconnect/sdk';
import { toNano } from 'ton';

import { friendlifyUserAddress, isMobile, openLink, addReturnStrategy } from '../utils';

const dappMetadata = { manifestUrl: 'https://api.tonft.app/apiv1/getConfig' };

interface AuthStore {
  isLoading: boolean;
  universalLink: string;
  userAddress: string;

  connector: TonConnect,
  wallet: Wallet | null,

  logout: () => void;
  login: () => void;
  sendTransaction: (address: string, amount: string, payload?: string) => void;

  resetUniversalLink: () => void;
}

export const useWallet = create<AuthStore>((set) => {
  const connector = new TonConnect(dappMetadata);
  connector.onStatusChange((wallet => {
    const userAddress = friendlifyUserAddress(wallet?.account.address);

    set(() => ({ wallet, userAddress, universalLink: '' }));
  }), console.error);

  connector.restoreConnection().then(() => {
    set({ isLoading: false });
  })

  return {
    isLoading: true,
    universalLink: '',
    userAddress: friendlifyUserAddress(connector?.wallet?.account.address),
    connector,

    wallet: connector.wallet,

    logout: () => {
      connector.disconnect();
    },
    login: async () => {
      const walletsList = await connector.getWallets();
      const embeddedWallet = walletsList.filter(isWalletInfoInjected).find((wallet) => wallet.embedded);
      const tonkeeperConnectionWallet = walletsList.find((wallet) => wallet.name === "Tonkeeper") as WalletInfoRemote;

      if (embeddedWallet) {
        connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
        return;
      }

      const tonkeeperConnectionSource = {
        universalLink: tonkeeperConnectionWallet.universalLink,
        bridgeUrl: tonkeeperConnectionWallet.bridgeUrl,
      };

      const universalLink = connector.connect(tonkeeperConnectionSource) || '';

      if (isMobile()) {
        openLink(addReturnStrategy(universalLink, 'none'), '_blank');
      } else {
        set({ universalLink });
      }

    },

    sendTransaction: async (address: string, amount: string, payload?: string) => {
      console.log(address)
      console.log(amount)

      const tx = await connector.sendTransaction({
        validUntil: (new Date()).getTime() / 1000 + 5 * 1000 * 60,
        messages: [
          {
            address,
            amount: toNano(amount).toString(),
            payload
          }
        ]
      });
      if (tx.boc) {
        alert('tx done')
      } else {
        alert('something went wrong')
      }
    },

    resetUniversalLink: () => {
      set({ universalLink: undefined });
    }
  }
})
