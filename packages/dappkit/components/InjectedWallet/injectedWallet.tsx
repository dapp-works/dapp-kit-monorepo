import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {
  InjectedWallet,
} from "@thirdweb-dev/wallets";
import { InjectedConnectUI } from "./InjectedConnectUI";

type MetamaskWalletOptions = {
  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const injectedWallet = (
  options?: MetamaskWalletOptions,
  // @ts-ignore 
): WalletConfig<InjectedWallet> => {
  return {
    id: InjectedWallet.id,
    recommended: options?.recommended,
    meta: {
      ...InjectedWallet.meta,
      name: "Injected Wallet",
      iconURL: "data:image/webp;base64,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",
    },
    create: (walletOptions: WalletOptions) => {
      console.log(walletOptions)
      const wallet = new InjectedWallet({
        ...walletOptions,
      });
      return wallet;
    },
    connectUI: InjectedConnectUI,
    isInstalled() {
      return true
    },
  };
};