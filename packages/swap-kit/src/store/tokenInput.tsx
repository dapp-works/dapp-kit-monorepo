import { BigNumberInputState, PromiseState, RootStore, Store } from '@dappworks/kit';
import { WalletStore } from '@dappworks/kit/wallet';
import { MimoStore } from './mimo';
import BigNumber from 'bignumber.js';
import { ERC20 } from '../contracts/erc20';
import { makeAutoObservable } from 'mobx';
import { StorageState } from '../standard/StorageState';
import { Percent } from '@uniswap/sdk-core';
import { PromiseHook } from '../contract';
import axios from 'axios';
import { publicConfig } from '../config/public';
export class TokenInputStore implements Store {
  sid = 'LiquidityStore';
  fromAmount = new BigNumberInputState({});
  toAmount = new BigNumberInputState({});
  get amountLoading() {
    return this.fromAmount.loading || this.toAmount.loading;
  }
  fromToken: ERC20 | null = null;
  toToken: ERC20 | null = null;
  amountSide: 'from' | 'to' = 'from';
  get chainId() {
    return 4689
  }
  get wallet() {
    return RootStore.Get(WalletStore);
  }
  get isAmountLoading() {
    return this.fromAmount.loading || this.toAmount.loading;
  }
  settingModal = {
    slippage: new StorageState({ key: 'slippage', value: '0.5', default: '0.5' }), //1 = 1%
    dealLine: new StorageState({ key: 'dealLine', value: '60', default: '60' }), //60 min
  };
  get slippagePercent() {
    return Number(this.settingModal.slippage.value) / 100; // 1% => 0.01
  }
  get slippagePercentInstance() {
    return new Percent(this.settingModal.slippage.value * 100, 10_000);
  }

  get deadline() {
    return Math.floor(new Date().getTime() / 1000) + Number(this.settingModal.dealLine.value) * 60;
  }
  get realLPFromToken0() {
    if (!this.fromToken || !this.toToken) return;
    if (this.fromWrappedTokenAddress < this.toWrappedTokenAddress) {
      return this.fromToken;
    } else {
      return this.toToken;
    }
  }
  get realLPFromToken1() {
    if (!this.fromToken || !this.toToken) return;
    if (this.fromWrappedTokenAddress < this.toWrappedTokenAddress) {
      return this.toToken;
    } else {
      return this.fromToken;
    }
  }

  baseCheckState(callbackFn: () => any) {
    if (this.fromAmount.value.isEqualTo(0) || this.fromAmount.format == '' || this.toAmount.value.isEqualTo(0) || this.toAmount.format == '') {
      return {
        msg: 'Enter Amount',
        isDisabled: true,
      };
    }
    if (this.fromAmount?.value?.isGreaterThan(new BigNumber(this.fromToken?.balance?.value?.value ?? 0))) {
      return {
        msg: `Insufficient ${this.fromToken?.symbol.value} Balance`,
        isDisabled: true,
      };
    }
    // if (this.amountSide == 'to' && this.toAmount.value.isGreaterThan(new BigNumber(this.toToken?.balance.value.value ?? 0))) {
    //   return {
    //     msg: `Insufficient ${this.toToken?.symbol.value} Balance`,
    //     isDisabled: true
    //   }
    // }
    return callbackFn?.();
  }
  constructor(args?: Partial<TokenInputStore>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get fromWrappedTokenAddress() {
    return this.fromToken?.isEther ? this.wrappedTokenAddress : (this.fromToken?.address as `0x${string}`);
  }

  get toWrappedTokenAddress() {
    return this.toToken?.isEther ? this.wrappedTokenAddress : (this.toToken?.address as `0x${string}`);
  }

  get fromSymbolOrAddress() {
    return this.fromToken?.isEther ? this.fromToken?.symbol.value : ((this.fromToken?.address ?? '') as `0x${string}`);
  }
  get toSymbolOrAddress() {
    return this.toToken?.isEther ? this.toToken?.symbol.value : ((this.toToken?.address ?? '') as `0x${string}`);
  }

  get isRightSide() {
    try {
      return this.fromWrappedTokenAddress < this.toWrappedTokenAddress;
    } catch (error) {
      return false;
    }
  }

  fromWrappedToken = PromiseHook.wrap({
    func: async () => {
      if (this.fromToken?.isEther) {
        return (await ERC20.Get({ args: { address: this.wrappedTokenAddress, chainId: this.chainId } })) as ERC20;
      }
      return this.fromToken;
    },
  });

  toWrappedToken = PromiseHook.wrap({
    func: async () => {
      if (this.toToken?.isEther) {
        return await ERC20.Get({ args: { address: this.wrappedTokenAddress, chainId: this.chainId } });
      }
      return this.toToken;
    },
  });

  get fromEtherSymbolOrAddress() {
    return this.fromToken?.isEther ? this.fromToken?.symbol.value : this.fromToken?.address;
  }

  get toEtherSymbolOrAddress() {
    return this.toToken?.isEther ? this.toToken?.symbol.value : this.toToken?.address;
  }

  get wrappedTokenAddress() {
    return RootStore.Get(MimoStore).wrappedTokenAddress;
  }
  get hasWToken() {
    return RootStore.Get(MimoStore).hasWToken;
  }
  get TokenList() {
    return RootStore.Get(MimoStore).tokenList.value;
  }

  get handleToken() {
    return {
      from: this.fromToken?.isEther ? this.fromToken?.symbol.value : this.fromToken?.address || this.fromToken?.symbol,
      to: this.toToken?.isEther ? this.toToken?.symbol.value : this.toToken?.address || this.toToken?.symbol,
    };
  }

  changeSwapSide() {
    if (!this.fromToken || !this.toToken) return;
    this.amountSide = this.amountSide == 'from' ? 'to' : 'from';
    [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    [this.fromAmount, this.toAmount] = [this.toAmount, this.fromAmount];
    if (this.hasWToken) return;
  }

  changeTokenSide() {
    const fromToken = this.fromToken;
    const toToken = this.toToken;
    this.onSelectFromToken(toToken!);
    this.onSelectToToken(fromToken!);
  }

  clearToken() {
    this.fromToken = null;
    this.toToken = null;
    this.fromAmount.setFormat('');
    this.toAmount.setFormat('');
  }
  clearFormat() {
    this.fromAmount.setFormat('');
    this.toAmount.setFormat('');
    this.fromAmount.loading = false;
    this.toAmount.loading = false;
  }
  clearFormatAndRefreshBalance() {
    this.fromAmount.setFormat('');
    this.toAmount.setFormat('');
    this.fromToken?.balance.call();
    this.toToken?.balance.call();
    this.wallet.balance.call();
  }

  async onSelectFromToken(token: ERC20 | undefined, callbackFn?: () => Promise<any> | any, checkWrappedToken: boolean = false) {
    if (!token) return;
    if (checkWrappedToken) {
      if ((this.toToken?.isEther && token.isWrapped) || (this.toToken?.isWrapped && token.isEther)) {
        this.clearToken();
      }
    }

    this.fromToken = token;
    this.fromAmount.setDecimals(token.decimals.value);
    this.fromAmount.setFormat('');
    this.toAmount.loading = true;
    this.fromToken?.priceUSD?.call(true);
    if (this.toToken) {
      this.toAmount.loading = true;
    }
    await callbackFn?.();
    this.toAmount.loading = false;
  }

  async onSelectToToken(token: ERC20 | undefined, callbackFn?: () => Promise<any> | any, checkWrappedToken: boolean = false) {
    if (!token) return;
    if (checkWrappedToken) {
      console.log(checkWrappedToken);
      if ((this.fromToken?.isEther && token.isWrapped) || (this.fromToken?.isWrapped && token.isEther)) {
        this.clearToken();
        return this.onSelectFromToken(token, callbackFn, checkWrappedToken);
      }
    }
    this.toToken = token;
    this.toAmount.setDecimals(token.decimals.value);
    this.toAmount.setFormat('');
    if (this.fromToken) {
      this.fromAmount.loading = true;
    }
    await callbackFn?.();
    this.toToken?.priceUSD?.call(true);
    this.fromAmount.loading = false;
  }

  async onChangeFromAmount(value: string | BigNumber, callbackFn?: () => Promise<any>) {
    try {
      typeof value === 'string' ? this.fromAmount.setFormat(value) : this.fromAmount.setValue(value);
      this.amountSide = 'from';
      // Set loading immediately when user inputs
      if (this.toToken && value && value !== '' && value !== '0') {
        this.toAmount.loading = true;
      }
      await callbackFn?.();
      this.toAmount.loading = false;
    } catch (error) {
      this.toAmount.loading = false;
    }
  }

  async onChangeToAmount(value: string | BigNumber, callbackFn?: () => Promise<any>) {
    try {
      typeof value === 'string' ? this.toAmount.setFormat(value) : this.toAmount.setValue(value);
      this.amountSide = 'to';
      // Set loading immediately when user inputs
      if (this.fromToken && value && value !== '' && value !== '0') {
        this.fromAmount.loading = true;
      }
      await callbackFn?.();
      this.fromAmount.loading = false;
    } catch (error) {
      this.fromAmount.loading = false;
    }
  }

  // Balance/symbol refresh, called from token input/select components. Not
  // routing glue (that lives app-side); kept here as it's pure store state.
  checkTokenValid(router: any, pathname?: string) {
    this.fromToken?.balance.call();
    this.toToken?.balance.call();
    this.fromToken?.symbol.call();
    this.toToken?.symbol.call();
    if (!this.wallet.account || router?.pathname == '/add/[...address]') return;
  }
}
