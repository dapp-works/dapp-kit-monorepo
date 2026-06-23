import { PromiseState, RootStore } from "@dappworks/kit";
import { PromiseHook } from "../contract";
import { hooks } from "../lib/hooks";
import { Contracts } from ".";
import { WalletStore } from "@dappworks/kit/wallet";
import BigNumber from "bignumber.js";
import { ERC20 } from "./erc20";
import { AllowanceTransfer, PermitSingle } from '@uniswap/permit2-sdk';

export class Permit2 {
  static address: `0x${string}` = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
  static chainId: number = 4689;
  static signature = ''
  static permitData: { domain: any; types: any; values: any; } | null = null

  static clearSignature = () => {
    Permit2.signature = ''
    Permit2.permitData = null
  }

  static signPermit = new PromiseState({
    function: async ({ domain, types, values }) => {
      const wallet = RootStore.Get(WalletStore);
      const signature = await wallet.walletClient.signTypedData({
        account: wallet.account!,
        //@ts-ignore
        domain: domain,
        //@ts-ignore
        types: types,
        primaryType: 'PermitSingle',
        //@ts-ignore
        message: values
      });
      Permit2.signature = signature
      Permit2.permitData = {
        domain: domain,
        types: types,
        values: values
      }
      return signature
    }
  });

}
