import { create } from 'zustand';
import { TonConnect, Wallet, isWalletInfoInjected, WalletInfoRemote } from '@tonconnect/sdk';
import { BN } from 'bn.js'
import { fromNano, TonClient, beginCell, toNano, Address, JettonMaster, ContractProvider, Contract } from 'ton';
// import { tonweb } from 'tonweb'
import { friendlifyUserAddress, isMobile, openLink, addReturnStrategy, randomAddress } from '../utils';
import { useBalance } from './balances';

const jettonWalletAddressMain = 'EQDLqyBI-LPJZy-s2zEZFQMyF9AU-0DxDDSXc2fA-YXCJIIq' // todo calculate jeton wallet 

function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
  const bufferAsHexString = buffer.slice(start, end).toString("hex");
  return BigInt(`0x${bufferAsHexString}`);
}

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: "49d23d98ab44004b72a7be071d615ea069bde3fbdb395a958d4dfcb4e5475f54",
});


const dappMetadata = { manifestUrl: 'https://api.tonft.app/apiv1/getConfig' };
class Minter implements Contract {
  constructor(readonly address: Address) { }
  async getWalletAddress(provider: ContractProvider, address: Address) {
    const param = {
      type: 'slice',
      cell: beginCell().storeAddress(address).endCell()
    } as any;
    const { stack } = await provider.get("get_wallet_address", [param]);
    return stack.readAddress();
  }
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return stack;
    // const stack = await provider.getState();
    // return stack;
  }
}

interface AuthStore {
  isLoading: boolean;
  universalLink: string;
  userAddress: string;

  connector: TonConnect,
  wallet: Wallet | null,

  logout: () => void;
  callIfLoged: <T>(callback: (...args: T[]) => void) => ((...args: T[]) => void);
  login: () => void;
  sendTransaction: (address: string, amount: string, tokenId: string, action: string) => void;

  resetUniversalLink: () => void;
}

export const useWallet = create<AuthStore>((set, get) => {

  const connector = new TonConnect(dappMetadata);
  
  connector.onStatusChange((async (wallet) => {
    const userAddress = friendlifyUserAddress(wallet?.account.address);
    const tonBalance = fromNano(await client.getBalance(Address.parse(connector?.wallet?.account.address as string)))
    const contract = new Minter(Address.parse(jettonWalletAddressMain));
    const juserwalletEvaaMasterSC = await client.open(contract).getWalletAddress(Address.parseRaw(wallet?.account.address as string))
    const contract1 = new Minter(Address.parseFriendly(juserwalletEvaaMasterSC.toString()).address);
    
    let usdtBalance = 0;

    try {
      const juserwalletEvaaMasterSC1 = await client.open(contract1).getBalance()
      usdtBalance = juserwalletEvaaMasterSC1.readNumber() / 1000000;
    } catch(e) {
      console.log('error with get usdtBalance', e)
    }

    set(() => ({ wallet, userAddress, universalLink: '' }));
    useBalance.setState({ usdtBalance: String(usdtBalance), tonBalance });

    //@ts-ignore
    window.userAddress = Address.parseRaw(wallet?.account.address as string);

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

    callIfLoged: <T>(callback: (...args: T[]) => void) => (
      (...args: T[]) => {
        if (get().userAddress) {
          callback(...args);
        } else {
          get().login();
        }
      }
    ),

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

    sendTransaction: async (address: string, amount: string, tokenId: string, action: string) => {
      const body = beginCell()
        .endCell()

      let messages = []

      if (tokenId === 'ton') {
        if (action === 'supply' || action === 'repay') {
          const body = beginCell()
            .endCell()
          messages.push({
            address,
            amount: toNano(amount).toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else if (action === 'withdrawal' || action === 'borrow') {
          const assetAddress = bufferToBigInt(randomAddress('ton').hash) // todo change address

          const body = beginCell()
            .storeUint(60, 32)
            .storeUint(0, 64)
            .storeUint(assetAddress, 256)
            .storeUint(toNano(amount), 64)
            .endCell()

          messages.push({
            address,
            amount: toNano('0.1').toString(),
            payload: body.toBoc().toString('base64'),
          })
        }
      } else if (tokenId === 'usdt') {
        if (action === 'supply' || action === 'repay') {
          const contract = new Minter(Address.parse(jettonWalletAddressMain));
          const juserwalletEvaaMasterSC = await client.open(contract).getWalletAddress(Address.parseFriendly(address).address)
          const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            // @ts-ignore
            .storeCoins(new BN(Number(amount) * (1000000) + ''))
            .storeAddress(juserwalletEvaaMasterSC)
            .storeAddress(null) //responce add?
            .storeDict(null)
            .storeCoins(0)
            .storeMaybeRef(null) //tons to be forwarded
            .endCell()
          const juserwallet = await client.open(contract).getWalletAddress(Address.parse(connector?.wallet?.account.address as string))
          console.log(juserwallet.toString({
            urlSafe: true,
            bounceable: false,
            testOnly: true
          }))
          messages.push({
            address: juserwallet.toString({
              urlSafe: true,
              bounceable: false,
              testOnly: true
            }),
            amount: toNano('0.1').toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else if (action === 'withdraw' || action === 'borrow') {
          const assetAddress = bufferToBigInt(randomAddress('usdt').hash) // todo change address
          const body = beginCell()
            .storeUint(60, 32)
            .storeUint(0, 64)
            .storeUint(assetAddress, 256)
            .storeUint(toNano(amount), 64)
            .endCell()

          messages.push({
            address,
            amount: toNano('0.1').toString(),
            payload: body.toBoc().toString('base64'),
          })
        }
      }

      const tx = await connector.sendTransaction({
        validUntil: (new Date()).getTime() / 1000 + 5 * 1000 * 60,
        messages
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
